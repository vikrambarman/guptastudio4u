// components/shared/PaymentQRCard.tsx
"use client";

interface PaymentQRCardProps {
    amount: number;
    note?: string;
}

export default function PaymentQRCard({ amount, note }: PaymentQRCardProps) {
    const upiId = process.env.NEXT_PUBLIC_PAYMENT_UPI_ID || "";
    const qrImage =
        process.env.NEXT_PUBLIC_PAYMENT_QR_IMAGE || "/images/payment-qr.png";
    const studioPhone = process.env.NEXT_PUBLIC_STUDIO_PHONE || "";

    const whatsappUrl = studioPhone
        ? `https://wa.me/${studioPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
            "Namaste, maine payment kar diya hai. Screenshot attach hai."
        )}`
        : null;

    return (
        <div className="payment-qr-section">
            <div className="payment-qr-title">Payment Karein</div>
            <div className="payment-qr-amount">
                <span>₹</span>
                {amount}
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImage} alt="Payment QR" className="payment-qr-image" />

            <div className="payment-qr-upi">{upiId}</div>

            <div className="payment-qr-steps">
                <div className="payment-qr-step">
                    <span className="payment-qr-step-num">1</span>
                    <span>Upar diye QR ko apne UPI app se scan karein</span>
                </div>
                <div className="payment-qr-step">
                    <span className="payment-qr-step-num">2</span>
                    <span>₹{amount} ka payment complete karein</span>
                </div>
                <div className="payment-qr-step">
                    <span className="payment-qr-step-num">3</span>
                    <span>Payment screenshot studio ko WhatsApp karein</span>
                </div>
            </div>

            {note && <p className="text-sm text-muted mb-4">{note}</p>}

            {whatsappUrl && (
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-gold"
                    style={{ width: "100%", textAlign: "center" }}
                >
                    Screenshot WhatsApp Karein
                </a>
            )}
        </div>
    );
}