# Design Spec: Product Customizer i18n & Download Watermark

**Status:** Approved  
**Date:** 2026-09-29  
**Author:** Antigravity  

---

## 1. Objective
1. Make product customizer specifications and printing method descriptions dynamically localized based on the active locale (`id` vs `en`).
2. Add a semi-transparent watermark (`public/images/watermark.png`) onto the downloaded mockup spec sheet image (specifically centered on the visual preview column).

---

## 2. Dynamic Translation (i18n)

### 2.1 Scope & Context
In `app/components/products/detail/productCustomizer.tsx`, specification details on the mockup overlay and downloaded spec sheet are currently hardcoded in Indonesian. The application uses `next-intl` throughout pages and components (e.g. `useLocale()` returning `"id"` or `"en"`).

### 2.2 Translation Mapping
We will use `useLocale()` from `next-intl` in `productCustomizer.tsx` (`const isEn = useLocale() === "en"`):

| Field / UI Element | Indonesian (`id`) | English (`en`) |
| :--- | :--- | :--- |
| **Product Dimensions** | `Dimensi Produk:` | `Product Dimensions:` |
| **Printing Method** | `Metode Cetak:` | `Printing Method:` |
| **Logo Dimensions** | `Dimensi Logo:` | `Logo Dimensions:` |
| **Edge Distance (Margins)** | `Jarak Sisi:` | `Edge Distance:` |
| **Top / Bottom / Left / Right** | `Atas` / `Bawah` / `Kiri` / `Kanan` | `Top` / `Bottom` / `Left` / `Right` |
| **Downloaded Spec Subtitle** | `SISI/POSISI: {side} \| LEMBAR SPESIFIKASI MOCKUP` | `SIDE/POSITION: {side} \| MOCKUP SPECIFICATION SHEET` |
| **Download Left Column Header** | `📐 SPESIFIKASI & UKURAN PENEMPATAN` | `📐 SPECIFICATIONS & PLACEMENT` |
| **Download Right Column Header** | `✨ VISUAL PREVIEW PRODUK (MOCKUP)` | `✨ PRODUCT VISUAL PREVIEW (MOCKUP)` |
| **Toast: Preparing download** | `Sedang menyiapkan unduhan mockup...` | `Preparing mockup download...` |
| **Toast: Success download** | `Berhasil mengunduh mockup ({side})!` | `Mockup ({side}) downloaded successfully!` |
| **Toast: Failed download** | `Gagal mengunduh mockup. Silakan coba lagi.` | `Failed to download mockup. Please try again.` |

---

## 3. Watermark on Downloaded Mockup

### 3.1 Watermark Asset
- **Asset path:** `public/images/watermark.png`
- **Native Dimensions:** 827 × 349 px (aspect ratio: ~2.37)
- **Format:** RGBA PNG with alpha transparency.
- **Content:** Monogram "GI" and text "THIS MOCKUP WAS CREATED BY GOENAKAN INDONESIA".

### 3.2 Canvas Drawing Logic
In `handleDownloadMockup` in `productCustomizer.tsx`:
1. The downloaded canvas dimensions are `1040 * scaleFactor` × `627 * scaleFactor` (where `scaleFactor = 3`).
2. The Right Preview Box is drawn at:
   - `x = 528 * scaleFactor`
   - `y = 115 * scaleFactor`
   - `width = 488 * scaleFactor`
   - `height = 488 * scaleFactor`
3. Load `watermarkImg` asynchronously (`/images/watermark.png`):
   ```ts
   const watermarkImg = new window.Image();
   watermarkImg.src = "/images/watermark.png";
   await new Promise((resolve) => {
     watermarkImg.onload = resolve;
     watermarkImg.onerror = resolve; // Graceful fallback
   });
   ```
4. Calculate proportional sizing & centered coordinates inside the Right Preview Box:
   - Target watermark width: `488 * scaleFactor * 0.55` (55% of the preview box width).
   - Target watermark height: `targetWidth / (827 / 349)`.
   - `watermarkX = 528 * scaleFactor + (488 * scaleFactor - targetWidth) / 2`.
   - `watermarkY = 115 * scaleFactor + (488 * scaleFactor - targetHeight) / 2`.
5. Render with opacity:
   ```ts
   ctx.save();
   ctx.globalAlpha = 0.35;
   ctx.drawImage(watermarkImg, watermarkX, watermarkY, targetWidth, targetHeight);
   ctx.restore();
   ```
6. This ensures the clean product preview displays the official watermark without obscuring fine customizer details.

---

## 4. Verification & Testing Plan
1. **Typecheck & Build**: Run `npx tsc --noEmit` and `npm run build` to verify clean compilation with Next.js Turbopack.
2. **Dynamic i18n Verification**:
   - Access `http://localhost:3002/id/products/...` -> Check spec overlay labels are in Indonesian.
   - Access `http://localhost:3002/en/products/...` -> Check spec overlay labels are in English.
3. **Download Verification**:
   - Trigger "Unduh Mockup / Download Mockup".
   - Open downloaded PNG spec sheet.
   - Verify watermark appears centered on the right image box with clean ~35% opacity.
   - Verify sheet title, column headers, and side indicators adapt to current locale.
