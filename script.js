/**
 * ============================================================
 *  SMARTVIDEO LANDING PAGE INTERACTIVE CONTROLLER
 *  (High-Performance Adsterra & Full-Page Popunder Engine)
 * ============================================================
 */

(function () {
    let clickCount = 0;
    let isBuffering = false;

    // ১. কার্যকরী Adsterra বা পার্সোনাল লিঙ্ক ডায়নামিকালি বের করা
    function getEffectiveAdLink() {
        // ক. URL প্যারামিটার চেক (?ad=... অথবা ?direct=...)
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const queryAd = urlParams.get("ad") || urlParams.get("direct");
            if (queryAd && queryAd.trim()) return queryAd.trim();
        } catch (e) {}

        // খ. LocalStorage থেকে চেক (যদি অ্যাডমিন প্যানেল দিয়ে আপডেট করা থাকে)
        try {
            const saved = localStorage.getItem("SMARTVIDEO_CONFIG");
            if (saved) {
                const parsed = JSON.parse(saved);
                const link = parsed.adsterra?.directLink || parsed.personalAds?.directAdUrl;
                if (link && link.trim() && !link.includes("your-adsterra-direct-link") && !link.includes("your-personal-ad-link")) {
                    return link.trim();
                }
            }
        } catch (e) {}

        // গ. config.js এর ডিফল্ট কনফিগ চেক
        const cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
        const cfgLink = cfg.adsterra?.directLink || cfg.personalAds?.directAdUrl || "";
        if (cfgLink && cfgLink.trim()) {
            return cfgLink.trim();
        }

        return "https://www.google.com";
    }

    // ২. পপ-আপ ব্লকার বাইপাস করে ১০০% নিশ্চিতভাবে নতুন ট্যাবে অ্যাড ওপেন করা
    function openAdTab(targetUrl) {
        if (!targetUrl) return false;
        
        console.log("[Adsterra Engine] Opening Ad URL:", targetUrl);
        let opened = false;

        // পদ্ধতি ১: সরাসরি ব্রাউজার উইন্ডো ওপেন (ক্লিক ইভেন্টের মধ্যে সবচেয়ে দ্রুত)
        try {
            const win = window.open(targetUrl, "_blank");
            if (win && !win.closed && typeof win.closed !== "undefined") {
                opened = true;
                try { win.focus(); } catch (e) {}
            }
        } catch (err) {
            console.warn("window.open failed, trying synthetic anchor:", err);
        }

        // পদ্ধতি ২: যদি ব্রাউজারের পপ-আপ ব্লকার window.open আটকে দেয়, তবে ক্লিক ডিসপ্যাচ করা
        if (!opened) {
            try {
                const fakeLink = document.createElement("a");
                fakeLink.href = targetUrl;
                fakeLink.target = "_blank";
                fakeLink.rel = "noopener noreferrer";
                fakeLink.style.display = "none";
                document.body.appendChild(fakeLink);

                // মাউস ক্লিক ইভেন্ট সিমুলেট করা
                const clickEvt = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                fakeLink.dispatchEvent(clickEvt);

                setTimeout(() => {
                    if (fakeLink.parentNode) fakeLink.parentNode.removeChild(fakeLink);
                }, 100);
                opened = true;
            } catch (err2) {
                console.error("Synthetic click error, fallback to redirect:", err2);
                window.location.href = targetUrl;
            }
        }

        return opened;
    }

    // ৩. ডিরেক্ট অ্যাড ট্রিগার ফাংশন (ক্লিক কাউন্টার ও মোড হ্যান্ডলার)
    function triggerDirectAd(source) {
        const link = getEffectiveAdLink();
        if (!link) return;

        clickCount++;
        console.log(`[Adsterra] Click #${clickCount} from [${source}]`);

        // কনফিগ থেকে ক্লিক মোড চেক করা
        let cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
        try {
            const saved = localStorage.getItem("SMARTVIDEO_CONFIG");
            if (saved) cfg = JSON.parse(saved);
        } catch (e) {}

        const mode = cfg.personalAds?.clickMode || "always";
        let shouldOpen = false;

        if (mode === "always") {
            shouldOpen = true;
        } else if (mode === "first-click" && clickCount === 1) {
            shouldOpen = true;
        } else if (mode === "every-2-clicks" && clickCount % 2 === 1) {
            shouldOpen = true;
        }

        if (shouldOpen) {
            openAdTab(link);
        }
    }

    // ৪. DOM লোড হওয়ার পর সবকিছু ইনিশিয়ালাইজ করা
    document.addEventListener("DOMContentLoaded", function () {
        initBranding();
        initVideoDetails();
        initAdsterraScripts();
        initBanners();
        initLocker();
        initRelatedVideos();
        initPlayerEvents();
        initOutsideClickListener();
        initActionButtons();
    });

    // ৫. পেজের বাইরে বা যেকোনো জায়গায় ক্লিক করলে অ্যাড আসার লিসেনার (OUTSIDE CLICK HANDLER)
    function initOutsideClickListener() {
        document.addEventListener("click", function (e) {
            // যদি ব্যবহারকারী প্লেয়ার বা কোনো নির্দিষ্ট বাটনে ক্লিক করে, তবে সংশ্লিষ্ট হ্যান্ডলার তা দেখবে
            if (e.target.closest("#video-player") || 
                e.target.closest("#btn-download") || 
                e.target.closest("#btn-copy-link") || 
                e.target.closest("#btn-load-more") || 
                e.target.closest("#fake-human-check") || 
                e.target.closest("#btn-sponsored-cta") ||
                e.target.closest(".related-card")) {
                return; // আলাদা হ্যান্ডল করা আছে
            }

            // পেজের ফাঁকা জায়গা, ব্যাকগ্রাউন্ড, হেডার বা সাইডবারে ক্লিক করলে স্বয়ংক্রিয়ভাবে অ্যাড ওপেন হবে
            triggerDirectAd("outside-page-click");
        }, true); // Capture phase ব্যবহার করা হয়েছে যাতে কোনো কোড ক্লিক আটকাতে না পারে
    }

    // ৬. ভিডিও প্লেয়ার ও প্লে বাটন ক্লিক হ্যান্ডলার
    function initPlayerEvents() {
        const player = document.getElementById("video-player");
        const playBtn = document.getElementById("center-play-btn");
        const bufferingOverlay = document.getElementById("buffering-overlay");

        function handlePlayerClick(e) {
            // ১. সাথে সাথে ডিরেক্ট অ্যাড ওপেন করা
            triggerDirectAd("video-play-click");

            // ২. ভিডিও লোডিং / বাফারিং সিমুলেশন চালু
            if (!isBuffering) {
                isBuffering = true;
                if (bufferingOverlay) bufferingOverlay.classList.add("active");

                setTimeout(function () {
                    isBuffering = false;
                    if (bufferingOverlay) bufferingOverlay.classList.remove("active");

                    // যদি লকার অন থাকে, তবে লকারে ফোকাস দেওয়া
                    let cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
                    try {
                        const saved = localStorage.getItem("SMARTVIDEO_CONFIG");
                        if (saved) cfg = JSON.parse(saved);
                    } catch (e) {}

                    if (cfg.personalAds?.contentLocker?.enabled) {
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
                }, 2000);
            }
        }

        if (player) {
            player.addEventListener("click", handlePlayerClick);
        }
        if (playBtn) {
            playBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                handlePlayerClick(e);
            });
        }
    }

    // ৭. Adsterra Popunder ও Social Bar স্ক্রিপ্ট ইনজেকশন
    function initAdsterraScripts() {
        let cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
        try {
            const saved = localStorage.getItem("SMARTVIDEO_CONFIG");
            if (saved) cfg = JSON.parse(saved);
        } catch (e) {}

        const ads = cfg.adsterra;
        if (!ads) return;

        // Popunder Script
        if (ads.popunderScript && ads.popunderScript.trim()) {
            injectExecutableCode(document.head, ads.popunderScript);
        }

        // Social Bar Script
        if (ads.socialBarScript && ads.socialBarScript.trim()) {
            injectExecutableCode(document.body, ads.socialBarScript);
        }
    }

    // স্ক্রিপ্ট এক্সিকিউট করার জন্য পাওয়ারফুল হেল্পার
    function injectExecutableCode(targetContainer, rawCode) {
        if (!rawCode || !targetContainer) return;
        const trimmed = rawCode.trim();

        if (trimmed.startsWith("http") && !trimmed.includes("<")) {
            const s = document.createElement("script");
            s.src = trimmed;
            s.async = true;
            s.setAttribute("data-cfasync", "false");
            targetContainer.appendChild(s);
            return;
        }

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
            } else if (node.nodeType === 1) {
                targetContainer.appendChild(node.cloneNode(true));
            }
        });
    }

    // ৮. ওয়েবসাইট ব্র্যান্ডিং ও টাইটেল
    function initBranding() {
        let cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
        try {
            const saved = localStorage.getItem("SMARTVIDEO_CONFIG");
            if (saved) cfg = JSON.parse(saved);
        } catch (e) {}

        if (!cfg.branding) return;
        document.title = (cfg.video?.title || "Exclusive Video") + " - " + cfg.branding.siteName;

        const logoNameEl = document.getElementById("brand-site-name");
        if (logoNameEl) logoNameEl.textContent = cfg.branding.siteName;

        const tickerEl = document.getElementById("header-ticker-text");
        if (tickerEl && cfg.branding.headerTicker) {
            tickerEl.textContent = cfg.branding.headerTicker;
        }
    }

    // ৯. ভিডিওর তথ্য
    function initVideoDetails() {
        let cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
        try {
            const saved = localStorage.getItem("SMARTVIDEO_CONFIG");
            if (saved) cfg = JSON.parse(saved);
        } catch (e) {}

        if (!cfg.video) return;

        const titleEl = document.getElementById("main-video-title");
        if (titleEl) titleEl.textContent = cfg.video.title;

        const channelEl = document.getElementById("channel-name");
        if (channelEl) channelEl.textContent = cfg.video.channelName;

        const viewsEl = document.getElementById("video-views");
        if (viewsEl) viewsEl.textContent = cfg.video.views;

        const timeEl = document.getElementById("video-time");
        if (timeEl) timeEl.textContent = cfg.video.timeAgo;

        const durationEl = document.getElementById("video-duration");
        if (durationEl) durationEl.textContent = cfg.video.duration;

        const posterEl = document.getElementById("player-poster-img");
        if (posterEl && cfg.video.thumbnailUrl) {
            posterEl.src = cfg.video.thumbnailUrl;
        }

        const likesEl = document.getElementById("likes-count");
        if (likesEl && cfg.video.likes) {
            likesEl.textContent = cfg.video.likes;
        }
    }

    // ১০. ব্যানার বিজ্ঞাপন
    function initBanners() {
        let cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
        try {
            const saved = localStorage.getItem("SMARTVIDEO_CONFIG");
            if (saved) cfg = JSON.parse(saved);
        } catch (e) {}

        const activeLink = getEffectiveAdLink();

        // টপ ব্যানার স্লট
        const topBannerWrap = document.getElementById("top-banner-wrap");
        if (topBannerWrap) {
            if (cfg.adsterra?.topBannerCode && cfg.adsterra.topBannerCode.trim()) {
                topBannerWrap.style.display = "block";
                topBannerWrap.innerHTML = "";
                injectExecutableCode(topBannerWrap, cfg.adsterra.topBannerCode);
            } else if (cfg.personalAds?.topBanner?.enabled) {
                topBannerWrap.style.display = "block";
                const pBanner = cfg.personalAds.topBanner;
                topBannerWrap.innerHTML = `
                    <a href="${pBanner.targetUrl || activeLink}" target="_blank" rel="noopener noreferrer">
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
            if (cfg.adsterra?.bottomBannerCode && cfg.adsterra.bottomBannerCode.trim()) {
                bottomBannerWrap.style.display = "block";
                bottomBannerWrap.innerHTML = "";
                injectExecutableCode(bottomBannerWrap, cfg.adsterra.bottomBannerCode);
            } else if (cfg.personalAds?.bottomBanner?.enabled) {
                bottomBannerWrap.style.display = "block";
                const bBanner = cfg.personalAds.bottomBanner;
                bottomBannerWrap.innerHTML = `
                    <a href="${bBanner.targetUrl || activeLink}" target="_blank" rel="noopener noreferrer">
                        <img src="${bBanner.imageUrl}" alt="${bBanner.altText || 'Exclusive Promo'}">
                    </a>
                `;
            } else {
                bottomBannerWrap.style.display = "none";
            }
        }

        // Adsterra Native Banner স্লট
        const nativeSlot = document.getElementById("adsterra-native-slot");
        if (nativeSlot) {
            if (cfg.adsterra?.nativeBannerCode && cfg.adsterra.nativeBannerCode.trim()) {
                nativeSlot.style.display = "block";
                nativeSlot.innerHTML = "";
                injectExecutableCode(nativeSlot, cfg.adsterra.nativeBannerCode);
            } else {
                nativeSlot.style.display = "none";
            }
        }

        // সাইডবার ব্যানার স্লট
        const sidebarAdsGrid = document.getElementById("sidebar-ads-grid");
        if (sidebarAdsGrid) {
            if (cfg.adsterra?.sidebarBannerCode && cfg.adsterra.sidebarBannerCode.trim()) {
                sidebarAdsGrid.innerHTML = "";
                injectExecutableCode(sidebarAdsGrid, cfg.adsterra.sidebarBannerCode);
            } else if (cfg.personalAds?.sidebarBanners && cfg.personalAds.sidebarBanners.length > 0) {
                sidebarAdsGrid.innerHTML = "";
                cfg.personalAds.sidebarBanners.forEach(ad => {
                    if (!ad.enabled) return;
                    const adCard = document.createElement("a");
                    adCard.className = "sidebar-ad-card";
                    adCard.href = ad.targetUrl || activeLink;
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

    // ১১. স্পন্সরড অফার / হিউম্যান ভেরিফিকেশন লকার
    function initLocker() {
        let cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
        try {
            const saved = localStorage.getItem("SMARTVIDEO_CONFIG");
            if (saved) cfg = JSON.parse(saved);
        } catch (e) {}

        const activeLink = getEffectiveAdLink();
        const locker = cfg.personalAds?.contentLocker;
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
                btnEl.href = locker.sponsoredOfferUrl || activeLink;
                btnEl.addEventListener("click", function(e) {
                    e.preventDefault();
                    openAdTab(locker.sponsoredOfferUrl || activeLink);
                });
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

    // ১২. আপ-নেক্সট / রিলেটেড ভিডিও
    function initRelatedVideos() {
        let cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
        try {
            const saved = localStorage.getItem("SMARTVIDEO_CONFIG");
            if (saved) cfg = JSON.parse(saved);
        } catch (e) {}

        const listEl = document.getElementById("related-videos-list");
        if (!listEl || !cfg.relatedVideos) return;

        listEl.innerHTML = "";
        cfg.relatedVideos.forEach(vid => {
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
                triggerDirectAd("related-video-click");
                const titleEl = document.getElementById("main-video-title");
                const posterEl = document.getElementById("player-poster-img");
                if (titleEl) titleEl.textContent = vid.title;
                if (posterEl) posterEl.src = vid.thumbnail;
                window.scrollTo({ top: 150, behavior: 'smooth' });
            });
            listEl.appendChild(card);
        });
    }

    // ১৩. হিউম্যান ভেরিফিকেশন চেকবক্স একশন
    function triggerHumanVerification() {
        const checkIcon = document.getElementById("fake-check-icon");
        if (checkIcon) {
            checkIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
        }

        const activeLink = getEffectiveAdLink();
        openAdTab(activeLink);

        showToast("ভেরিফিকেশন সম্পন্ন হচ্ছে... অনুগ্রহ করে নতুন ট্যাবের অফারটি দেখুন!");
    }

    // ১৪. অ্যাকশন বাটনসমূহ (Copy Link, Download, Save, Load More)
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
                triggerDirectAd("download-btn-click");
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
                triggerDirectAd("load-more-btn-click");
                showToast("আরও ভিডিও লোড করা হচ্ছে...");
            });
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
