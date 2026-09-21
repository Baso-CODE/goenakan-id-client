"use client";

import Konva from "konva";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ModelId = "tumbler" | "mug" | "glass" | "totebag" | "notebook";

interface ProductModel {
  id: ModelId;
  label: string;
  emoji: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PRODUCT_MODELS: ProductModel[] = [
  { id: "tumbler", label: "Tumbler", emoji: "🥤" },
  { id: "mug", label: "Mug", emoji: "☕" },
  { id: "glass", label: "Gelas", emoji: "🍶" },
  { id: "totebag", label: "Tote Bag", emoji: "👜" },
  { id: "notebook", label: "Notebook", emoji: "📓" },
];

const COLORS = [
  { hex: "#E75480", name: "Pink" },
  { hex: "#4A90D9", name: "Blue" },
  { hex: "#2ECC71", name: "Green" },
  { hex: "#F39C12", name: "Amber" },
  { hex: "#9B59B6", name: "Purple" },
  { hex: "#E74C3C", name: "Red" },
  { hex: "#1ABC9C", name: "Teal" },
  { hex: "#2C3E50", name: "Dark" },
  { hex: "#BDC3C7", name: "Silver" },
  { hex: "#3d342b", name: "Brown" },
];

const W = 520;
const H = 460;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

// ─── Draw Functions per Model ──────────────────────────────────────────────────
function drawTumbler(layer: Konva.Layer, color: string, showHint: boolean) {
  const cx = W / 2;
  const bodyW = 120,
    bodyH = 240,
    lidH = 22,
    strawW = 8,
    strawH = 75;
  const baseY = H - 65;
  const bodyTop = baseY - bodyH;
  const darker = shadeColor(color, -30);
  const lighter = shadeColor(color, 30);
  const darkest = shadeColor(color, -60);

  layer.add(
    new Konva.Rect({
      x: cx - bodyW / 2,
      y: bodyTop,
      width: bodyW,
      height: bodyH,
      fill: color,
      cornerRadius: [10, 10, 20, 20],
    }),
  );
  layer.add(
    new Konva.Rect({
      x: cx - bodyW / 2 + 12,
      y: bodyTop,
      width: 18,
      height: bodyH,
      fill: darker,
      opacity: 0.35,
      cornerRadius: [8, 0, 0, 20],
    }),
  );
  layer.add(
    new Konva.Rect({
      x: cx - bodyW / 2 + 8,
      y: bodyTop + 24,
      width: 8,
      height: bodyH - 64,
      fill: lighter,
      opacity: 0.4,
      cornerRadius: 4,
    }),
  );
  layer.add(
    new Konva.Arc({
      x: cx + bodyW / 2 - 4,
      y: bodyTop + 110,
      innerRadius: 24,
      outerRadius: 38,
      angle: 180,
      rotation: -90,
      fill: darker,
    }),
  );
  layer.add(
    new Konva.Rect({
      x: cx - 50,
      y: bodyTop - lidH,
      width: 100,
      height: lidH,
      fill: "#b0b8c1",
      cornerRadius: [14, 14, 0, 0],
    }),
  );
  layer.add(
    new Konva.Rect({
      x: cx - 50,
      y: bodyTop - lidH,
      width: 100,
      height: 5,
      fill: "#8a9199",
      cornerRadius: [14, 14, 0, 0],
    }),
  );
  layer.add(
    new Konva.Rect({
      x: cx - strawW / 2 - 10,
      y: bodyTop - lidH - strawH,
      width: strawW,
      height: strawH,
      fill: "#c8e6f7",
      cornerRadius: [strawW / 2, strawW / 2, 0, 0],
    }),
  );
  layer.add(
    new Konva.Ellipse({
      x: cx,
      y: baseY,
      radiusX: bodyW / 2,
      radiusY: 13,
      fill: darkest,
      opacity: 0.45,
    }),
  );
  if (showHint)
    layer.add(
      new Konva.Text({
        x: cx - 55,
        y: bodyTop + bodyH / 2 - 18,
        text: "Upload logo\nke panel kiri",
        fontSize: 11,
        fill: "rgba(255,255,255,0.65)",
        align: "center",
        width: 110,
      }),
    );
}

function drawMug(layer: Konva.Layer, color: string, showHint: boolean) {
  const cx = W / 2;
  const bodyW = 130,
    bodyH = 160;
  const baseY = H - 110;
  const bodyTop = baseY - bodyH;
  const darker = shadeColor(color, -35);
  const lighter = shadeColor(color, 35);
  const darkest = shadeColor(color, -60);

  // Body
  layer.add(
    new Konva.Rect({
      x: cx - bodyW / 2,
      y: bodyTop,
      width: bodyW,
      height: bodyH,
      fill: color,
      cornerRadius: [8, 8, 14, 14],
    }),
  );
  // Shadow stripe
  layer.add(
    new Konva.Rect({
      x: cx - bodyW / 2 + 14,
      y: bodyTop + 8,
      width: 14,
      height: bodyH - 16,
      fill: darker,
      opacity: 0.3,
      cornerRadius: 4,
    }),
  );
  // Highlight
  layer.add(
    new Konva.Rect({
      x: cx - bodyW / 2 + 8,
      y: bodyTop + 16,
      width: 7,
      height: bodyH - 40,
      fill: lighter,
      opacity: 0.4,
      cornerRadius: 3,
    }),
  );
  // Handle — D-shape using Arc
  layer.add(
    new Konva.Arc({
      x: cx + bodyW / 2 - 2,
      y: bodyTop + bodyH / 2,
      innerRadius: 20,
      outerRadius: 36,
      angle: 180,
      rotation: -90,
      fill: darker,
    }),
  );
  // Rim top
  layer.add(
    new Konva.Ellipse({
      x: cx,
      y: bodyTop,
      radiusX: bodyW / 2,
      radiusY: 10,
      fill: shadeColor(color, 20),
    }),
  );
  // Base shadow
  layer.add(
    new Konva.Ellipse({
      x: cx,
      y: baseY,
      radiusX: bodyW / 2 - 4,
      radiusY: 10,
      fill: darkest,
      opacity: 0.4,
    }),
  );
  // Saucer plate
  layer.add(
    new Konva.Ellipse({
      x: cx,
      y: baseY + 6,
      radiusX: bodyW / 2 + 18,
      radiusY: 10,
      fill: "#d0cdc8",
    }),
  );
  layer.add(
    new Konva.Ellipse({
      x: cx,
      y: baseY + 4,
      radiusX: bodyW / 2 + 18,
      radiusY: 9,
      fill: "#e8e5e0",
    }),
  );

  if (showHint)
    layer.add(
      new Konva.Text({
        x: cx - 55,
        y: bodyTop + bodyH / 2 - 18,
        text: "Upload logo\nke panel kiri",
        fontSize: 11,
        fill: "rgba(255,255,255,0.65)",
        align: "center",
        width: 110,
      }),
    );
}

function drawGlass(layer: Konva.Layer, color: string, showHint: boolean) {
  const cx = W / 2;
  const topW = 110,
    bottomW = 70,
    bodyH = 200;
  const baseY = H - 80;
  const bodyTop = baseY - bodyH;
  const lighter = shadeColor(color, 60);
  const darkest = shadeColor(color, -70);

  // Trapezoid body using path
  const bodyPath = [
    { x: cx - topW / 2, y: bodyTop },
    { x: cx + topW / 2, y: bodyTop },
    { x: cx + bottomW / 2, y: baseY },
    { x: cx - bottomW / 2, y: baseY },
  ];
  layer.add(
    new Konva.Line({
      points: bodyPath.flatMap((p) => [p.x, p.y]),
      closed: true,
      fill: color,
      opacity: 0.85,
    }),
  );
  // Glass shine left
  layer.add(
    new Konva.Line({
      points: [
        cx - topW / 2 + 10,
        bodyTop + 10,
        cx - topW / 2 + 22,
        bodyTop + 10,
        cx - bottomW / 2 + 14,
        baseY - 10,
        cx - bottomW / 2 + 6,
        baseY - 10,
      ],
      closed: true,
      fill: lighter,
      opacity: 0.35,
    }),
  );
  // Glass shine right strip
  layer.add(
    new Konva.Line({
      points: [
        cx + topW / 2 - 14,
        bodyTop + 10,
        cx + topW / 2 - 6,
        bodyTop + 10,
        cx + bottomW / 2 - 4,
        baseY - 10,
        cx + bottomW / 2 - 10,
        baseY - 10,
      ],
      closed: true,
      fill: lighter,
      opacity: 0.2,
    }),
  );
  // Rim top ellipse
  layer.add(
    new Konva.Ellipse({
      x: cx,
      y: bodyTop,
      radiusX: topW / 2,
      radiusY: 10,
      fill: shadeColor(color, 50),
      opacity: 0.7,
    }),
  );
  // Base ellipse
  layer.add(
    new Konva.Ellipse({
      x: cx,
      y: baseY,
      radiusX: bottomW / 2,
      radiusY: 8,
      fill: darkest,
      opacity: 0.5,
    }),
  );
  // Ice cubes
  [
    { x: cx - 18, y: bodyTop + 40 },
    { x: cx + 10, y: bodyTop + 55 },
    { x: cx - 8, y: bodyTop + 70 },
  ].forEach((pos) => {
    layer.add(
      new Konva.Rect({
        x: pos.x,
        y: pos.y,
        width: 26,
        height: 26,
        fill: "rgba(200,230,247,0.55)",
        cornerRadius: 4,
        rotation: 15,
      }),
    );
  });

  if (showHint)
    layer.add(
      new Konva.Text({
        x: cx - 55,
        y: bodyTop + bodyH / 2,
        text: "Upload logo\nke panel kiri",
        fontSize: 11,
        fill: "rgba(255,255,255,0.7)",
        align: "center",
        width: 110,
      }),
    );
}

function drawTotebag(layer: Konva.Layer, color: string, showHint: boolean) {
  const cx = W / 2;
  const bagW = 180,
    bagH = 200;
  const baseY = H - 70;
  const bodyTop = baseY - bagH;
  const darker = shadeColor(color, -30);
  const lighter = shadeColor(color, 25);

  // Bag body
  layer.add(
    new Konva.Rect({
      x: cx - bagW / 2,
      y: bodyTop,
      width: bagW,
      height: bagH,
      fill: color,
      cornerRadius: [4, 4, 16, 16],
    }),
  );
  // Side shadow
  layer.add(
    new Konva.Rect({
      x: cx - bagW / 2,
      y: bodyTop,
      width: 18,
      height: bagH,
      fill: darker,
      opacity: 0.25,
      cornerRadius: [4, 0, 0, 16],
    }),
  );
  // Center crease
  layer.add(
    new Konva.Line({
      points: [cx, bodyTop + 20, cx, baseY - 10],
      stroke: darker,
      strokeWidth: 1.5,
      opacity: 0.3,
    }),
  );
  // Top fold
  layer.add(
    new Konva.Rect({
      x: cx - bagW / 2,
      y: bodyTop,
      width: bagW,
      height: 22,
      fill: darker,
      opacity: 0.2,
      cornerRadius: [4, 4, 0, 0],
    }),
  );
  // Left handle
  layer.add(
    new Konva.Line({
      points: [
        cx - 50,
        bodyTop + 10,
        cx - 60,
        bodyTop - 60,
        cx - 20,
        bodyTop - 60,
        cx - 10,
        bodyTop + 10,
      ],
      stroke: shadeColor(color, -20),
      strokeWidth: 14,
      lineCap: "round",
      lineJoin: "round",
    }),
  );
  layer.add(
    new Konva.Line({
      points: [
        cx - 50,
        bodyTop + 10,
        cx - 60,
        bodyTop - 60,
        cx - 20,
        bodyTop - 60,
        cx - 10,
        bodyTop + 10,
      ],
      stroke: lighter,
      strokeWidth: 7,
      lineCap: "round",
      lineJoin: "round",
      opacity: 0.4,
    }),
  );
  // Right handle
  layer.add(
    new Konva.Line({
      points: [
        cx + 10,
        bodyTop + 10,
        cx + 20,
        bodyTop - 60,
        cx + 60,
        bodyTop - 60,
        cx + 50,
        bodyTop + 10,
      ],
      stroke: shadeColor(color, -20),
      strokeWidth: 14,
      lineCap: "round",
      lineJoin: "round",
    }),
  );
  layer.add(
    new Konva.Line({
      points: [
        cx + 10,
        bodyTop + 10,
        cx + 20,
        bodyTop - 60,
        cx + 60,
        bodyTop - 60,
        cx + 50,
        bodyTop + 10,
      ],
      stroke: lighter,
      strokeWidth: 7,
      lineCap: "round",
      lineJoin: "round",
      opacity: 0.4,
    }),
  );
  // Bottom shadow
  layer.add(
    new Konva.Ellipse({
      x: cx,
      y: baseY + 4,
      radiusX: bagW / 2 - 10,
      radiusY: 10,
      fill: "#00000033",
    }),
  );

  if (showHint)
    layer.add(
      new Konva.Text({
        x: cx - 55,
        y: bodyTop + bagH / 2 + 10,
        text: "Upload logo\nke panel kiri",
        fontSize: 11,
        fill: "rgba(255,255,255,0.65)",
        align: "center",
        width: 110,
      }),
    );
}

function drawNotebook(layer: Konva.Layer, color: string, showHint: boolean) {
  const cx = W / 2;
  const bookW = 160,
    bookH = 210;
  const baseY = H - 80;
  const bodyTop = baseY - bookH;
  const darker = shadeColor(color, -35);
  const lighter = shadeColor(color, 40);
  const spineW = 22;

  // Spine (left side)
  layer.add(
    new Konva.Rect({
      x: cx - bookW / 2,
      y: bodyTop,
      width: spineW,
      height: bookH,
      fill: darker,
      cornerRadius: [4, 0, 0, 4],
    }),
  );
  // Cover
  layer.add(
    new Konva.Rect({
      x: cx - bookW / 2 + spineW,
      y: bodyTop,
      width: bookW - spineW,
      height: bookH,
      fill: color,
      cornerRadius: [0, 6, 6, 0],
    }),
  );
  // Cover sheen
  layer.add(
    new Konva.Rect({
      x: cx - bookW / 2 + spineW + 8,
      y: bodyTop + 10,
      width: 12,
      height: bookH - 20,
      fill: lighter,
      opacity: 0.25,
      cornerRadius: 3,
    }),
  );
  // Pages (right edge)
  layer.add(
    new Konva.Rect({
      x: cx + bookW / 2 - 4,
      y: bodyTop + 4,
      width: 6,
      height: bookH - 8,
      fill: "#f5f0e8",
      cornerRadius: [0, 3, 3, 0],
    }),
  );
  // Spine rings
  [0.2, 0.35, 0.5, 0.65, 0.8].forEach((ratio) => {
    const y = bodyTop + bookH * ratio;
    layer.add(
      new Konva.Circle({
        x: cx - bookW / 2 + spineW / 2,
        y,
        radius: 5,
        fill: "#ccc",
      }),
    );
    layer.add(
      new Konva.Circle({
        x: cx - bookW / 2 + spineW / 2,
        y,
        radius: 3,
        fill: "#999",
      }),
    );
  });
  // Elastic band
  layer.add(
    new Konva.Line({
      points: [
        cx - bookW / 2 + spineW,
        bodyTop + bookH * 0.72,
        cx + bookW / 2,
        bodyTop + bookH * 0.72,
      ],
      stroke: darker,
      strokeWidth: 2.5,
      opacity: 0.5,
    }),
  );
  // Shadow
  layer.add(
    new Konva.Ellipse({
      x: cx,
      y: baseY + 6,
      radiusX: bookW / 2 - 10,
      radiusY: 10,
      fill: "#00000030",
    }),
  );

  if (showHint)
    layer.add(
      new Konva.Text({
        x: cx - 40,
        y: bodyTop + bookH / 2 - 18,
        text: "Upload logo\nke panel kiri",
        fontSize: 11,
        fill: "rgba(255,255,255,0.65)",
        align: "center",
        width: 100,
      }),
    );
}

// ─── Draw Dispatcher ──────────────────────────────────────────────────────────
function drawModel(
  layer: Konva.Layer,
  model: ModelId,
  color: string,
  showHint: boolean,
) {
  layer.destroyChildren();
  switch (model) {
    case "tumbler":
      drawTumbler(layer, color, showHint);
      break;
    case "mug":
      drawMug(layer, color, showHint);
      break;
    case "glass":
      drawGlass(layer, color, showHint);
      break;
    case "totebag":
      drawTotebag(layer, color, showHint);
      break;
    case "notebook":
      drawNotebook(layer, color, showHint);
      break;
  }
  layer.draw();
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ProductMockupGenerator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const tumblerLayerRef = useRef<Konva.Layer | null>(null);
  const logoLayerRef = useRef<Konva.Layer | null>(null);
  const historyRef = useRef<string[]>([]);

  const [model, setModel] = useState<ModelId>("tumbler");
  const [color, setColor] = useState(COLORS[0].hex);
  const [logoSize, setLogoSize] = useState(80);
  const [scale, setScale] = useState(1);
  const [hasLogo, setHasLogo] = useState(false);

  // Init stage once
  useEffect(() => {
    if (!containerRef.current) return;
    const stage = new Konva.Stage({
      container: containerRef.current,
      width: W,
      height: H,
    });
    const bgLayer = new Konva.Layer();
    bgLayer.add(
      new Konva.Rect({ x: 0, y: 0, width: W, height: H, fill: "#e8e8e8" }),
    );
    bgLayer.draw();
    const tumblerLayer = new Konva.Layer();
    const logoLayer = new Konva.Layer();
    stage.add(bgLayer, tumblerLayer, logoLayer);
    stageRef.current = stage;
    tumblerLayerRef.current = tumblerLayer;
    logoLayerRef.current = logoLayer;
    drawModel(tumblerLayer, "tumbler", COLORS[0].hex, true);
    stage.on("click tap", (e) => {
      if (e.target === stage) {
        logoLayer
          .find("Transformer")
          .forEach((tr) => (tr as Konva.Transformer).nodes([]));
        logoLayer.draw();
      }
    });
    return () => {
      stage.destroy();
    };
  }, []);

  // Redraw when model or color changes
  useEffect(() => {
    if (tumblerLayerRef.current)
      drawModel(tumblerLayerRef.current, model, color, !hasLogo);
  }, [model, color, hasLogo]);

  // Resize logo
  useEffect(() => {
    if (!logoLayerRef.current) return;
    const imgs = logoLayerRef.current.find("Image") as Konva.Image[];
    if (imgs.length) {
      imgs[0].width(logoSize);
      imgs[0].height(logoSize);
      logoLayerRef.current.draw();
    }
  }, [logoSize]);

  // Zoom
  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.scale({ x: scale, y: scale });
      stageRef.current.draw();
    }
  }, [scale]);

  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !logoLayerRef.current) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new window.Image();
        img.onload = () => {
          logoLayerRef.current!.destroyChildren();
          const konvaImg = new Konva.Image({
            image: img,
            x: W / 2 - logoSize / 2,
            y: H / 2 - logoSize / 2,
            width: logoSize,
            height: logoSize,
            draggable: true,
          });
          const tr = new Konva.Transformer({
            nodes: [konvaImg],
            keepRatio: true,
            borderStroke: "#7c3aed",
            anchorStroke: "#7c3aed",
            anchorFill: "white",
            anchorSize: 8,
          });
          logoLayerRef.current!.add(konvaImg, tr);
          logoLayerRef.current!.draw();
          setHasLogo(true);
          const save = () => {
            historyRef.current.push(stageRef.current!.toJSON());
            if (historyRef.current.length > 20) historyRef.current.shift();
          };
          konvaImg.on("dragend transformend", save);
          save();
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [logoSize],
  );

  const handleUndo = () => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      logoLayerRef.current?.destroyChildren();
      logoLayerRef.current?.draw();
      setHasLogo(false);
    }
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
    const a = document.createElement("a");
    a.download = `mockup-${model}.png`;
    a.href = dataURL;
    a.click();
  };

  return (
    <div
      className="w-full bg-white flex flex-col h-screen py-[7%]"
      style={{ fontFamily: "sans-serif" }}>
      {/* Header */}
      <div className="text-center py-4 border-b border-stone-200">
        <span className="text-xs tracking-widest text-stone-400 uppercase">
          Product Mockup Generator
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel ── */}
        <div className="w-56 border-r border-stone-200 p-3 flex flex-col gap-3 overflow-y-auto">
          {/* Model Selector */}
          <div className="bg-stone-50 rounded-lg p-3 flex flex-col gap-2">
            <p className="text-xs text-stone-500 font-medium">Model Produk</p>
            <div className="flex flex-col gap-1">
              {PRODUCT_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setModel(m.id);
                    setHasLogo(false);
                    logoLayerRef.current?.destroyChildren();
                    logoLayerRef.current?.draw();
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-all text-left ${
                    model === m.id
                      ? "bg-[#3d342b] text-white font-medium"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}>
                  <span className="text-base leading-none">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div className="border-2 border-dashed border-purple-300 rounded-xl p-4 flex flex-col items-center gap-2 bg-purple-50">
            <div className="w-10 h-10 rounded-full border-2 border-purple-500 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-xs text-purple-600 text-center">
              Upload image / logo
            </p>
            <label className="bg-purple-600 text-white text-xs px-4 py-1.5 rounded-md cursor-pointer flex items-center gap-1 hover:bg-purple-700 transition-colors">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5">
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </label>
          </div>

          {/* Color Picker */}
          <div className="bg-stone-50 rounded-lg p-3 flex flex-col gap-2">
            <p className="text-xs text-stone-500 font-medium">Warna Produk</p>
            <div className="grid grid-cols-5 gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => setColor(c.hex)}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    background: c.hex,
                    border:
                      color === c.hex
                        ? "2.5px solid #1a1a1a"
                        : "2px solid transparent",
                    outline: color === c.hex ? "1.5px solid white" : "none",
                    outlineOffset: "-3px",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Logo Size */}
          <div className="bg-stone-50 rounded-lg p-3 flex flex-col gap-2">
            <p className="text-xs text-stone-500 font-medium">Ukuran Logo</p>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={20}
                max={150}
                value={logoSize}
                step={1}
                onChange={(e) => setLogoSize(parseInt(e.target.value))}
                className="flex-1 accent-purple-600"
              />
              <span className="text-xs text-stone-500 w-7">{logoSize}</span>
            </div>
          </div>

          {/* Export */}
          <button
            onClick={handleExport}
            className="bg-[#3d342b] text-white text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#2a2420] transition-colors mt-auto">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PNG
          </button>
        </div>

        {/* ── Canvas Area ── */}
        <div className="flex-1 relative flex items-center justify-center bg-[#e8e8e8]">
          <div ref={containerRef} />

          {/* Controls */}
          <div className="absolute bottom-5 flex gap-2">
            {[
              {
                label: "+",
                action: () => setScale((s) => Math.min(s + 0.15, 2)),
              },
              {
                label: "−",
                action: () => setScale((s) => Math.max(s - 0.15, 0.5)),
              },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="w-9 h-9 bg-white border border-stone-200 rounded-lg text-lg flex items-center justify-center hover:bg-stone-50 transition-colors">
                {btn.label}
              </button>
            ))}
            <button
              onClick={handleUndo}
              className="w-9 h-9 bg-white border border-stone-200 rounded-lg flex items-center justify-center hover:bg-stone-50 transition-colors">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3.67" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Right Toolbar ── */}
        <div className="w-11 bg-white border-l border-stone-200 flex flex-col items-center pt-3 gap-2">
          <button className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
          <button className="w-8 h-8 bg-transparent border border-stone-200 rounded-lg flex items-center justify-center">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
