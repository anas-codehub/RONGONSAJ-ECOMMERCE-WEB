"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative h-96 lg:h-[500px] bg-secondary rounded-2xl overflow-hidden">
        {images[selectedImage] ? (
          <Image
            src={images[selectedImage]}
            alt={productName}
            fill
            className="object-contain p-2 transition-all duration-300"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-36 bg-muted rounded-full opacity-60" />
          </div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {selectedImage + 1} / {images.length}
          </div>
        )}

        {/* Left arrow */}
        {images.length > 1 && selectedImage > 0 && (
          <button
            onClick={() => setSelectedImage(selectedImage - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
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

        {/* Right arrow */}
        {images.length > 1 && selectedImage < images.length - 1 && (
          <button
            onClick={() => setSelectedImage(selectedImage + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
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
