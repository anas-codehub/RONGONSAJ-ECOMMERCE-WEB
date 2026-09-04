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

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    if (slides.length === 0) return;

    goTo(current === slides.length - 1 ? 0 : current + 1);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;

    goTo(current === 0 ? slides.length - 1 : current - 1);
  }, [current, slides.length, goTo]);

  // Auto slide
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(timer);
  }, [next, slides.length]);

  // Reset current slide if slides change
  useEffect(() => {
    if (current >= slides.length && slides.length > 0) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* SLIDER */}
      <div className="relative w-full aspect-video">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: i === current ? 1 : 0,
              zIndex: i === current ? 1 : 0,
              pointerEvents: i === current ? "auto" : "none",
            }}
          >
            {/* HERO IMAGE */}
            <Image
              src={slide.image}
              alt={slide.title || "Hero slide"}
              fill
              priority={i === 0}
              sizes="100vw"
              className="w-full h-full object-cover"
            />

            {/* TEXT OVERLAY */}
            {(slide.title || slide.subtitle || slide.buttonText) && (
              <div
                className="absolute inset-0 flex items-end justify-center pb-8 md:pb-14"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                  zIndex: 3,
                }}
              >
                <div className="text-center px-4 max-w-2xl">
                  {slide.title && (
                    <h2
                      className="text-white font-extrabold leading-tight mb-2"
                      style={{
                        fontSize: "clamp(18px, 4vw, 52px)",
                      }}
                    >
                      {slide.title}
                    </h2>
                  )}

                  {slide.subtitle && (
                    <p
                      className="text-white/90 mb-4"
                      style={{
                        fontSize: "clamp(12px, 2vw, 20px)",
                      }}
                    >
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.buttonText && slide.buttonLink && (
                    <Link href={slide.buttonLink}>
                      <button
                        type="button"
                        className="font-extrabold rounded-xl hover:opacity-90 hover:scale-105 transition-all"
                        style={{
                          background: "var(--primary)",
                          color: "var(--primary-foreground)",
                          padding:
                            "clamp(8px, 1.5vw, 14px) clamp(20px, 3vw, 36px)",
                          fontSize: "clamp(12px, 1.5vw, 16px)",
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
      </div>

      {/* NAVIGATION ARROWS */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{
              left: "clamp(8px, 2vw, 24px)",
              width: "clamp(32px, 4vw, 48px)",
              height: "clamp(32px, 4vw, 48px)",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <ChevronLeft color="white" size={20} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
            style={{
              right: "clamp(8px, 2vw, 24px)",
              width: "clamp(32px, 4vw, 48px)",
              height: "clamp(32px, 4vw, 48px)",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <ChevronRight color="white" size={20} />
          </button>
        </>
      )}

      {/* DOTS */}
      {slides.length > 1 && (
        <div
          className="absolute z-20 flex gap-2"
          style={{
            bottom: "clamp(8px, 2vw, 18px)",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                borderRadius: "100px",
                background: i === current ? "white" : "rgba(255,255,255,0.45)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
