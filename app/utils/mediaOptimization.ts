/**
 * Media optimization helpers for Cloudinary and responsive delivery.
 */

/**
 * Returns an optimized static poster thumbnail URL for Cloudinary videos.
 * Avoids loading and decoding active video streams in thumbnail lists.
 */
export function getCloudinaryVideoPoster(
  url: string | null | undefined,
  width = 160,
  height = 160
): string | null {
  if (!url) return null;
  if (url.includes("/video/upload/")) {
    return url
      .replace(
        "/video/upload/",
        `/video/upload/so_0,w_${width},h_${height},c_fill,f_auto,q_auto/`
      )
      .replace(/\.[^/.]+$/, ".jpg");
  }
  return null;
}

/**
 * Returns an optimized Cloudinary image URL with auto format (WebP/AVIF),
 * automatic quality compression, and responsive width bounding.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width = 1200
): string {
  if (!url) return "";
  if (url.includes("/image/upload/")) {
    // Avoid re-transforming if transformations already present in URL
    if (!url.includes("/image/upload/f_auto") && !url.includes("/image/upload/w_")) {
      return url.replace(
        "/image/upload/",
        `/image/upload/f_auto,q_auto,w_${width}/`
      );
    }
  }
  return url;
}
