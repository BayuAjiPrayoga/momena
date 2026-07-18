/**
 * Email Notification Module
 * 
 * Uses Resend API for sending transactional emails.
 * Fallback: logs to console if RESEND_API_KEY is not set.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "Momena Labs <noreply@momena.id>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email via Resend API
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[Email] (DEMO MODE) To: ${payload.to}, Subject: ${payload.subject}`);
    console.log(`[Email] HTML Body preview: ${payload.html.substring(0, 200)}...`);
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("[Email] Failed to send:", error);
      return false;
    }

    console.log(`[Email] ✅ Sent to ${payload.to}: ${payload.subject}`);
    return true;
  } catch (error) {
    console.error("[Email] Error:", error);
    return false;
  }
}

/**
 * Email: Order Created (after checkout)
 */
export async function sendOrderCreatedEmail({
  customerName,
  customerEmail,
  orderNumber,
  themeName,
  packageName,
  amount,
}: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  themeName: string;
  packageName: string;
  amount: number;
}) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; background: #fafaf9; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1a1510, #2a2015); padding: 32px 24px; text-align: center;">
        <h1 style="color: #D4A843; font-size: 24px; margin: 0;">Momena Labs</h1>
        <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 4px;">Undangan Digital Premium</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #1a1510; font-size: 20px; margin: 0 0 8px;">Pesanan Anda Diterima! 🎉</h2>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Halo <strong>${customerName}</strong>, terima kasih telah memesan undangan digital di Momena Labs.
        </p>
        
        <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; font-size: 14px; color: #333;">
            <tr>
              <td style="padding: 8px 0; color: #888;">No. Pesanan</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600; font-family: monospace;">${orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Tema</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${themeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">Paket</td>
              <td style="padding: 8px 0; text-align: right; font-weight: 600;">${packageName}</td>
            </tr>
            <tr style="border-top: 1px solid #eee;">
              <td style="padding: 12px 0 8px; color: #888; font-weight: 600;">Total</td>
              <td style="padding: 12px 0 8px; text-align: right; font-weight: 700; color: #D4A843; font-size: 18px;">Rp ${amount.toLocaleString("id-ID")}</td>
            </tr>
          </table>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Silakan selesaikan pembayaran agar undangan Anda segera aktif. Kami akan mengirimkan notifikasi melalui WhatsApp dan email setelah pembayaran dikonfirmasi.
        </p>
      </div>
      <div style="background: #f5f5f5; padding: 16px 24px; text-align: center; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} Momena Labs · Undangan Digital Premium
      </div>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Pesanan Diterima — ${orderNumber} | Momena Labs`,
    html,
  });
}

/**
 * Email: Payment Success (invitation now active)
 */
export async function sendPaymentSuccessEmail({
  customerName,
  customerEmail,
  orderNumber,
  themeName,
  inviteUrl,
  clientUrl,
}: {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  themeName: string;
  inviteUrl: string;
  clientUrl: string;
}) {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 560px; margin: 0 auto; background: #fafaf9; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1a1510, #2a2015); padding: 32px 24px; text-align: center;">
        <h1 style="color: #D4A843; font-size: 24px; margin: 0;">Momena Labs</h1>
        <p style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 4px;">Undangan Digital Premium</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #1a1510; font-size: 20px; margin: 0 0 8px;">Undangan Anda Sudah Aktif! 🎊</h2>
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Halo <strong>${customerName}</strong>, pembayaran untuk pesanan <strong>${orderNumber}</strong> (Tema: ${themeName}) telah berhasil dikonfirmasi.
        </p>

        <div style="margin: 24px 0; text-align: center;">
          <a href="${inviteUrl}" style="display: inline-block; background: #D4A843; color: #1a1510; padding: 14px 28px; border-radius: 99px; text-decoration: none; font-weight: 700; font-size: 14px;">
            🌐 Lihat Undangan Anda
          </a>
        </div>

        <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="font-size: 13px; color: #888; margin: 0 0 4px;">Link Undangan:</p>
          <p style="font-size: 14px; color: #D4A843; margin: 0; word-break: break-all;">${inviteUrl}</p>
        </div>
        
        <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="font-size: 13px; color: #888; margin: 0 0 4px;">Panel Klien (RSVP, Buku Tamu, dll):</p>
          <a href="${clientUrl}" style="font-size: 14px; color: #6366f1;">${clientUrl}</a>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          Anda bisa mulai membagikan link undangan ke tamu-tamu Anda melalui WhatsApp atau media sosial lainnya. Selamat merayakan momen spesial Anda! 💍
        </p>
      </div>
      <div style="background: #f5f5f5; padding: 16px 24px; text-align: center; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} Momena Labs · Undangan Digital Premium
      </div>
    </div>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Undangan Aktif! 🎉 — ${orderNumber} | Momena Labs`,
    html,
  });
}
