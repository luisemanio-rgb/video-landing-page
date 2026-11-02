/**
 * ================================================================
 *  SMARTVIDEO LANDING PAGE CONFIGURATION (ব্যক্তিগত বিজ্ঞাপন সেটিংস)
 * ================================================================
 * এখানে আপনি সহজেই আপনার নিজের যেকোনো পার্সোনাল অ্যাড লিংক, ব্যানার,
 * ভিডিওর নাম ও থাম্বনেইল পরিবর্তন করতে পারবেন।
 */

const SITE_CONFIG = {
    // ওয়েবসাইট ব্র্যান্ডিং
    branding: {
        siteName: "SMARTVIDEO",
        logoIcon: "▶", // লোগো আইকন
        tagline: "Trending & Exclusive Video Player",
        headerTicker: "🔥 হট আপডেট: আজকের সবচেয়ে ভাইরাল ভিডিওটি দেখতে নিচে ক্লিক করুন!",
    },

    // ভিডিওর তথ্য (ভিডিও প্লেয়ারে যা দেখাবে)
    video: {
        title: "Viral Premium Video - Exclusive Full Uncensored Leak 2026",
        channelName: "Studio Official",
        isVerified: true,
        views: "1.8M Views",
        timeAgo: "2 hours ago",
        duration: "45:20",
        isLive: true,
        badgeText: "🔴 LIVE STREAM",
        qualityText: "4K ULTRA HD",
        // থাম্বনেইল ছবি (নিজের ছবির লিংক দিতে পারেন)
        thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&q=80",
        likes: "128K",
        shares: "24.5K",
    },

    // 🔥 পার্সোনাল বিজ্ঞাপন সেটিংস (MUST AMAR PERSONAL AD)
    personalAds: {
        // ১. প্লেয়ারে ক্লিক করলেই যে অ্যাড লিংক বা সিপিএ অফার ওপেন হবে (Direct Ad / Popunder Link)
        directAdUrl: "https://example.com/your-personal-ad-link",
        
        // অ্যাড খোলার মোড:
        // 'always' = প্রতি ক্লিকেই অ্যাড ওপেন হবে
        // 'first-click' = প্রথম ক্লিকে ওপেন হবে, এরপর স্বাভাবিক লোডিং দেখাবে
        // 'every-2-clicks' = প্রতি ২ ক্লিকে ১ বার ওপেন হবে
        clickMode: "always",

        // নতুন ট্যাবে অ্যাড ওপেন হবে কিনা
        openInNewTab: true,

        // ২. হিউম্যান ভেরিফিকেশন / স্পন্সরড অফার লকার (ভিডিও প্লে হওয়ার আগে লকার দেখানো)
        contentLocker: {
            enabled: true, // true দিলে লকার দেখাবে, false দিলে সরাসরি প্লেয়ার লোড হবে
            lockerHeading: "🛡️ Human Verification Required",
            lockerSubtext: "বট ট্রাফিক প্রতিরোধের জন্য নিচে ভেরিফাই করুন এবং আনলক করুন:",
            verifyButtonText: "I am not a robot (Verify Now)",
            
            // স্পন্সরড প্রিমিয়াম অফার বক্স (যেমন ভিডিওতে দেখানো হয়েছিল)
            sponsoredBoxHeading: "🎁 স্পন্সরড প্রিমিয়াম অফার",
            sponsoredBoxText: "👑 স্পন্সরড লিংকে সাইন-আপ করে ৩০ সেকেন্ড সময় দিলেই পাবেন ২৪ ঘণ্টার অ্যাড-ফ্রি প্রিমিয়াম অভিজ্ঞতা!",
            sponsoredButtonText: "👤+ অফারটি গ্রহণ করুন ও ভিডিও দেখুন",
            sponsoredOfferUrl: "https://example.com/your-sponsored-cpa-offer"
        },

        // ৩. টপ ব্যানার অ্যাড (ভিডিওর উপরে দেখাবে)
        topBanner: {
            enabled: true,
            imageUrl: "https://via.placeholder.com/728x90/111827/38bdf8?text=Your+Personal+Top+Banner+Ad+(728x90)",
            targetUrl: "https://example.com/your-top-banner-link",
            altText: "Special Offer"
        },

        // ৪. বটম ব্যানার অ্যাড (ভিডিওর নিচে দেখাবে)
        bottomBanner: {
            enabled: true,
            imageUrl: "https://via.placeholder.com/728x90/111827/22c55e?text=Your+Personal+Bottom+Banner+Ad+(728x90)",
            targetUrl: "https://example.com/your-bottom-banner-link",
            altText: "Exclusive Promo"
        },

        // ৫. সাইডবার / আপ-নেক্সট ব্যানার গ্রিড (৪টি ব্যানার স্লট)
        sidebarBanners: [
            {
                enabled: true,
                title: "License casino. Paid me same day.",
                badge: "PROMO",
                imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80",
                targetUrl: "https://example.com/promo-1"
            },
            {
                enabled: true,
                title: "Live chat with models near you",
                badge: "HOT",
                imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
                targetUrl: "https://example.com/promo-2"
            },
            {
                enabled: true,
                title: "Download Fast VPN & Stream 4K",
                badge: "FREE",
                imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&q=80",
                targetUrl: "https://example.com/promo-3"
            },
            {
                enabled: true,
                title: "Claim 100 Free Spins Instant",
                badge: "BONUS",
                imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=300&q=80",
                targetUrl: "https://example.com/promo-4"
            }
        ]
    },

    // টেলিগ্রাম চ্যানেল বাটন (Bottom-Right Floating)
    telegram: {
        enabled: true,
        text: "Join VIP Group",
        url: "https://t.me/your_telegram_channel"
    },

    // আরও ভিডিও (Up Next / Related Videos)
    relatedVideos: [
        {
            id: 1,
            title: "টাইম স্টোরি সুন্দর একটি মুভি ইনজয় করতে পারেন",
            views: "89.4K",
            likes: "4.2K",
            thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
            duration: "32:15"
        },
        {
            id: 2,
            title: "নতুন রোমান্টিক নাটক ২০২৬ - পর্ব ০১",
            views: "142.1K",
            likes: "12.8K",
            thumbnail: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80",
            duration: "41:00"
        },
        {
            id: 3,
            title: "ব্লকবাস্টার অ্যাকশন থ্রিলার ফুল মুভি",
            views: "310.5K",
            likes: "28.3K",
            thumbnail: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&q=80",
            duration: "58:30"
        }
    ]
};
