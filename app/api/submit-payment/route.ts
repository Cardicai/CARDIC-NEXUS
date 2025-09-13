import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const val = (k: string) => String(form.get(k) || "");
    const name = val("name");
    const email = val("email");
    const contact = val("contact");
    const productType = val("productType");
    const selectedProduct = val("selectedProduct");
    const tradingview = val("tradingview");
    const notes = val("notes");
    const adminEmail = val("adminEmail") || process.env.ADMIN_EMAIL || "realcardic1@gmail.com";
    const file = form.get("proof") as File | null;

    const attachments: any[] = [];
    if (file && typeof (file as any).arrayBuffer === "function") {
      const buf = Buffer.from(await file.arrayBuffer());
      attachments.push({ filename: file.name || "proof", content: buf });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });

    const subject = `Payment Proof — ${selectedProduct || productType} — ${email}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Contact: ${contact}`,
      `Product Type: ${productType}`,
      `Selected: ${selectedProduct}`,
      `TradingView: ${tradingview}`,
      `Notes: ${notes}`,
    ].join("\n");

    await transporter.sendMail({
      from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
      to: adminEmail,
      subject,
      text,
      attachments,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e?.message || "Server error", { status: 500 });
  }
}
