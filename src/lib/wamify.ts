/**
 * Utility untuk mengirim pesan WhatsApp via Wamify.
 */

const WAMIFY_TOKEN = process.env.WAMIFY_TOKEN || "";
const WAMIFY_SESSION_ID = process.env.WAMIFY_SESSION_ID || "";

// Pastikan endpoint disesuaikan dengan dokumentasi resmi Wamify
const WAMIFY_API_URL = "https://wa.wamify.com/api/sendText"; 

interface SendMessageParams {
  to: string; // Format: 628123456789
  message: string;
}

export async function sendWhatsAppMessage({ to, message }: SendMessageParams) {
  if (!WAMIFY_TOKEN || !WAMIFY_SESSION_ID) {
    console.warn("⚠️ WAMIFY credentials not set. Message not sent:", message);
    return false;
  }

  // Membersihkan nomor telepon agar hanya berisi angka dan berawalan 62
  let cleanPhone = to.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.substring(1);
  }

  try {
    const response = await fetch(WAMIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${WAMIFY_TOKEN}`
      },
      body: JSON.stringify({
        session: WAMIFY_SESSION_ID,
        to: cleanPhone,
        text: message
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Wamify API error:", errorText);
      return false;
    }

    console.log(`✅ WA message sent to ${cleanPhone}`);
    return true;
  } catch (error) {
    console.error("❌ Wamify fetch error:", error);
    return false;
  }
}
