"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  image: string;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  order: number;
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    goTo(current === slides.length - 1 ? 0 : current + 1);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo(current === 0 ? slides.length - 1 : current - 1);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        paddingTop: "56.25%", // 16:9 ratio
        position: "relative",
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.5s ease",
            zIndex: i === current ? 1 : 0,
          }}
        >
          {/* Full bleed background image */}
          <Image
            src={slide.image}
            alt={slide.title || "Hero slide"}
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
          />

          {/* Text overlay */}
          {(slide.title || slide.subtitle || slide.buttonText) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: "8%",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "0 16px",
                  maxWidth: "700px",
                }}
              >
                {slide.title && (
                  <h2
                    style={{
                      color: "white",
                      fontWeight: 900,
                      fontSize: "clamp(20px, 4vw, 52px)",
                      marginBottom: "8px",
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      lineHeight: 1.2,
                    }}
                  >
                    {slide.title}
                  </h2>
                )}
                {slide.subtitle && (
                  <p
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "clamp(12px, 2vw, 20px)",
                      marginBottom: "16px",
                      textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {slide.subtitle}
                  </p>
                )}
                {slide.buttonText && slide.buttonLink && (
                  <Link href={slide.buttonLink}>
                    <button
                      style={{
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                        padding:
                          "clamp(8px, 1.5vw, 14px) clamp(16px, 3vw, 32px)",
                        borderRadius: "12px",
                        fontWeight: 800,
                        fontSize: "clamp(12px, 1.5vw, 16px)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {slide.buttonText}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Left arrow */}
      {slides.length > 1 && (
        <button
          onClick={prev}
          style={{
            position: "absolute",
            left: "clamp(8px, 2vw, 20px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "clamp(32px, 4vw, 44px)",
            height: "clamp(32px, 4vw, 44px)",
            background: "rgba(0,0,0,0.4)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Right arrow */}
      {slides.length > 1 && (
        <button
          onClick={next}
          style={{
            position: "absolute",
            right: "clamp(8px, 2vw, 20px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "clamp(32px, 4vw, 44px)",
            height: "clamp(32px, 4vw, 44px)",
            background: "rgba(0,0,0,0.4)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            backdropFilter: "blur(4px)",
          }}
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "clamp(8px, 2vw, 16px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            gap: "8px",
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                borderRadius: "100px",
                background: i === current ? "white" : "rgba(255,255,255,0.5)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
