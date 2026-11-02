/**
 * ============================================================
 *  SMARTVIDEO LANDING PAGE INTERACTIVE CONTROLLER
 * ============================================================
 */

(function () {
    // LocalStorage থেকে কনফিগ চেক করা (যদি অ্যাডমিন প্যানেল দিয়ে আপডেট করা হয়)
    let config = SITE_CONFIG;
    try {
        const savedConfig = localStorage.getItem("SMARTVIDEO_CONFIG");
        if (savedConfig) {
            config = JSON.parse(savedConfig);
        }
    } catch (e) {
        console.warn("Using default config from config.js");
    }

    // স্টেট ভ্যারিয়েবল
    let clickCount = 0;
    let isBuffering = false;

    // ১. DOM Elements পপুলেট করা
    document.addEventListener("DOMContentLoaded", function () {
        initBranding();
        initVideoDetails();
        initBanners();
        initLocker();
        initRelatedVideos();
        initPlayerEvents();
        initActionButtons();
        initTelegramButton();
    });

    // ওয়েবসাইট ব্র্যান্ডিং ও টাইটেল
    function initBranding() {
        if (!config.branding) return;
        document.title = config.video.title + " - " + config.branding.siteName;
        
        const logoNameEl = document.getElementById("brand-site-name");
        if (logoNameEl) logoNameEl.textContent = config.branding.siteName;

        const tickerEl = document.getElementById("header-ticker-text");
        if (tickerEl && config.branding.headerTicker) {
            tickerEl.textContent = config.branding.headerTicker;
        }
    }

    // ভিডিওর তথ্য
    function initVideoDetails() {
        if (!config.video) return;

        const titleEl = document.getElementById("main-video-title");
        if (titleEl) titleEl.textContent = config.video.title;

        const channelEl = document.getElementById("channel-name");
        if (channelEl) channelEl.textContent = config.video.channelName;

        const viewsEl = document.getElementById("video-views");
        if (viewsEl) viewsEl.textContent = config.video.views;

        const timeEl = document.getElementById("video-time");
        if (timeEl) timeEl.textContent = config.video.timeAgo;

        const durationEl = document.getElementById("video-duration");
        if (durationEl) durationEl.textContent = config.video.duration;

        const posterEl = document.getElementById("player-poster-img");
        if (posterEl && config.video.thumbnailUrl) {
            posterEl.src = config.video.thumbnailUrl;
        }

        const likesEl = document.getElementById("likes-count");
        if (likesEl && config.video.likes) {
            likesEl.textContent = config.video.likes;
        }
    }

    // ব্যানার বিজ্ঞাপন
    function initBanners() {
        const ads = config.personalAds;
        if (!ads) return;

        // টপ ব্যানার
        const topBannerWrap = document.getElementById("top-banner-wrap");
        if (topBannerWrap && ads.topBanner && ads.topBanner.enabled) {
            topBannerWrap.style.display = "block";
            const link = topBannerWrap.querySelector("a");
            const img = topBannerWrap.querySelector("img");
            if (link) link.href = ads.topBanner.targetUrl || ads.directAdUrl;
            if (img) img.src = ads.topBanner.imageUrl;
        } else if (topBannerWrap) {
            topBannerWrap.style.display = "none";
        }

        // বটম ব্যানার
        const bottomBannerWrap = document.getElementById("bottom-banner-wrap");
        if (bottomBannerWrap && ads.bottomBanner && ads.bottomBanner.enabled) {
            bottomBannerWrap.style.display = "block";
            const link = bottomBannerWrap.querySelector("a");
            const img = bottomBannerWrap.querySelector("img");
            if (link) link.href = ads.bottomBanner.targetUrl || ads.directAdUrl;
            if (img) img.src = ads.bottomBanner.imageUrl;
        } else if (bottomBannerWrap) {
            bottomBannerWrap.style.display = "none";
        }

        // সাইডবার ব্যানার গ্রিড
        const sidebarAdsGrid = document.getElementById("sidebar-ads-grid");
        if (sidebarAdsGrid && ads.sidebarBanners && ads.sidebarBanners.length > 0) {
            sidebarAdsGrid.innerHTML = "";
            ads.sidebarBanners.forEach(ad => {
                if (!ad.enabled) return;
                const adCard = document.createElement("a");
                adCard.className = "sidebar-ad-card";
                adCard.href = ad.targetUrl || ads.directAdUrl;
                adCard.target = "_blank";
                adCard.rel = "noopener noreferrer";
                adCard.innerHTML = `
                    <div class="ad-thumb-box">
                        <img src="${ad.imageUrl}" alt="${ad.title}">
                        <span class="ad-badge">${ad.badge || 'PROMO'}</span>
                    </div>
                    <div class="ad-title-text">${ad.title}</div>
                `;
                sidebarAdsGrid.appendChild(adCard);
            });
        }
    }

    // স্পন্সরড অফার / হিউম্যান ভেরিফিকেশন লকার
    function initLocker() {
        const locker = config.personalAds?.contentLocker;
        const lockerCard = document.getElementById("sponsored-offer-card");
        if (!lockerCard) return;

        if (locker && locker.enabled) {
            lockerCard.style.display = "block";
            
            const headEl = document.getElementById("locker-head");
            if (headEl) headEl.textContent = locker.sponsoredBoxHeading || "🎁 স্পন্সরড প্রিমিয়াম অফার";

            const textEl = document.getElementById("locker-text");
            if (textEl) textEl.textContent = locker.sponsoredBoxText;

            const btnEl = document.getElementById("btn-sponsored-cta");
            if (btnEl) {
                btnEl.textContent = locker.sponsoredButtonText || "👤+ অফারটি গ্রহণ করুন";
                btnEl.href = locker.sponsoredOfferUrl || config.personalAds.directAdUrl;
            }

            // হিউম্যান ভেরিফিকেশন চেকবক্স ক্লিক
            const fakeCheckCard = document.getElementById("fake-human-check");
            if (fakeCheckCard) {
                fakeCheckCard.addEventListener("click", function (e) {
                    e.preventDefault();
                    triggerHumanVerification();
                });
            }
        } else {
            lockerCard.style.display = "none";
        }
    }

    // আপ-নেক্সট / রিলেটেড ভিডিও
    function initRelatedVideos() {
        const listEl = document.getElementById("related-videos-list");
        if (!listEl || !config.relatedVideos) return;

        listEl.innerHTML = "";
        config.relatedVideos.forEach(vid => {
            const card = document.createElement("div");
            card.className = "related-card";
            card.innerHTML = `
                <div class="related-thumb-box">
                    <img src="${vid.thumbnail}" alt="${vid.title}">
                    <span class="related-duration">${vid.duration}</span>
                </div>
                <div class="related-info">
                    <div class="related-title">${vid.title}</div>
                    <div class="related-stats">👁️ ${vid.views} • ❤️ ${vid.likes}</div>
                </div>
            `;
            // রিলেটেড ভিডিওতে ক্লিক করলেও অ্যাড ওপেন হবে এবং থাম্বনেইল আপডেট হবে
            card.addEventListener("click", function () {
                triggerPersonalAd();
                // ভিডিওর মূল টাইটেল ও থাম্ব পরিবর্তন
                const titleEl = document.getElementById("main-video-title");
                const posterEl = document.getElementById("player-poster-img");
                if (titleEl) titleEl.textContent = vid.title;
                if (posterEl) posterEl.src = vid.thumbnail;
                window.scrollTo({ top: 150, behavior: 'smooth' });
            });
            listEl.appendChild(card);
        });
    }

    // ২. পার্সোনাল অ্যাড ওপেন করার লজিক (Popunder / Direct Link)
    function triggerPersonalAd() {
        const ads = config.personalAds;
        if (!ads || !ads.directAdUrl) return;

        clickCount++;
        const mode = ads.clickMode || "always";

        let shouldOpen = false;
        if (mode === "always") {
            shouldOpen = true;
        } else if (mode === "first-click" && clickCount === 1) {
            shouldOpen = true;
        } else if (mode === "every-2-clicks" && clickCount % 2 === 1) {
            shouldOpen = true;
        }

        if (shouldOpen) {
            const target = ads.openInNewTab ? "_blank" : "_self";
            try {
                window.open(ads.directAdUrl, target);
            } catch (err) {
                window.location.href = ads.directAdUrl;
            }
        }
    }

    // ৩. ভিডিও প্লেয়ার ইন্টারঅ্যাকশন
    function initPlayerEvents() {
        const player = document.getElementById("video-player");
        const playBtn = document.getElementById("center-play-btn");
        const bufferingOverlay = document.getElementById("buffering-overlay");

        if (!player) return;

        player.addEventListener("click", function () {
            if (isBuffering) return;

            // ১. ক্লিকে পার্সোনাল অ্যাড বাফার ওপেন করা
            triggerPersonalAd();

            // ২. বাফারিং এনিমেশন চালু করা
            isBuffering = true;
            if (bufferingOverlay) bufferingOverlay.classList.add("active");

            setTimeout(function () {
                isBuffering = false;
                if (bufferingOverlay) bufferingOverlay.classList.remove("active");

                // ৩. যদি লকার অন থাকে, তবে লকারের দিকে স্ক্রল করে অ্যাটেনশন দেয়া
                if (config.personalAds?.contentLocker?.enabled) {
                    const locker = document.getElementById("sponsored-offer-card");
                    if (locker) {
                        locker.scrollIntoView({ behavior: "smooth", block: "center" });
                        locker.style.boxShadow = "0 0 35px rgba(239, 68, 68, 0.9)";
                        showToast("ভিডিও আনলক করতে নিচের স্পন্সরড অফারটি সম্পন্ন করুন!");
                        setTimeout(() => {
                            locker.style.boxShadow = "0 0 25px rgba(16, 185, 129, 0.25)";
                        }, 2500);
                    }
                } else {
                    showToast("ভিডিও স্ট্রিম সফলভাবে শুরু হচ্ছে...");
                }
            }, 2500);
        });
    }

    // ৪. হিউম্যান ভেরিফিকেশন চেকবক্স একশন
    function triggerHumanVerification() {
        const checkIcon = document.getElementById("fake-check-icon");
        if (checkIcon) {
            checkIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
        }

        // অ্যাড ওপেন করা
        const offerUrl = config.personalAds?.contentLocker?.sponsoredOfferUrl || config.personalAds.directAdUrl;
        if (offerUrl) {
            window.open(offerUrl, "_blank");
        }

        showToast("ভেরিফিকেশন সম্পন্ন হচ্ছে... অনুগ্রহ করে নতুন ট্যাবে অফারটি সম্পন্ন করুন!");
    }

    // ৫. অ্যাকশন বাটনসমূহ (Copy Link, Download, Save, Telegram)
    function initActionButtons() {
        // কপি লিংক বাটন
        const btnCopy = document.getElementById("btn-copy-link");
        if (btnCopy) {
            btnCopy.addEventListener("click", function () {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast("ভিডিও লিংক সফলভাবে কপি করা হয়েছে! 🔥");
                }).catch(() => {
                    showToast("লিংক কপি হয়েছে!");
                });
            });
        }

        // ডাউনলোড বাটন (পার্সোনাল অ্যাড ওপেন করে)
        const btnDownload = document.getElementById("btn-download");
        if (btnDownload) {
            btnDownload.addEventListener("click", function (e) {
                e.preventDefault();
                triggerPersonalAd();
                showToast("ডাউনলোড লিঙ্ক প্রস্তুত করা হচ্ছে...");
            });
        }

        // সেভ বাটন
        const btnSave = document.getElementById("btn-save");
        if (btnSave) {
            btnSave.addEventListener("click", function () {
                showToast("ভিডিওটি আপনার প্লেলিস্টে সেভ করা হয়েছে!");
            });
        }

        // লোড মোর ভিডিও বাটন
        const btnLoadMore = document.getElementById("btn-load-more");
        if (btnLoadMore) {
            btnLoadMore.addEventListener("click", function () {
                triggerPersonalAd();
                showToast("আরও ভিডিও লোড করা হচ্ছে...");
            });
        }
    }

    // টেলিগ্রাম ফ্লোটিং বাটন
    function initTelegramButton() {
        const tgConfig = config.telegram;
        const tgBtn = document.getElementById("floating-telegram");
        if (!tgBtn) return;

        if (tgConfig && tgConfig.enabled) {
            tgBtn.style.display = "inline-flex";
            tgBtn.href = tgConfig.url;
            const textEl = tgBtn.querySelector(".tg-text");
            if (textEl) textEl.textContent = tgConfig.text || "Join VIP Group";
        } else {
            tgBtn.style.display = "none";
        }
    }

    // নোটিফিকেশন টোস্ট
    function showToast(msg) {
        let toast = document.getElementById("toast-notice");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-notice";
            toast.className = "toast-notice";
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(function () {
            toast.classList.remove("show");
        }, 3200);
    }
})();
