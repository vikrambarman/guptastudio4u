// lib/config/services.ts
import type { IService, ServiceCategory } from "@/types";

export interface CategoryMeta {
    category: ServiceCategory;
    slug: string;
    title: string;
    icon: string;
    description: string;
}

export const CATEGORY_META: CategoryMeta[] = [
    {
        category: "photography",
        slug: "photography",
        title: "Photography",
        icon: "📸",
        description:
            "Wedding se lekar corporate shoots tak — har moment ko professional photography se yaadgar banate hain.",
    },
    {
        category: "videography",
        slug: "videography",
        title: "Videography",
        icon: "🎥",
        description:
            "Cinematic wedding films se lekar event highlights tak — har video ek kahani sunata hai.",
    },
    {
        category: "decoration",
        slug: "decoration",
        title: "Decoration & DJ",
        icon: "🎊",
        description:
            "Shadi, birthday, party — har event ko decoration aur DJ setup se special banate hain.",
    },
    {
        category: "printing",
        slug: "printing",
        title: "Printing & Merchandise",
        icon: "🖨️",
        description:
            "Photo frames, T-shirts, mugs, ID cards, banners — sab kuch ek hi jagah print karwayein.",
    },
    {
        category: "events",
        slug: "events",
        title: "Event Management",
        icon: "🎉",
        description:
            "Shadi se corporate events tak — planning se execution tak, sab kuch hum sambhalte hain.",
    },
];

