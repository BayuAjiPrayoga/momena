"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { X, ZoomIn, ZoomOut, RotateCw, Check, Crop } from "lucide-react";

interface ImageCropperProps {
  /** The source image URL (can be object URL from File or remote URL) */
  imageSrc: string;
  /** Aspect ratio for the crop area (e.g. 5/6 for portrait, 1 for square, 16/9 for landscape) */
  aspectRatio?: number;
  /** Shape of the crop area */
  cropShape?: "rect" | "round";
  /** Called with the cropped image Blob when user confirms */
  onCropComplete: (croppedBlob: Blob) => void;
  /** Called when user cancels */
  onCancel: () => void;
  /** Optional label for the crop area */
  label?: string;
}

/**
 * Creates a cropped image from canvas.
 */
async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // extract the cropped area
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) throw new Error("No 2d context");

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas is empty"));
      },
      "image/jpeg",
      0.92
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

export default function ImageCropper({
  imageSrc,
  aspectRatio = 5 / 6,
  cropShape = "rect",
  onCropComplete,
  onCancel,
  label,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(croppedBlob);
    } catch (e) {
      console.error("Crop failed:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1510] border-b border-white/10 shrink-0">
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <p className="text-white font-semibold text-sm flex items-center gap-2">
            <Crop className="w-4 h-4 text-[#D4A843]" />
            {label || "Sesuaikan Foto"}
          </p>
          <p className="text-white/40 text-xs">Geser & zoom untuk mengatur posisi</p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={isProcessing}
          className="w-10 h-10 rounded-full bg-[#D4A843] flex items-center justify-center hover:bg-[#FFD966] transition-colors text-[#1a1510] disabled:opacity-50"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>

      {/* Crop Area */}
      <div className="flex-1 relative">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          cropShape={cropShape}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={handleCropComplete}
          showGrid={false}
          style={{
            containerStyle: { background: "#0a0a0a" },
            cropAreaStyle: {
              border: "2px solid rgba(212, 168, 67, 0.6)",
              borderRadius: cropShape === "round" ? "50%" : "12px",
            },
          }}
        />
      </div>

      {/* Controls */}
      <div className="px-6 py-4 bg-[#1a1510] border-t border-white/10 space-y-3 shrink-0">
        {/* Zoom slider */}
        <div className="flex items-center gap-3">
          <ZoomOut className="w-4 h-4 text-white/50 shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#D4A843]
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D4A843] [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(212,168,67,0.4)]"
          />
          <ZoomIn className="w-4 h-4 text-white/50 shrink-0" />
        </div>

        {/* Rotate + Confirm buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <RotateCw className="w-4 h-4" /> Putar
          </button>

          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#D4A843] text-[#1a1510] font-semibold text-sm rounded-lg hover:bg-[#FFD966] transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {isProcessing ? "Memproses..." : "Terapkan"}
          </button>
        </div>
      </div>
    </div>
  );
}
