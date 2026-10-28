/**
 * Helper to determine whether a MediaItem / ProductImage is classified as a
 * Mockup Template image (intended for logo printing / Customizer),
 * as opposed to a main product gallery/showcase photo.
 */
export const isMockupImage = (img: any): boolean => {
  if (!img) return false;

  // 1. altText indicates a mockup (e.g. "Mockup Image" or contains "mockup" case-insensitively)
  if (typeof img.altText === "string") {
    const lower = img.altText.toLowerCase().trim();
    if (lower === "mockup image" || lower.includes("mockup")) {
      return true;
    }
  }

  // 2. Mockup placement areas configured (print placement boxes for customizer)
  if (Array.isArray(img.mockupAreas) && img.mockupAreas.length > 0) {
    return true;
  }

  // 3. Mockup side name assigned (e.g. "One-Side", "Tampak Depan", "Tampak Belakang")
  if (img.mockupSideName && String(img.mockupSideName).trim() !== "") {
    return true;
  }

  // 4. Linked to specific print position or print side
  if (img.printPositionValueId || img.printSideValueId) {
    return true;
  }

  // 5. Generated attribute mockup item
  if (typeof img.id === "string" && img.id.startsWith("attr-mockup-")) {
    return true;
  }

  return false;
};
