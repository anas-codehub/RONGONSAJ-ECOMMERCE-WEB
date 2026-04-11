"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface OrderItem {
  product: { name: string };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: Date;
  total: number;
  status: string;
  items: OrderItem[];
  address: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    district: string;
  };
  user: {
    name: string | null;
    email: string | null;
  };
}

export default function InvoiceButton({ order }: { order: Order }) {
  const generatePDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header background
    doc.setFillColor(250, 238, 218);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Brand name
    doc.setFontSize(24);
    doc.setTextColor(65, 36, 2);
    doc.setFont("helvetica", "bold");
    doc.text("RÊVE", 14, 18);

    doc.setFontSize(10);
    doc.setTextColor(133, 79, 11);
    doc.setFont("helvetica", "normal");
    doc.text("Fashion · Dhaka, Bangladesh", 14, 26);

    // Invoice title
    doc.setFontSize(20);
    doc.setTextColor(65, 36, 2);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 14, 18, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(133, 79, 11);
    doc.setFont("helvetica", "normal");
    doc.text(`#${order.id}`, pageWidth - 14, 26, { align: "right" });

    // Divider
    doc.setDrawColor(250, 199, 117);
    doc.setLineWidth(0.5);
    doc.line(14, 45, pageWidth - 14, 45);

    // Order info
    doc.setFontSize(10);
    doc.setTextColor(65, 36, 2);
    doc.setFont("helvetica", "bold");
    doc.text("Order details", 14, 55);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(133, 79, 11);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString("en-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      14,
      63,
    );
    doc.text(`Status: ${order.status}`, 14, 70);

    // Customer info
    doc.setFontSize(10);
    doc.setTextColor(65, 36, 2);
    doc.setFont("helvetica", "bold");
    doc.text("Bill to", pageWidth / 2, 55);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(133, 79, 11);
    doc.text(order.address.fullName, pageWidth / 2, 63);
    doc.text(order.address.street, pageWidth / 2, 70);
    doc.text(
      `${order.address.city}, ${order.address.district}`,
      pageWidth / 2,
      77,
    );
    doc.text(`Phone: ${order.address.phone}`, pageWidth / 2, 84);
    if (order.user.email) {
      doc.text(`Email: ${order.user.email}`, pageWidth / 2, 91);
    }

    // Items table
    autoTable(doc, {
      startY: 100,
      head: [["Item", "Qty", "Unit price", "Total"]],
      body: order.items.map((item) => [
        item.product.name,
        item.quantity.toString(),
        `৳${item.price.toLocaleString()}`,
        `৳${(item.price * item.quantity).toLocaleString()}`,
      ]),
      foot: [
        ["", "", "Subtotal", `৳${order.total.toLocaleString()}`],
        ["", "", "Delivery", order.total >= 2000 ? "Free" : "৳100"],
        ["", "", "Total", `৳${order.total.toLocaleString()}`],
      ],
      headStyles: {
        fillColor: [65, 36, 2],
        textColor: [250, 238, 218],
        fontStyle: "bold",
      },
      footStyles: {
        fillColor: [250, 238, 218],
        textColor: [65, 36, 2],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [255, 251, 245],
      },
      styles: {
        fontSize: 10,
        cellPadding: 6,
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 35, halign: "right" },
        3: { cellWidth: 35, halign: "right" },
      },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setDrawColor(250, 199, 117);
    doc.line(14, finalY, pageWidth - 14, finalY);

    doc.setFontSize(9);
    doc.setTextColor(133, 79, 11);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Thank you for shopping with RÊVE Fashion!",
      pageWidth / 2,
      finalY + 10,
      { align: "center" },
    );
    doc.text(
      "For questions: support@rongonsaaj.com",
      pageWidth / 2,
      finalY + 17,
      { align: "center" },
    );
    doc.text(
      "© 2026 RÊVE Fashion · Dhaka, Bangladesh",
      pageWidth / 2,
      finalY + 24,
      { align: "center" },
    );

    // Save
    doc.save(`invoice-${order.id}.pdf`);
  };

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      size="sm"
      className="border-border gap-2"
    >
      <Download className="h-4 w-4" />
      Download invoice
    </Button>
  );
}
