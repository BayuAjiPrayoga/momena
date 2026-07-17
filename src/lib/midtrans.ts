import crypto from "crypto";

/**
 * Midtrans Snap — utility functions untuk integrasi pembayaran.
 * Mendukung Snap Pop-up (sesuai pilihan user).
 *
 * Docs: https://docs.midtrans.com/reference/snap-api
 */

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BASE_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1"
  : "https://app.sandbox.midtrans.com/snap/v1";

export const SNAP_JS_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

export const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || "";

interface CreateTransactionParams {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemName: string;
}

interface SnapResponse {
  token: string;
  redirect_url: string;
}

/**
 * Membuat transaksi Snap Midtrans dan mendapatkan token untuk pop-up.
 */
export async function createSnapTransaction(
  params: CreateTransactionParams
): Promise<SnapResponse> {
  const authString = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64");

  const body = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    item_details: [
      {
        id: params.orderId,
        price: params.grossAmount,
        quantity: 1,
        name: params.itemName,
      },
    ],
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/book/success?order_id=${params.orderId}`,
    },
  };

  const response = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Midtrans error: ${response.status} — ${errorData}`);
  }

  return response.json();
}

/**
 * Verifikasi Signature Key dari webhook notification Midtrans.
 * Formula: SHA512(order_id + status_code + gross_amount + server_key)
 */
export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const payload = orderId + statusCode + grossAmount + MIDTRANS_SERVER_KEY;
  const hash = crypto.createHash("sha512").update(payload).digest("hex");
  return hash === signatureKey;
}
