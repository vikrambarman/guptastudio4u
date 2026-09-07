// types/index.ts

// ============================================================
// USER TYPES
// ============================================================
export type UserRole = "super_admin" | "admin" | "staff";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================
// CLIENT TYPES
// ============================================================
export interface IClient {
    _id: string;
    clientId: string;       // Auto: GS4U-2024-001
    name: string;
    phone: string;
    email?: string;
    address?: string;
    isActive: boolean;
    createdBy: string;
    events: string[];
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================
// EVENT TYPES
// ============================================================
export type EventType =
    | "wedding"
    | "birthday"
    | "party"
    | "corporate"
    | "maternity"
    | "product"
    | "other";

export type EventStatus =
    | "upcoming"
    | "ongoing"
    | "completed"
    | "delivered";

// ── Permission System (Manual - No Auto Payment) ──
export interface IEventPermissions {
    // Admin manually toggle karta hai
    downloadEnabled: boolean;
    downloadEnabledAt?: Date;
    downloadEnabledBy?: string;   // Admin ID jisne enable kiya

    // Client ne payment ki info
    paymentRequired: boolean;
    paymentAmount: number;        // Kitna amount hai (display ke liye)
    paymentNote?: string;         // "UPI se pay karo" etc.

    // Payment status (manually admin update karta hai)
    paymentStatus: "pending" | "received" | "not_required";
    paymentReceivedAt?: Date;
    paymentReceivedBy?: string;   // Admin ID
    paymentReferenceNote?: string; // "UTR: 123456" ya "PhonePe: xyz"

    // Download expiry
    expiryDate?: Date;
    maxDownloads?: number;        // Optional limit
}

export interface IEvent {
    _id: string;
    eventId: string;              // EVT-2024-001
    title: string;
    eventType: EventType;
    clientId: string;
    clientName?: string;          // Populated
    eventDate: Date;
    venue: string;
    description?: string;
    qrCode: string;               // Universal QR value
    status: EventStatus;
    totalPhotos: number;
    totalVideos: number;
    totalReels: number;
    permissions: IEventPermissions;
    packageDetails?: {
        name: string;
        price: number;
        includes: string[];
    };
    assignedStaff: string[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================
// MEDIA TYPES
// ============================================================
export type MediaType = "photo" | "video" | "reel";

export interface IMedia {
    _id: string;
    mediaId: string;
    eventId: string;
    clientId: string;
    fileName: string;
    originalName: string;
    fileType: MediaType;
    mimeType: string;
    fileSize: number;
    r2Key: string;
    r2Bucket: string;
    thumbnailKey?: string;
    width?: number;
    height?: number;
    duration?: number;
    isPublic: boolean;
    isClientSelected: boolean;   // ✅ Renamed
    selectedBy?: string;
    selectedAt?: Date;
    downloadCount: number;
    lastDownloadAt?: Date;
    uploadedBy: string;
    createdAt: Date;
}

// ============================================================
// ORDER TYPES (Simplified - No Razorpay)
// ============================================================
export type OrderType =
    | "photo_download"
    | "video_download"
    | "mixed_download"
    | "printing"
    | "decoration"
    | "other";

export type OrderStatus =
    | "pending"           // Order bana
    | "payment_pending"   // Payment ka wait
    | "payment_received"  // Admin ne manually mark kiya
    | "processing"
    | "completed"
    | "cancelled";

export interface IOrder {
    _id: string;
    orderId: string;              // ORD-2024-001
    clientId: string;
    eventId: string;
    orderType: OrderType;
    selectedMedia: string[];      // Media IDs
    subtotal: number;
    discount: number;
    total: number;
    status: OrderStatus;

    // Manual payment tracking
    paymentInfo?: {
        upiId: string;              // Studio ka UPI
        qrImageUrl: string;         // Studio ka QR image
        amount: number;
        note: string;               // "Pay karo aur screenshot bhejo"
        paidAt?: Date;              // Admin ne mark kiya
        transactionRef?: string;    // UTR number etc.
    };

    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================================
// API RESPONSE TYPE
// ============================================================
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// ============================================================
// AUTH TYPES
// ============================================================
export interface AdminSessionUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface ClientAuthToken {
    clientId: string;
    clientDbId: string;
    name: string;
    phone: string;
    iat?: number;
    exp?: number;
}

// ============================================================
// SERVICE TYPES (Public Website)
// ============================================================
export type ServiceCategory =
    | "photography"
    | "videography"
    | "printing"
    | "decoration"      // ✅ NEW - Step 11 me add kiya
    | "events"
    | "other";

export interface IService {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: ServiceCategory;
    priceStarting?: number;
    priceUnit?: string;           // "per day", "per piece" etc.
    features: string[];
    isPopular?: boolean;
}

// ============================================================
// PERMISSION UPDATE (Admin ke liye)
// ============================================================
export interface IPermissionUpdate {
    eventId: string;
    downloadEnabled?: boolean;
    paymentStatus?: "pending" | "received" | "not_required";
    paymentReceivedAt?: Date;
    paymentReferenceNote?: string;
    expiryDate?: Date;
    note?: string;
}

// ============================================================
// QR SESSION
// ============================================================
export interface IQRSession {
    sessionId: string;
    scannedAt: Date;
    isAuthenticated: boolean;
    clientId?: string;
    expiresAt: Date;
}

// ============================================================
// DASHBOARD STATS
// ============================================================
export interface IDashboardStats {
    totalClients: number;
    totalEvents: number;
    totalMedia: number;
    pendingPermissions: number;   // Jinhe permission dena hai
    recentEvents: IEvent[];
    recentClients: IClient[];
}