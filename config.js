/**
 * ================================================================
 *  SMARTVIDEO LANDING PAGE CONFIGURATION
 * ================================================================
 * এখানে আপনি Adsterra, Monetag বা যেকোনো অ্যাড নেটওয়ার্কের
 * Direct Link, Popunder, Social Bar এবং Banner কোড সহজে কানেক্ট করতে পারবেন।
 */

const SITE_CONFIG = {
    // ওয়েবসাইট ব্র্যান্ডিং
    branding: {
        siteName: "SMARTVIDEO",
        logoIcon: "▶",
        tagline: "Trending & Exclusive Video Player",
        headerTicker: "🔥 হট আপডেট: আজকের সবচেয়ে ভাইরাল ভিডিওটি দেখতে নিচে ক্লিক করুন!",
    },

    // ভিডিওর তথ্য ও আসল প্লেব্যাক সেটিংস
    video: {
        // প্লেব্যাক মোড: 'youtube' | 'mp4' | 'simulated' (ফেক/শুধু অ্যাড)
        playbackMode: "youtube",
        
        // ১. ইউটিউব ভিডিও বা লাইভ স্ট্রিম লিঙ্ক (YouTube Video / Live Stream URL)
        youtubeUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk",

        // ২. সরাসরি MP4 ভিডিও বা স্ট্রিম লিঙ্ক (Direct MP4 URL)
        mp4Url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",

        // লাইভ স্ট্রিম ও ব্যাজ
        isLive: true,
        badgeText: "🔴 LIVE STREAM",
        qualityText: "4K ULTRA HD",

        title: "Viral Premium Video - Exclusive Full Uncensored Leak 2026",
        channelName: "Studio Official",
        isVerified: true,
        views: "1.8M Views",
        timeAgo: "2 hours ago",
        duration: "45:20",
        thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&q=80",
        likes: "128K",
        shares: "24.5K",
    },

    // ⚡ ADSTERRA & থার্ড-পার্টি অ্যাড নেটওয়ার্ক সংযোগ (Adsterra Integration)
    adsterra: {
        // ১. Adsterra Direct Link (স্মার্টলিঙ্ক) - প্লেয়ারে বা পেজের যেকোনো জায়গায় ক্লিক করলেই ওপেন হবে
        // আপনার Adsterra ড্যাশবোর্ডের Direct Links থেকে লিঙ্ক এনে এখানে বা admin.html এ বসান
        directLink: "https://www.google.com",
        
        // ২. Adsterra Popunder Script (পপ-আন্ডার কোড বা স্ক্রিপ্ট ইউআরএল)
        // উদাহরণ: https://pl28435493.profitableratecpmnetwork.com/5f/10/71/...js
        popunderScript: "",

        // ৩. Adsterra Social Bar Script (ইন-পেজ পুশ ব্যানার)
        socialBarScript: "",

        // ৪. Adsterra Native Banner Code (নেটিভ ব্যানার কোড)
        // উদাহরণ: <script ...></script><div id="container-..."></div>
        nativeBannerCode: "",

        // ৫. Adsterra 728x90 Top Banner কোড (অথবা ছবি/লিংক)
        topBannerCode: "",

        // ৬. Adsterra 728x90 Bottom Banner কোড (অথবা ছবি/লিংক)
        bottomBannerCode: "",

        // ৭. Adsterra 300x250 Sidebar Banner কোড
        sidebarBannerCode: ""
    },

    // 🔥 পার্সোনাল বিজ্ঞাপন ও কাস্টম ব্যানার সেটিংস (Personal Ads)
    personalAds: {
        // প্লেয়ার ক্লিক মোড
        clickMode: "always", // 'always' | 'first-click' | 'every-2-clicks'
        openInNewTab: true,

        // হিউম্যান ভেরিফিকেশন / স্পন্সরড অফার লকার
        contentLocker: {
            enabled: true,
            lockerHeading: "🛡️ Human Verification Required",
            lockerSubtext: "বট ট্রাফিক প্রতিরোধের জন্য নিচে ভেরিফাই করুন এবং আনলক করুন:",
            verifyButtonText: "I am not a robot (Verify Now)",
            sponsoredBoxHeading: "🎁 স্পন্সরড প্রিমিয়াম অফার",
            sponsoredBoxText: "👑 স্পন্সরড লিংকে সাইন-আপ করে ৩০ সেকেন্ড সময় দিলেই পাবেন ২৪ ঘণ্টার অ্যাড-ফ্রি প্রিমিয়াম অভিজ্ঞতা!",
            sponsoredButtonText: "👤+ অফারটি গ্রহণ করুন ও ভিডিও দেখুন",
            sponsoredOfferUrl: "https://spendsdetachment.com/your-adsterra-direct-link"
        },

        // কাস্টম টপ ব্যানার (যদি Adsterra কোড খালি থাকে তবে এটি দেখাবে)
        topBanner: {
            enabled: true,
            imageUrl: "https://via.placeholder.com/728x90/111827/38bdf8?text=Adsterra+or+Personal+Top+Banner+(728x90)",
            targetUrl: "https://spendsdetachment.com/your-adsterra-direct-link",
            altText: "Special Offer"
        },

        // কাস্টম বটম ব্যানার
        bottomBanner: {
            enabled: true,
            imageUrl: "https://via.placeholder.com/728x90/111827/22c55e?text=Adsterra+or+Personal+Bottom+Banner+(728x90)",
            targetUrl: "https://spendsdetachment.com/your-adsterra-direct-link",
            altText: "Exclusive Promo"
        },

        // কাস্টম সাইডবার ব্যানার গ্রিড
        sidebarBanners: [
            {
                enabled: true,
                title: "License casino. Paid me same day.",
                badge: "PROMO",
                imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&q=80",
                targetUrl: "https://spendsdetachment.com/your-adsterra-direct-link"
            },
            {
                enabled: true,
                title: "Live chat with models near you",
                badge: "HOT",
                imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
                targetUrl: "https://spendsdetachment.com/your-adsterra-direct-link"
            },
            {
                enabled: true,
                title: "Download Fast VPN & Stream 4K",
                badge: "FREE",
                imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&q=80",
                targetUrl: "https://spendsdetachment.com/your-adsterra-direct-link"
            },
            {
                enabled: true,
                title: "Claim 100 Free Spins Instant",
                badge: "BONUS",
                imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=300&q=80",
                targetUrl: "https://spendsdetachment.com/your-adsterra-direct-link"
            }
        ]
    },

    // টেলিগ্রাম চ্যানেল বাটন
    telegram: {
        enabled: false,
        text: "Join VIP Group",
        url: "https://t.me/your_telegram_channel"
    },

    // সম্পর্কিত ভিডিও তালিকা
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
