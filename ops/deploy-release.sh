#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 /absolute/path/to/out <git-short-sha>" >&2
  exit 64
fi

artifact_dir="$(readlink -f -- "$1")"
release_sha="$2"
app_root="/var/www/haski-next"
releases_root="$app_root/releases"
backups_root="$app_root/backups"
current_link="$app_root/current"
nginx_available="/etc/nginx/sites-available/haski.parkskazka.ru.conf"
nginx_enabled="/etc/nginx/sites-enabled/haski.parkskazka.ru.conf"
nginx_snippet="/etc/nginx/snippets/haski-security-headers.conf"
nginx_config_source="${NGINX_CONFIG_SOURCE:-}"
nginx_headers_source="${NGINX_HEADERS_SOURCE:-}"

if [[ ! -d "$artifact_dir" || "$artifact_dir" == "/" || ! -f "$artifact_dir/artifact-manifest.sha256" ]]; then
  echo "Refusing release: artifact directory or SHA-256 manifest is invalid." >&2
  exit 65
fi
if [[ ! "$release_sha" =~ ^[0-9a-f]{7,40}$ ]]; then
  echo "Refusing release: git SHA must contain 7-40 lowercase hex characters." >&2
  exit 65
fi

(cd "$artifact_dir" && sha256sum --check artifact-manifest.sha256)
for required in index.html sitemap.xml dogs/adel.html site.webmanifest; do
  [[ -f "$artifact_dir/$required" ]] || { echo "Missing release file: $required" >&2; exit 66; }
done
grep -Fq 'https://haski.parkskazka.ru/dogs/adel' "$artifact_dir/sitemap.xml"
if [[ -n "$nginx_config_source" && ! -f "$nginx_config_source" ]]; then
  echo "Refusing release: NGINX_CONFIG_SOURCE does not exist." >&2
  exit 65
fi
if [[ -n "$nginx_headers_source" && ! -f "$nginx_headers_source" ]]; then
  echo "Refusing release: NGINX_HEADERS_SOURCE does not exist." >&2
  exit 65
fi

release_id="$(date -u +%Y%m%d-%H%M%S)-${release_sha:0:12}"
release_dir="$releases_root/$release_id"
temporary_link="$app_root/.current-$release_id"

install -d -m 0755 "$releases_root" "$backups_root"
install -d -m 0755 "$release_dir"
rsync -a --delete -- "$artifact_dir/" "$release_dir/"

old_target=""
if [[ -L "$current_link" ]]; then
  old_target="$(readlink -f -- "$current_link")"
  printf '%s\n' "$old_target" > "$backups_root/current-before-$release_id.txt"
elif [[ -d "$app_root/out" ]]; then
  old_target="$app_root/out"
  tar -C "$app_root" -czf "$backups_root/out-before-$release_id.tar.gz" out
fi
for vhost in \
  /etc/nginx/sites-available/haski.parkskazka.ru \
  /etc/nginx/sites-available/haski.parkskazka.ru.conf \
  /etc/nginx/sites-enabled/haski.parkskazka.ru.conf; do
  if [[ -f "$vhost" ]]; then
    vhost_scope="$(basename "$(dirname "$vhost")")"
    cp -a "$vhost" "$backups_root/nginx-${vhost_scope}-$(basename "$vhost")-before-$release_id"
  fi
done
available_backup="$backups_root/nginx-available-before-$release_id.conf"
enabled_backup="$backups_root/nginx-enabled-before-$release_id.conf"
snippet_backup="$backups_root/nginx-snippet-before-$release_id.conf"
[[ -f "$nginx_available" ]] && cp -a "$nginx_available" "$available_backup"
[[ -f "$nginx_enabled" ]] && cp -a "$nginx_enabled" "$enabled_backup"
[[ -f "$nginx_snippet" ]] && cp -a "$nginx_snippet" "$snippet_backup"

nginx -t
ln -s -- "$release_dir" "$temporary_link"
mv -Tf -- "$temporary_link" "$current_link"

rollback() {
  if [[ -n "$old_target" ]]; then
    ln -s -- "$old_target" "$temporary_link"
    mv -Tf -- "$temporary_link" "$current_link"
  else
    unlink "$current_link"
  fi
  [[ -f "$available_backup" ]] && cp -a "$available_backup" "$nginx_available"
  [[ -f "$enabled_backup" ]] && cp -a "$enabled_backup" "$nginx_enabled"
  if [[ -f "$snippet_backup" ]]; then
    cp -a "$snippet_backup" "$nginx_snippet"
  elif [[ -n "$nginx_headers_source" && -f "$nginx_snippet" ]]; then
    unlink "$nginx_snippet"
  fi
}

if [[ -n "$nginx_headers_source" ]]; then
  install -m 0644 "$nginx_headers_source" "$nginx_snippet"
fi
if [[ -n "$nginx_config_source" ]]; then
  install -m 0644 "$nginx_config_source" "$nginx_available"
  install -m 0644 "$nginx_config_source" "$nginx_enabled"
fi

if ! nginx -t; then
  rollback
  nginx -t
  echo "Release rolled back because nginx validation failed." >&2
  exit 67
fi

systemctl reload nginx

expected_index_hash="$(sha256sum "$release_dir/index.html" | cut -d' ' -f1)"
public_index_hash="$(curl --fail --silent --show-error --max-time 15 https://haski.parkskazka.ru/ | sha256sum | cut -d' ' -f1)"
if [[ "$public_index_hash" != "$expected_index_hash" ]]; then
  rollback
  nginx -t
  systemctl reload nginx
  echo "Release rolled back because the public index hash does not match the artifact." >&2
  exit 68
fi

for route in / /dogs/adel /search /visit /site.webmanifest; do
  curl --fail --silent --show-error --max-time 15 "https://haski.parkskazka.ru$route" > /dev/null || {
    rollback
    nginx -t
    systemctl reload nginx
    echo "Release rolled back because public smoke failed: $route" >&2
    exit 68
  }
done

echo "Active release: $release_dir"
