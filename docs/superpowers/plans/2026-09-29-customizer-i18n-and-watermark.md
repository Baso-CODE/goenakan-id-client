# Product Customizer i18n & Download Watermark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide dynamic English and Indonesian translation for product customizer specifications and printing method descriptions, and add a centered semi-transparent watermark to the downloaded mockup spec sheet.

**Architecture:** Use `useLocale()` from `next-intl` inside `productCustomizer.tsx` to conditionally display English or Indonesian copy for dimensions, print methods, and spec labels. Update `handleDownloadMockup` in `productCustomizer.tsx` to asynchronously load `/images/watermark.png` and render it onto the offscreen canvas over the right product preview box with 35% opacity.

**Tech Stack:** Next.js 16 (App Router), React, `next-intl`, HTML Canvas API, `html-to-image`, Tailwind CSS.

## Global Constraints
- Preserve existing customizer behavior, styling, and coordinate calculations.
- Maintain Next.js Turbopack build integrity (`npm run build` must pass cleanly).
- Watermark image must be loaded from `/images/watermark.png` with error resilience (cannot crash download if asset fails to load).
- No new external runtime dependencies.

---

### Task 1: Add Dynamic Translation (i18n) to Product Customizer

**Files:**
- Modify: `app/components/products/detail/productCustomizer.tsx:1-1250`

**Interfaces:**
- Consumes: `useLocale` from `next-intl`
- Produces: Localized strings for floating spec overlay box, canvas download header/subtitle/column titles, and download toast notifications.

- [ ] **Step 1: Import `useLocale` in `productCustomizer.tsx`**
  Add `import { useLocale } from "next-intl";` to top imports.
  Inside `ProductCustomizer`, initialize:
  ```tsx
  const locale = useLocale();
  const isEn = locale === "en";
  ```

- [ ] **Step 2: Localize the Floating Specification Box (`mockup-spec-box`)**
  Update JSX in lines ~1193-1240:
  - `Dimensi Produk:` -> `{isEn ? "Product Dimensions:" : "Dimensi Produk:"}`
  - `Dimensi Logo:` -> `{isEn ? "Logo Dimensions:" : "Dimensi Logo:"}`
  - `Jarak Sisi:` -> `{isEn ? "Edge Distance:" : "Jarak Sisi:"}`
  - Margin labels:
    - `Atas:` -> `{isEn ? "Top:" : "Atas:"}`
    - `Bawah:` -> `{isEn ? "Bottom:" : "Bawah:"}`
    - `Kiri:` -> `{isEn ? "Left:" : "Kiri:"}`
    - `Kanan:` -> `{isEn ? "Right:" : "Kanan:"}`
  - `Metode Cetak:` -> `{isEn ? "Printing Method:" : "Metode Cetak:"}`

- [ ] **Step 3: Localize Canvas Download Titles & Toast Notifications**
  In `handleDownloadMockup`:
  - Toast loading: `isEn ? "Preparing mockup download..." : "Sedang menyiapkan unduhan mockup..."`
  - Subtitle: `isEn ? `SIDE/POSITION: ${sideName.toUpperCase()} | MOCKUP SPECIFICATION SHEET` : `SISI/POSISI: ${sideName.toUpperCase()} | LEMBAR SPESIFIKASI MOCKUP``
  - Left column: `isEn ? "📐 PLACEMENT & SPECIFICATIONS" : "📐 SPESIFIKASI & UKURAN PENEMPATAN"`
  - Right column: `isEn ? "✨ VISUAL PRODUCT PREVIEW (MOCKUP)" : "✨ VISUAL PREVIEW PRODUK (MOCKUP)"`
  - Toast success: `isEn ? `Mockup (${sideName}) downloaded successfully!` : `Berhasil mengunduh mockup (${sideName})!``
  - Toast error: `isEn ? "Failed to download mockup. Please try again." : "Gagal mengunduh mockup. Silakan coba lagi."`

- [ ] **Step 4: Typecheck**
  Run `npx tsc --noEmit` in `goenakan-id-client`.

---

### Task 2: Implement Watermark Drawing in Mockup Download Canvas

**Files:**
- Modify: `app/components/products/detail/productCustomizer.tsx` (inside `handleDownloadMockup`)

**Interfaces:**
- Consumes: `/images/watermark.png` (827 × 349 px)
- Produces: Watermarked right preview box on generated PNG spec sheet.

- [ ] **Step 1: Load Watermark Image asynchronously**
  After loading `cleanImg` and before drawing, add:
  ```ts
  const watermarkImg = new window.Image();
  watermarkImg.src = "/images/watermark.png";
  await new Promise((resolve) => {
    watermarkImg.onload = resolve;
    watermarkImg.onerror = resolve; // Graceful fallback if image missing
  });
  ```

- [ ] **Step 2: Draw Watermark with Aspect Ratio & 35% Opacity**
  After `ctx.strokeRect` for the right preview box (`528 * scaleFactor`, `115 * scaleFactor`, `488 * scaleFactor`, `488 * scaleFactor`):
  ```ts
  if (watermarkImg.complete && watermarkImg.naturalWidth > 0) {
    const wmAspect = watermarkImg.naturalWidth / watermarkImg.naturalHeight;
    const targetWmWidth = 488 * scaleFactor * 0.55;
    const targetWmHeight = targetWmWidth / wmAspect;
    const wmX = 528 * scaleFactor + (488 * scaleFactor - targetWmWidth) / 2;
    const wmY = 115 * scaleFactor + (488 * scaleFactor - targetWmHeight) / 2;

    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.drawImage(watermarkImg, wmX, wmY, targetWmWidth, targetWmHeight);
    ctx.restore();
  }
  ```

- [ ] **Step 3: Verification**
  Run `npm run build` in `goenakan-id-client` to verify compilation and asset referencing.

---

### Task 3: Full End-to-End Verification & Commit

**Files:**
- All modified files

- [ ] **Step 1: Full Build Verification**
  Run `npm run build` to ensure clean Next.js Turbopack build.

- [ ] **Step 2: Commit Changes**
  Commit with descriptive commit message:
  `feat(customizer): support dynamic i18n translation and add watermark to downloaded mockup`
