import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, message, budget } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // ── 1. Internal notification ──────────────────────────────────────────────
    const { error: notifyError } = await resend.emails.send({
      from: "Ahamed Web Studio <noreply@ahamedwebstudio.com>",
      to: "hello@ahamedwebstudio.com",
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` · ${company}` : ""}`,
      text: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        company ? `Company: ${company}` : null,
        budget  ? `Budget:  ${budget}`  : null,
        ``,
        `Message:`,
        message,
      ].filter(Boolean).join("\n"),
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:32px;background:#030303;color:#fff;border:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:10px;letter-spacing:0.3em;color:#F25C43;margin-bottom:24px;">AHAMED WEB STUDIO // NEW_ENQUIRY</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:11px;width:90px;">NAME</td><td style="padding:8px 0;color:#fff;font-size:13px;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:11px;">EMAIL</td><td style="padding:8px 0;font-size:13px;"><a href="mailto:${email}" style="color:#F25C43;">${email}</a></td></tr>
            ${company ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:11px;">COMPANY</td><td style="padding:8px 0;color:#fff;font-size:13px;">${company}</td></tr>` : ""}
            ${budget  ? `<tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:11px;">BUDGET</td><td style="padding:8px 0;color:#F25C43;font-size:13px;">${budget}</td></tr>` : ""}
          </table>
          <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
            <div style="font-size:10px;letter-spacing:0.2em;color:rgba(255,255,255,0.3);margin-bottom:10px;">MESSAGE</div>
            <div style="font-size:13px;line-height:1.8;color:rgba(255,255,255,0.85);white-space:pre-wrap;">${safeMessage}</div>
          </div>
        </div>
      `,
    });

    if (notifyError) {
      console.error("Resend notify error:", notifyError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // ── 2. Thank-you confirmation to sender ───────────────────────────────────
    await resend.emails.send({
      from: "Ahamed Web Studio <noreply@ahamedwebstudio.com>",
      to: email,
      subject: `Transmission received, ${name.split(" ")[0]}.`,
      text: [
        `${name.split(" ")[0]},`,
        ``,
        `Your message has been received. I'll review the brief and get back to you within 24 hours.`,
        ``,
        `— Ahamed`,
        `Ahamed Web Studio`,
        `hello@ahamedwebstudio.com`,
      ].join("\n"),
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;padding:40px 32px;background:#030303;color:#fff;border:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:10px;letter-spacing:0.3em;color:#F25C43;margin-bottom:32px;">AHAMED WEB STUDIO // TRANSMISSION_RECEIVED</div>

          <p style="font-size:22px;font-weight:300;color:#fff;margin:0 0 20px;letter-spacing:0.02em;">
            ${name.split(" ")[0]},
          </p>

          <p style="font-size:14px;font-weight:300;line-height:1.85;color:rgba(255,255,255,0.7);margin:0 0 28px;border-left:2px solid rgba(26,40,72,0.8);padding-left:16px;">
            Your message has been received. I'll review the brief and get back to you within 24 hours.
          </p>

          ${budget ? `
          <div style="background:rgba(242,92,67,0.05);border:1px solid rgba(242,92,67,0.15);padding:14px 18px;margin-bottom:28px;">
            <div style="font-size:9px;letter-spacing:0.2em;color:rgba(255,255,255,0.3);margin-bottom:6px;">BUDGET_RANGE</div>
            <div style="font-size:13px;color:#F25C43;">${budget}</div>
          </div>` : ""}

          <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:12px;color:#fff;letter-spacing:0.08em;margin-bottom:4px;">Ahamed</div>
              <div style="font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:0.12em;">AHAMED WEB STUDIO</div>
            </div>
            <a href="mailto:hello@ahamedwebstudio.com" style="font-size:10px;color:#F25C43;letter-spacing:0.1em;text-decoration:none;">hello@ahamedwebstudio.com</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
