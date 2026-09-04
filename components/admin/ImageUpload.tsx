"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { X, Loader2, ImagePlus } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  type?: "product" | "slide" | "profile";
}

export default function ImageUpload({
  images,
  onChange,
  type = "product",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadingCount(files.length);
    setUploadedCount(0);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        // Validate file
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        if (file.size > 20 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 20MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type); // ← THIS WAS MISSING!

        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) {
            console.error("Upload failed:", data);
            toast.error(data.error || `Failed to upload ${file.name}`);
            continue;
          }

          if (!data.url) {
            console.error("No URL in response:", data);
            toast.error(`Upload failed for ${file.name}`);
            continue;
          }

          uploadedUrls.push(data.url);
          setUploadedCount((prev) => prev + 1);
        } catch (fileError) {
          console.error("File upload error:", fileError);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
        toast.success(
          `${uploadedUrls.length} image${uploadedUrls.length > 1 ? "s" : ""} uploaded!`,
        );
      } else {
        toast.error("No images were uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setUploadingCount(0);
      setUploadedCount(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-4 mt-3">
      {/* Upload area */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed border-border rounded-2xl p-8 text-center transition-all ${
          uploading
            ? "opacity-70 cursor-not-allowed"
            : "cursor-pointer hover:border-primary hover:bg-secondary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm font-bold text-foreground">
              Uploading {uploadedCount}/{uploadingCount}...
            </p>
            <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width:
                    uploadingCount > 0
                      ? `${(uploadedCount / uploadingCount) * 100}%`
                      : "0%",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Please wait — compressing and uploading...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <ImagePlus className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-bold text-foreground">
              Click to upload images
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to 20MB · Auto-compressed to 800×800
            </p>
          </div>
        )}
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
            {images.length} image{images.length > 1 ? "s" : ""} — drag to
            reorder
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((url, index) => (
              <div
                key={url}
                className="relative group aspect-square rounded-xl overflow-hidden border-2 transition-all"
                style={{
                  borderColor: index === 0 ? "var(--primary)" : "var(--border)",
                }}
              >
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {/* Move left */}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index - 1);
                      }}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xs font-bold"
                      title="Move left"
                    >
                      ←
                    </button>
                  )}

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5 text-white" />
                  </button>

                  {/* Move right */}
                  {index < images.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index + 1);
                      }}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-xs font-bold"
                      title="Move right"
                    >
                      →
                    </button>
                  )}
                </div>

                {/* Main badge */}
                {index === 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    Main
                  </div>
                )}

                {/* Index number */}
                {index > 0 && (
                  <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            💡 First image is the main product image. Use ← → to reorder.
          </p>
        </div>
      )}
    </div>
  );
}
