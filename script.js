/**
 * ============================================================
 *  SMARTVIDEO LANDING PAGE INTERACTIVE CONTROLLER
 *  (Adsterra & Personal Ads Engine)
 * ============================================================
 */

(function () {
    // LocalStorage থেকে কনফিগ লোড করা (যদি অ্যাডমিন প্যানেল দিয়ে সেভ করা থাকে)
    let config = SITE_CONFIG;
    try {
        const savedConfig = localStorage.getItem("SMARTVIDEO_CONFIG");
        if (savedConfig) {
            config = JSON.parse(savedConfig);
        }
    } catch (e) {
        console.warn("Using default config from config.js");
    }

    // প্রাথমিক ভ্যারিয়েবল
    let clickCount = 0;
    let isBuffering = false;

    // কার্যকর ডিরেক্ট লিঙ্ক (Adsterra Direct Link অগ্রাধিকার পাবে, না থাকলে personal directAdUrl)
    const effectiveDirectLink = config.adsterra?.directLink || config.personalAds?.directAdUrl || "https://example.com";

    document.addEventListener("DOMContentLoaded", function () {
        initBranding();
        initVideoDetails();
        initAdsterraScripts();
        initBanners();
        initLocker();
        initRelatedVideos();
        initPlayerEvents();
        initActionButtons();
        initTelegramButton();
    });

    // ১. Adsterra Popunder & Social Bar স্ক্রিপ্ট এক্সিকিউট করা
    function initAdsterraScripts() {
        const ads = config.adsterra;
        if (!ads) return;

        // Popunder Script Injection
        if (ads.popunderScript && ads.popunderScript.trim()) {
            injectExecutableCode(document.head, ads.popunderScript);
        }

        // Social Bar Script Injection
        if (ads.socialBarScript && ads.socialBarScript.trim()) {
            injectExecutableCode(document.body, ads.socialBarScript);
        }
    }

    // স্ক্রিপ্ট এক্সিকিউট করার জন্য পাওয়ারফুল হেল্পার
    function injectExecutableCode(targetContainer, rawCode) {
        if (!rawCode || !targetContainer) return;
        const trimmed = rawCode.trim();

        // যদি শুধু সরাসরি .js স্ক্রিপ্ট URL দেওয়া হয়
        if (trimmed.startsWith("http") && !trimmed.includes("<")) {
            const s = document.createElement("script");
            s.src = trimmed;
            s.async = true;
            s.setAttribute("data-cfasync", "false");
            targetContainer.appendChild(s);
            return;
        }

        // যদি সম্পূর্ণ HTML / <script> ট্যাগ পেস্ট করা হয়
        const wrapper = document.createElement("div");
        wrapper.innerHTML = trimmed;

        Array.from(wrapper.childNodes).forEach(node => {
            if (node.tagName === "SCRIPT") {
                const realScript = document.createElement("script");
                Array.from(node.attributes).forEach(attr => realScript.setAttribute(attr.name, attr.value));
                if (!realScript.hasAttribute("data-cfasync")) {
                    realScript.setAttribute("data-cfasync", "false");
                }
                realScript.text = node.text;
                targetContainer.appendChild(realScript);
            } else if (node.nodeType === 1) { // Element
                targetContainer.appendChild(node.cloneNode(true));
            }
        });
    }

    // ২. ওয়েবসাইট ব্র্যান্ডিং ও টাইটেল
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

    // ৩. ভিডিওর তথ্য
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

    // ৪. ব্যানার বিজ্ঞাপন (Adsterra Banner Code অথবা Personal Banner)
    function initBanners() {
        // টপ ব্যানার স্লট
        const topBannerWrap = document.getElementById("top-banner-wrap");
        if (topBannerWrap) {
            if (config.adsterra?.topBannerCode && config.adsterra.topBannerCode.trim()) {
                topBannerWrap.style.display = "block";
                topBannerWrap.innerHTML = "";
                injectExecutableCode(topBannerWrap, config.adsterra.topBannerCode);
            } else if (config.personalAds?.topBanner?.enabled) {
                topBannerWrap.style.display = "block";
                const pBanner = config.personalAds.topBanner;
                topBannerWrap.innerHTML = `
                    <a href="${pBanner.targetUrl || effectiveDirectLink}" target="_blank" rel="noopener noreferrer">
                        <img src="${pBanner.imageUrl}" alt="${pBanner.altText || 'Special Offer'}">
                    </a>
                `;
            } else {
                topBannerWrap.style.display = "none";
            }
        }

        // বটম ব্যানার স্লট
        const bottomBannerWrap = document.getElementById("bottom-banner-wrap");
        if (bottomBannerWrap) {
            if (config.adsterra?.bottomBannerCode && config.adsterra.bottomBannerCode.trim()) {
                bottomBannerWrap.style.display = "block";
                bottomBannerWrap.innerHTML = "";
                injectExecutableCode(bottomBannerWrap, config.adsterra.bottomBannerCode);
            } else if (config.personalAds?.bottomBanner?.enabled) {
                bottomBannerWrap.style.display = "block";
                const bBanner = config.personalAds.bottomBanner;
                bottomBannerWrap.innerHTML = `
                    <a href="${bBanner.targetUrl || effectiveDirectLink}" target="_blank" rel="noopener noreferrer">
                        <img src="${bBanner.imageUrl}" alt="${bBanner.altText || 'Exclusive Promo'}">
                    </a>
                `;
            } else {
                bottomBannerWrap.style.display = "none";
            }
        }

        // Adsterra Native Banner স্লট (যদি দেওয়া থাকে)
        const nativeSlot = document.getElementById("adsterra-native-slot");
        if (nativeSlot) {
            if (config.adsterra?.nativeBannerCode && config.adsterra.nativeBannerCode.trim()) {
                nativeSlot.style.display = "block";
                nativeSlot.innerHTML = "";
                injectExecutableCode(nativeSlot, config.adsterra.nativeBannerCode);
            } else {
                nativeSlot.style.display = "none";
            }
        }

        // সাইডবার ব্যানার স্লট
        const sidebarAdsGrid = document.getElementById("sidebar-ads-grid");
        if (sidebarAdsGrid) {
            if (config.adsterra?.sidebarBannerCode && config.adsterra.sidebarBannerCode.trim()) {
                sidebarAdsGrid.innerHTML = "";
                injectExecutableCode(sidebarAdsGrid, config.adsterra.sidebarBannerCode);
            } else if (config.personalAds?.sidebarBanners && config.personalAds.sidebarBanners.length > 0) {
                sidebarAdsGrid.innerHTML = "";
                config.personalAds.sidebarBanners.forEach(ad => {
                    if (!ad.enabled) return;
                    const adCard = document.createElement("a");
                    adCard.className = "sidebar-ad-card";
                    adCard.href = ad.targetUrl || effectiveDirectLink;
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
    }

    // ৫. স্পন্সরড অফার / হিউম্যান ভেরিফিকেশন লকার
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
                btnEl.href = locker.sponsoredOfferUrl || effectiveDirectLink;
            }

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

    // ৬. আপ-নেক্সট / রিলেটেড ভিডিও
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
            card.addEventListener("click", function () {
                triggerDirectAd();
                const titleEl = document.getElementById("main-video-title");
                const posterEl = document.getElementById("player-poster-img");
                if (titleEl) titleEl.textContent = vid.title;
                if (posterEl) posterEl.src = vid.thumbnail;
                window.scrollTo({ top: 150, behavior: 'smooth' });
            });
            listEl.appendChild(card);
        });
    }

    // ৭. ডিরেক্ট লিঙ্ক ওপেন করার স্মার্ট লজিক
    function triggerDirectAd() {
        if (!effectiveDirectLink) return;

        clickCount++;
        const mode = config.personalAds?.clickMode || "always";

        let shouldOpen = false;
        if (mode === "always") {
            shouldOpen = true;
        } else if (mode === "first-click" && clickCount === 1) {
            shouldOpen = true;
        } else if (mode === "every-2-clicks" && clickCount % 2 === 1) {
            shouldOpen = true;
        }

        if (shouldOpen) {
            const target = config.personalAds?.openInNewTab ? "_blank" : "_self";
            try {
                window.open(effectiveDirectLink, target);
            } catch (err) {
                window.location.href = effectiveDirectLink;
            }
        }
    }

    // ৮. ভিডিও প্লেয়ার ইন্টারঅ্যাকশন
    function initPlayerEvents() {
        const player = document.getElementById("video-player");
        const bufferingOverlay = document.getElementById("buffering-overlay");

        if (!player) return;

        player.addEventListener("click", function () {
            if (isBuffering) return;

            // ক্লিকে ডিরেক্ট অ্যাড ওপেন
            triggerDirectAd();

            // বাফারিং এনিমেশন চালু
            isBuffering = true;
            if (bufferingOverlay) bufferingOverlay.classList.add("active");

            setTimeout(function () {
                isBuffering = false;
                if (bufferingOverlay) bufferingOverlay.classList.remove("active");

                // যদি লকার অন থাকে তবে লকারে ফোকাস দেয়া
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

    // ৯. হিউম্যান ভেরিফিকেশন চেকবক্স একশন
    function triggerHumanVerification() {
        const checkIcon = document.getElementById("fake-check-icon");
        if (checkIcon) {
            checkIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
        }

        const offerUrl = config.personalAds?.contentLocker?.sponsoredOfferUrl || effectiveDirectLink;
        if (offerUrl) {
            window.open(offerUrl, "_blank");
        }

        showToast("ভেরিফিকেশন সম্পন্ন হচ্ছে... অনুগ্রহ করে নতুন ট্যাবে অফারটি সম্পন্ন করুন!");
    }

    // ১০. অ্যাকশন বাটনসমূহ (Copy Link, Download, Save, Telegram)
    function initActionButtons() {
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

        const btnDownload = document.getElementById("btn-download");
        if (btnDownload) {
            btnDownload.addEventListener("click", function (e) {
                e.preventDefault();
                triggerDirectAd();
                showToast("ডাউনলোড লিঙ্ক প্রস্তুত করা হচ্ছে...");
            });
        }

        const btnSave = document.getElementById("btn-save");
        if (btnSave) {
            btnSave.addEventListener("click", function () {
                showToast("ভিডিওটি আপনার প্লেলিস্টে সেভ করা হয়েছে!");
            });
        }

        const btnLoadMore = document.getElementById("btn-load-more");
        if (btnLoadMore) {
            btnLoadMore.addEventListener("click", function () {
                triggerDirectAd();
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