export const SERVICES: IService[] = [
    // ── Photography ──
    {
        id: "wedding-photography",
        title: "Wedding Photography",
        description:
            "Aapki shaadi ke har rasm ko candid aur traditional andaaz me capture karte hain.",
        icon: "💍",
        category: "photography",
        priceStarting: 15000,
        priceUnit: "day",
        features: ["Candid + Traditional", "Pre-Wedding Shoot", "Same-Day Highlights"],
        isPopular: true,
    },
    {
        id: "birthday-photography",
        title: "Birthday Photography",
        description: "Bacchon se lekar adults tak — har birthday party ko colorful click karte hain.",
        icon: "🎂",
        category: "photography",
        priceStarting: 3000,
        priceUnit: "event",
        features: ["Candid Shots", "Theme-Based Photography", "Quick Delivery"],
    },
    {
        id: "event-photography",
        title: "Event Photography",
        description: "Corporate events, seminars, product launches — professional coverage.",
        icon: "🏢",
        category: "photography",
        priceStarting: 8000,
        priceUnit: "event",
        features: ["Corporate Coverage", "Group Photos", "Same-Day Preview"],
    },
    {
        id: "maternity-photography",
        title: "Maternity Shoot",
        description: "Motherhood ke is khaas safar ko khoobsurat andaaz me kaid karte hain.",
        icon: "🤰",
        category: "photography",
        features: ["Indoor / Outdoor", "Family Shots Included"],
    },

    // ── Videography ──
    {
        id: "wedding-videography",
        title: "Wedding Videography",
        description: "Cinematic wedding films jo aapki shaadi ki har feeling ko zinda rakhein.",
        icon: "🎬",
        category: "videography",
        priceStarting: 20000,
        priceUnit: "day",
        features: ["Cinematic Editing", "Drone Shots Available", "Highlight Reel"],
        isPopular: true,
    },
    {
        id: "event-video-shoot",
        title: "Event Video Shoot",
        description: "Birthday, party, corporate events — full event ki video coverage.",
        icon: "📹",
        category: "videography",
        priceStarting: 5000,
        priceUnit: "event",
        features: ["Full Event Recording", "Edited Highlights"],
    },
    {
        id: "reels-shorts",
        title: "Reels & Short Videos",
        description: "Social media ke liye trending reels aur short cinematic clips.",
        icon: "📱",
        category: "videography",
        features: ["Instagram/YouTube Ready", "Quick Turnaround"],
    },

    // ── Decoration ──
    {
        id: "wedding-decoration",
        title: "Wedding Decoration",
        description: "Stage, mandap aur venue decoration — traditional se modern themes tak.",
        icon: "🌸",
        category: "decoration",
        priceStarting: 10000,
        priceUnit: "event",
        features: ["Stage & Mandap", "Flower Decoration", "Lighting Setup"],
    },
    {
        id: "birthday-decoration",
        title: "Birthday & Party Decoration",
        description: "Balloon decoration, themes aur backdrop setup — har party special.",
        icon: "🎈",
        category: "decoration",
        priceStarting: 2500,
        priceUnit: "event",
        features: ["Balloon Decoration", "Theme-Based Setup", "Backdrop Design"],
    },
    {
        id: "dj-setup",
        title: "DJ Setup",
        description: "High-quality sound aur lighting ke saath event ko live banayein.",
        icon: "🎧",
        category: "decoration",
        priceStarting: 6000,
        priceUnit: "event",
        features: ["Sound System", "Lighting Effects", "Experienced DJ"],
    },

    // ── Printing ──
    {
        id: "photo-frames",
        title: "Photo Frames",
        description: "Aapki favourite photos ko premium quality frames me print karwayein.",
        icon: "🖼️",
        category: "printing",
        features: ["Multiple Sizes", "Premium Quality"],
    },
    {
        id: "tshirt-printing",
        title: "T-Shirt Printing",
        description: "Custom design, photo ya text — apni pasand ka T-shirt print karwayein.",
        icon: "👕",
        category: "printing",
        features: ["Custom Designs", "Bulk Orders Available"],
    },
    {
        id: "mug-printing",
        title: "Mug Printing",
        description: "Personalized photo mugs — gifting ke liye perfect option.",
        icon: "☕",
        category: "printing",
        features: ["Photo/Text Printing", "Gift Packaging Available"],
    },
    {
        id: "id-card-printing",
        title: "ID Card Printing",
        description: "School, office ya event ke liye professional ID cards.",
        icon: "🪪",
        category: "printing",
        features: ["PVC Cards", "Lanyard Available"],
    },
    {
        id: "spiral-binding",
        title: "Spiral Binding",
        description: "Documents, projects aur albums ki spiral binding service.",
        icon: "📑",
        category: "printing",
        features: ["Same-Day Service", "Multiple Cover Options"],
    },
    {
        id: "banner-printing",
        title: "Banner Printing",
        description: "Shop, event ya wedding ke liye high-quality flex banners.",
        icon: "🚩",
        category: "printing",
        features: ["Any Size Available", "Weather-Resistant"],
    },

    // ── Events ──
    {
        id: "wedding-planning",
        title: "Wedding Planning",
        description: "Shadi ki planning se execution tak — sab kuch hum sambhalte hain.",
        icon: "💐",
        category: "events",
        features: ["End-to-End Planning", "Vendor Coordination"],
    },
    {
        id: "birthday-party-planning",
        title: "Birthday Party Planning",
        description: "Theme selection se lekar venue tak — complete party planning.",
        icon: "🥳",
        category: "events",
        features: ["Theme Planning", "Venue Coordination"],
    },
    {
        id: "corporate-events",
        title: "Corporate Events",
        description: "Seminars, product launches aur corporate parties ki complete management.",
        icon: "🏆",
        category: "events",
        features: ["Full Event Management", "Professional Setup"],
    },

    // ── Other ──
    {
        id: "lic-agent",
        title: "LIC Agent Services",
        description:
            "Life insurance policy ke liye guidance aur assistance — bharosemand LIC agent services.",
        icon: "🛡️",
        category: "other",
        features: ["Policy Guidance", "Claim Assistance"],
    },
];

export function getServicesByCategory(category: ServiceCategory): IService[] {
    return SERVICES.filter((service) => service.category === category);
}

export function getCategoryMeta(category: ServiceCategory): CategoryMeta | undefined {
    return CATEGORY_META.find((meta) => meta.category === category);
}