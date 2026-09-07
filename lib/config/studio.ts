// lib/config/studio.ts
export const STUDIO_CONFIG = {
  name: process.env.NEXT_PUBLIC_STUDIO_NAME || "Gupta Studio 4u",
  phone: process.env.NEXT_PUBLIC_STUDIO_PHONE || "",
  email: process.env.NEXT_PUBLIC_STUDIO_EMAIL || "",
  address: process.env.NEXT_PUBLIC_STUDIO_ADDRESS || "",
  // Universal QR - sabhi events ke liye SAME value
  qrScanUrl:
    process.env.NEXT_PUBLIC_QR_SCAN_URL ||
    "http://localhost:3000/client-portal",
};