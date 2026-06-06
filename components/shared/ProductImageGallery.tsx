"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function ProductImageGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    // Only swipe if not zoomed and swipe distance > 50px
    if (!zoomed && Math.abs(diff) > 50) {
      if (diff > 0 && selectedImage < images.length - 1) {
        setSelectedImage(selectedImage + 1); // Swipe left → next
      } else if (diff < 0 && selectedImage > 0) {
        setSelectedImage(selectedImage - 1); // Swipe right → prev
      }
    }
  };

  // Desktop hover zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  // Mobile touch zoom
  const handleTouchStart = () => {
    setZoomed(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const touch = e.touches[0];
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
    e.preventDefault(); // Prevent page scroll while zooming
  };

  const handleTouchEnd = () => {
    setZoomed(false);
    setZoomPos({ x: 50, y: 50 });
  };

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        ref={imageRef}
        className="relative h-96 lg:h-[500px] bg-secondary rounded-2xl overflow-hidden select-none"
        style={{ cursor: zoomed ? "zoom-in" : "zoom-in", touchAction: "none" }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => {
          setZoomed(false);
          setZoomPos({ x: 50, y: 50 });
        }}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          handleTouchStart();
          handleSwipeStart(e);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => {
          handleTouchEnd();
          handleSwipeEnd(e);
        }}
      >
        {images[selectedImage] ? (
          <Image
            src={images[selectedImage]}
            alt={productName}
            fill
            className="object-contain p-2"
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: zoomed ? "scale(2.5)" : "scale(1)",
              transition: zoomed
                ? "transform 0.1s ease"
                : "transform 0.3s ease",
              pointerEvents: "none",
            }}
            priority
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-36 bg-muted rounded-full opacity-60" />
          </div>
        )}

        {/* Zoom hint */}
        {!zoomed && images[selectedImage] && (
          <div className="absolute bottom-3 left-3 bg-black/40 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
            </svg>
            <span className="hidden md:inline">Hover to zoom</span>
            <span className="md:hidden">Hold to zoom</span>
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {selectedImage + 1} / {images.length}
          </div>
        )}

        {/* Arrows */}
        {images.length > 1 && selectedImage > 0 && !zoomed && (
          <button
            onClick={() => setSelectedImage(selectedImage - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all z-10"
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
        {images.length > 1 && selectedImage < images.length - 1 && !zoomed && (
          <button
            onClick={() => setSelectedImage(selectedImage + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all z-10"
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
  );
}
