"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, X } from "lucide-react";

export default function ProductImageGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && selectedImage < images.length - 1) {
        setSelectedImage((prev) => prev + 1);
      } else if (diff < 0 && selectedImage > 0) {
        setSelectedImage((prev) => prev - 1);
      }
    }
  };

  // Zoom move handlers
  const handleZoomMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const handleZoomTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const touch = e.touches[0];
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
    e.preventDefault();
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main image */}
        <div
          className="relative h-96 lg:h-[500px] bg-secondary rounded-2xl overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {images[selectedImage] ? (
            <Image
              src={images[selectedImage]}
              alt={productName}
              fill
              className="object-contain p-2"
              priority
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-36 bg-muted rounded-full opacity-60" />
            </div>
          )}

          {/* Zoom button — top right */}
          {images[selectedImage] && (
            <button
              onClick={() => {
                setZoomOpen(true);
                setZoomPos({ x: 50, y: 50 });
              }}
              className="absolute top-3 right-3 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all z-10"
              title="Zoom image"
            >
              <ZoomIn className="h-4 w-4 text-foreground" />
            </button>
          )}

          {/* Swipe hint */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/40 text-white text-xs font-medium px-2.5 py-1 rounded-full md:hidden">
              ← swipe →
            </div>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          )}

          {/* Desktop arrows */}
          {images.length > 1 && selectedImage > 0 && (
            <button
              onClick={() => setSelectedImage(selectedImage - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all z-10 hidden md:flex"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {images.length > 1 && selectedImage < images.length - 1 && (
            <button
              onClick={() => setSelectedImage(selectedImage + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all z-10 hidden md:flex"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                  selectedImage === i
                    ? "border-primary shadow-md scale-105"
                    : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} ${i + 1}`}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setZoomOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center z-10 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          {/* Zoom hint */}
          <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
            Move finger / cursor to zoom
          </p>

          {/* Zoomed image container */}
          <div
            ref={imageRef}
            className="w-full h-full cursor-crosshair overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleZoomMouseMove}
            onTouchMove={handleZoomTouchMove}
            style={{ touchAction: "none" }}
          >
            <div className="relative w-full h-full">
              <Image
                src={images[selectedImage]}
                alt={productName}
                fill
                className="object-contain"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: "scale(2.5)",
                  transition: "transform-origin 0.05s ease",
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Image counter in zoom */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === selectedImage ? "bg-white scale-125" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
