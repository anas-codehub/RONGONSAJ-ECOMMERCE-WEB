"use client";

import { useState, useRef, useEffect } from "react";
import { DELIVERY_ZONES } from "@/lib/districts";
import { ChevronDown, X } from "lucide-react";

const ALL_DISTRICTS_GROUPED = [
  {
    label: "── Dhaka ──",
    districts: DELIVERY_ZONES.dhaka.districts,
  },
  {
    label: "── Sub Dhaka ──",
    districts: DELIVERY_ZONES.subDhaka.districts,
  },
  {
    label: "── Outside Dhaka ──",
    districts: DELIVERY_ZONES.outsideDhaka.districts,
  },
];

const ALL_FLAT = [
  ...DELIVERY_ZONES.dhaka.districts,
  ...DELIVERY_ZONES.subDhaka.districts,
  ...DELIVERY_ZONES.outsideDhaka.districts,
];

export default function DistrictInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [input, setInput] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        // If typed value doesn't match any district reset it
        if (!ALL_FLAT.includes(input)) {
          setInput(value || "");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [input, value]);

  const handleInputChange = (val: string) => {
    setInput(val);
    setOpen(true);
    if (val.trim() === "") {
      setFiltered([]);
      onChange("");
    } else {
      const results = ALL_FLAT.filter((d) =>
        d.toLowerCase().startsWith(val.toLowerCase()),
      );
      setFiltered(results);
      // If exact match found auto select
      const exact = ALL_FLAT.find((d) => d.toLowerCase() === val.toLowerCase());
      if (exact) onChange(exact);
      else onChange("");
    }
  };

  const handleSelect = (district: string) => {
    setInput(district);
    onChange(district);
    setOpen(false);
    setFiltered([]);
  };

  const handleClear = () => {
    setInput("");
    onChange("");
    setFiltered([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const showAll = input.trim() === "" && open;
  const showFiltered = input.trim() !== "" && filtered.length > 0 && open;
  const showNotFound =
    input.trim() !== "" &&
    filtered.length === 0 &&
    open &&
    !ALL_FLAT.includes(input);

  return (
    <div ref={ref} className="relative">
      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Type or select district..."
          className="w-full h-11 px-3 pr-16 rounded-xl border border-border text-sm outline-none focus:border-primary transition-colors"
          style={{
            background: "var(--secondary)",
            color: "var(--foreground)",
          }}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-6 h-6 flex items-center justify-center"
          >
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {(showAll || showFiltered || showNotFound) && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-hidden shadow-xl z-50"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            maxHeight: "240px",
            overflowY: "auto",
          }}
        >
          {/* Not found */}
          {showNotFound && (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              No district found for "{input}"
            </div>
          )}

          {/* Filtered results */}
          {showFiltered &&
            filtered.map((district) => (
              <button
                key={district}
                type="button"
                onClick={() => handleSelect(district)}
                className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-between"
                style={{ color: "var(--foreground)" }}
              >
                <span>{district}</span>
                <span className="text-xs text-muted-foreground">
                  {DELIVERY_ZONES.dhaka.districts.includes(district)
                    ? "Dhaka"
                    : DELIVERY_ZONES.subDhaka.districts.includes(district)
                      ? "Sub Dhaka"
                      : "Outside Dhaka"}
                </span>
              </button>
            ))}

          {/* All districts grouped */}
          {showAll &&
            ALL_DISTRICTS_GROUPED.map((group) => (
              <div key={group.label}>
                <div
                  className="px-4 py-2 text-xs font-extrabold text-muted-foreground uppercase tracking-wider sticky top-0"
                  style={{ background: "var(--secondary)" }}
                >
                  {group.label}
                </div>
                {group.districts.map((district) => (
                  <button
                    key={district}
                    type="button"
                    onClick={() => handleSelect(district)}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                    style={{ color: "var(--foreground)" }}
                  >
                    {district}
                  </button>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
