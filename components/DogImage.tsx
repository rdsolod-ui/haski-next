type DogImageProps = {
  slug: string;
  alt: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  className?: string;
};

export function localDogCover(slug: string, width: 480 | 900 = 900, format: "webp" | "avif" = "webp") {
  return `/media/dogs/${slug}-${width}.${format}`;
}

export function localDogPortrait(slug: string, width: 480 | 900 = 900, format: "webp" | "avif" = "webp") {
  return `/media/portraits-v2/${slug}-${width}.${format}`;
}

export default function DogImage({
  slug,
  alt,
  loading = "lazy",
  fetchPriority = "auto",
  sizes = "(max-width: 640px) 92vw, (max-width: 1100px) 45vw, 280px",
  className,
}: DogImageProps) {
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${localDogPortrait(slug, 480, "avif")} 480w, ${localDogPortrait(slug, 900, "avif")} 900w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`${localDogPortrait(slug, 480)} 480w, ${localDogPortrait(slug, 900)} 900w`}
        sizes={sizes}
      />
      <source
        type="image/avif"
        srcSet={`${localDogCover(slug, 480, "avif")} 480w, ${localDogCover(slug, 900, "avif")} 900w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`${localDogCover(slug, 480)} 480w, ${localDogCover(slug, 900)} 900w`}
        sizes={sizes}
      />
      <img
        src={localDogCover(slug, 900)}
        srcSet={`${localDogCover(slug, 480)} 480w, ${localDogCover(slug, 900)} 900w`}
        sizes={sizes}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        width={900}
        height={1125}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
