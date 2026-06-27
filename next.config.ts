import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Статический экспорт: пререндеренный HTML под текущий nginx, без Node-рантайма.
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  // Фиксируем корень монорепо-трейсинга (рядом несколько lockfile).
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;
