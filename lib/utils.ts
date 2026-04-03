import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderNumber(count: number): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const sequence = String(count + 1).padStart(3, "0");
  return `ORD-${dateStr}-${sequence}`;
}

export function formatOrderId(orderId: string): string {
  return `#${orderId}`;
}

export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}