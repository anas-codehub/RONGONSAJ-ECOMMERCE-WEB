"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Dhaka city: 1–2 business days. Outside Dhaka: 3–5 business days. Remote areas: 5–7 business days.",
  },
  {
    q: "What is your payment method?",
    a: "We currently accept Cash on Delivery only. Pay when your order arrives at your doorstep.",
  },
  {
    q: "How do I track my order?",
    a: "You can track your order from your account page under My Orders. We'll also update the status as your order progresses.",
  },
  {
    q: "Can I return an item?",
    a: "Yes! We have a 7-day return policy. Items must be unused, unwashed, and in original condition with tags attached.",
  },
  {
    q: "What sizes do you offer?",
    a: "Each product lists its available sizes. We offer S, M, L, XL, and XXL for most clothing items.",
  },
  {
    q: "How do I use a coupon code?",
    a: "Enter your coupon code at checkout in the Coupon code field and click Apply. The discount will be applied to your order total.",
  },
  {
    q: "Can I cancel my order?",
    a: "You can request an order cancellation by contacting us as soon as possible. Once the order is shipped, it cannot be cancelled.",
  },
  {
    q: "Is my personal information safe?",
    a: "Yes. We use industry-standard security measures to protect your data. We never share your personal information with third parties for marketing purposes.",
  },
  {
    q: "How do I change my password?",
    a: "Go to My Profile from the account menu and scroll down to Change Password section.",
  },
  {
    q: "Do you offer wholesale or bulk orders?",
    a: "Yes! For bulk orders, please contact us directly at support@rongonsaaj.com and we'll provide special pricing.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-foreground px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-[3px] uppercase mb-3">
            Help center
          </p>
          <h1 className="text-4xl font-extrabold text-background tracking-tight mb-4">
            Frequently asked questions
          </h1>
          <p className="text-background/60 text-lg max-w-md mx-auto">
            Find answers to the most common questions about Rongonsaaj.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary transition-colors"
              >
                <span className="text-sm font-extrabold text-foreground pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed pt-4">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
