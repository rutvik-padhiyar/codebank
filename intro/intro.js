/*
    REUSABLE INTRO ENGINE
    ---------------------------------------------------------
    REQUIRED HTML IDs for this script:
    - #intro (full screen intro wrapper)
    - #introLogo (logo shown in intro)
    - #introBrand (brand text shown in intro)
    - #introSkip (optional skip button)
    - #headerLogo (final logo in header, used by intro 1)
    - #siteContent (main content wrapper, remove class content-hidden on end)

    REQUIRED SCRIPT ORDER IN HTML:
    1) intro.css
    2) gsap CDN link
    3) intro.js

    INTRO SWITCH METHOD:
    - Go to function startSelectedIntro()
    - Keep one `return introX...` active
    - Keep all other intro lines commented

    One-time behavior key:
    - localStorage key: codebank_intro_seen_v1
    - Reset test: localStorage.removeItem('codebank_intro_seen_v1')
    - Fast test mode: set forcePreviewEveryLoad: true
*/
(function() {
    const config = {
        storageKey: "codebank_intro_seen_v1",
        showOnlyOnce: true,
        forcePreviewEveryLoad: false,
        landingSelector: 'body[data-landing="true"]',
        allowSkip: true,
        minimumVisibleMs: 1200
    };

    const state = {
        startedAt: 0,
        isEnding: false
    };

    function hasGsap() {
        return typeof window.gsap !== "undefined";
    }

    function isLandingPage() {
        return !!document.querySelector(config.landingSelector);
    }

    function shouldShowIntro() {
        if (config.forcePreviewEveryLoad) {
            return true;
        }

        if (!isLandingPage()) {
            return false;
        }

        if (!config.showOnlyOnce) {
            return true;
        }

        return !window.localStorage.getItem(config.storageKey);
    }

    function markIntroSeen() {
        window.localStorage.setItem(config.storageKey, "1");
    }

    function qs(id) {
        return document.getElementById(id);
    }

    function waitRemainingTime(callback) {
        const elapsed = Date.now() - state.startedAt;
        const remaining = Math.max(0, config.minimumVisibleMs - elapsed);
        window.setTimeout(callback, remaining);
    }

    function revealSite() {
        const intro = qs("intro");
        const content = qs("siteContent");

        if (intro) {
            intro.style.display = "none";
            intro.setAttribute("aria-hidden", "true");
        }

        if (content) {
            content.classList.remove("content-hidden");
        }
    }

    function endIntro() {
        if (state.isEnding) {
            return;
        }

        state.isEnding = true;

        waitRemainingTime(function() {
            const intro = qs("intro");

            if (!intro) {
                revealSite();
                markIntroSeen();
                return;
            }

            if (hasGsap()) {
                window.gsap.to(intro, {
                    opacity: 0,
                    duration: 0.45,
                    ease: "power2.out",
                    onComplete: function() {
                        revealSite();
                        markIntroSeen();
                    }
                });
            } else {
                intro.style.opacity = "0";
                window.setTimeout(function() {
                    revealSite();
                    markIntroSeen();
                }, 400);
            }
        });
    }

    function getHeaderLogoCenter() {
        const intro = qs("intro");
        const introLogo = qs("introLogo");
        const headerLogo = qs("headerLogo");

        if (!intro || !introLogo || !headerLogo) {
            return { x: 0, y: 0, scale: 0.5 };
        }

        const introRect = intro.getBoundingClientRect();
        const introLogoRect = introLogo.getBoundingClientRect();
        const headerRect = headerLogo.getBoundingClientRect();

        const introCenterX = introLogoRect.left + introLogoRect.width / 2;
        const introCenterY = introLogoRect.top + introLogoRect.height / 2;
        const headerCenterX = headerRect.left + headerRect.width / 2;
        const headerCenterY = headerRect.top + headerRect.height / 2;

        return {
            x: headerCenterX - introCenterX,
            y: headerCenterY - introCenterY,
            scale: headerRect.width / introLogoRect.width
        };
    }

    /* ===================== INTRO 1 START =====================
        Name: intro1LogoToHeader
        Effect: Center logo moves to header logo position.
        Copy: This full function can be copied to any project.
    ========================================================= */
    function intro1LogoToHeader() {
        const logo = qs("introLogo");
        const brand = qs("introBrand");
        const target = getHeaderLogoCenter();

        if (!logo || !brand) {
            endIntro();
            return;
        }

        if (!hasGsap()) {
            logo.style.transform = "scale(0.55) translate(-35vw, -32vh)";
            brand.style.opacity = "0";
            window.setTimeout(endIntro, 850);
            return;
        }

        const tl = window.gsap.timeline();
        tl.fromTo(
            logo, { scale: 0.2, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: "back.out(1.8)" }
        );
        tl.to(brand, { opacity: 0.2, y: -10, duration: 0.3 }, "<");
        tl.to(logo, {
            x: target.x,
            y: target.y,
            scale: target.scale,
            duration: 0.95,
            ease: "power2.inOut"
        });
        tl.to([logo, brand], { opacity: 0, duration: 0.25, onComplete: endIntro });
    }
    /* ====================== INTRO 1 END ====================== */

    /* ===================== INTRO 2 START =====================
        Name: intro2FadeZoom
        Effect: Logo fades in with zoom + blur clear.
        Copy: This full function can be copied to any project.
    ========================================================= */
    function intro2FadeZoom() {
        const logo = qs("introLogo");
        const brand = qs("introBrand");

        if (!logo || !brand) {
            endIntro();
            return;
        }

        if (!hasGsap()) {
            logo.style.opacity = "1";
            logo.style.transform = "scale(1)";
            window.setTimeout(endIntro, 850);
            return;
        }

        const tl = window.gsap.timeline();
        tl.fromTo(logo, { opacity: 0, scale: 1.9, filter: "blur(10px)" }, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out"
        });
        tl.fromTo(brand, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 }, "<0.15");
        tl.to([logo, brand], { opacity: 0, duration: 0.28, delay: 0.2, onComplete: endIntro });
    }
    /* ====================== INTRO 2 END ====================== */

    /* ===================== INTRO 3 START =====================
        Name: intro3SplitReveal
        Effect: Brand appears, then intro screen reveals upward.
        Copy: This full function can be copied to any project.
    ========================================================= */
    function intro3SplitReveal() {
        const intro = qs("intro");
        const brand = qs("introBrand");

        if (!intro || !brand) {
            endIntro();
            return;
        }

        if (!hasGsap()) {
            intro.style.clipPath = "inset(0 0 100% 0)";
            window.setTimeout(endIntro, 900);
            return;
        }

        const tl = window.gsap.timeline();
        tl.fromTo(brand, { opacity: 0, letterSpacing: "0.6em" }, {
            opacity: 1,
            letterSpacing: "0.08em",
            duration: 0.7
        });
        tl.to(intro, {
            clipPath: "inset(0 0 100% 0)",
            duration: 1,
            ease: "power4.inOut",
            onComplete: endIntro
        });
    }
    /* ====================== INTRO 3 END ====================== */

    /* ===================== INTRO 4 START =====================
        Name: intro4TypingBrand
        Effect: Types brand text letter by letter.
        Copy: This full function can be copied to any project.
    ========================================================= */
    function intro4TypingBrand() {
        const logo = qs("introLogo");
        const brand = qs("introBrand");
        const word = "CodeBank";

        if (!brand) {
            endIntro();
            return;
        }

        if (logo) {
            logo.style.opacity = "0";
        }

        brand.textContent = "";
        let i = 0;
        const timer = window.setInterval(function() {
            brand.textContent += word[i];
            i += 1;
            if (i >= word.length) {
                window.clearInterval(timer);
                window.setTimeout(endIntro, 380);
            }
        }, 120);
    }
    /* ====================== INTRO 4 END ====================== */

    /* ===================== INTRO 5 START =====================
        Name: intro5LoaderSpin
        Effect: Logo spins like a loader and exits.
        Copy: This full function can be copied to any project.
    ========================================================= */
    function intro5LoaderSpin() {
        const logo = qs("introLogo");
        const brand = qs("introBrand");

        if (!logo) {
            endIntro();
            return;
        }

        logo.style.border = "3px solid rgba(255, 255, 255, 0.45)";

        if (!hasGsap()) {
            logo.style.transform = "rotate(360deg)";
            window.setTimeout(endIntro, 900);
            return;
        }

        const tl = window.gsap.timeline();
        tl.to(logo, {
            rotate: 360,
            duration: 0.95,
            ease: "power1.inOut"
        });
        tl.to(brand, { opacity: 0.65, y: -4, duration: 0.2 }, "<0.35");
        tl.to([logo, brand], { opacity: 0, duration: 0.25, onComplete: endIntro });
    }
    /* ====================== INTRO 5 END ====================== */

    /* ===================== INTRO 6 START =====================
        Name: intro6BlurToSharp
        Effect: Logo goes from blur to sharp then exits.
        Copy: This full function can be copied to any project.
    ========================================================= */
    function intro6BlurToSharp() {
        const logo = qs("introLogo");
        const brand = qs("introBrand");

        if (!logo || !brand) {
            endIntro();
            return;
        }

        if (!hasGsap()) {
            logo.style.filter = "blur(0px)";
            window.setTimeout(endIntro, 800);
            return;
        }

        const tl = window.gsap.timeline();
        tl.fromTo(logo, { filter: "blur(20px)", scale: 1.08, opacity: 0.2 }, {
            filter: "blur(0px)",
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out"
        });
        tl.fromTo(brand, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "<0.2");
        tl.to([logo, brand], { opacity: 0, duration: 0.22, delay: 0.2, onComplete: endIntro });
    }
    /* ====================== INTRO 6 END ====================== */

    function startSelectedIntro() {
        /*
          CHOOSE INTRO HERE (single place control)
          -------------------------------------------------
          Rule: Keep ONLY one line active, comment all others.
          Example: If you want Intro 5, uncomment intro5LoaderSpin();
        */

        // return intro1LogoToHeader();
        // return intro2FadeZoom();
        // return intro3SplitReveal();
        return intro4TypingBrand();
        // return intro5LoaderSpin();
        // return intro6BlurToSharp();
    }

    function attachSkip() {
        const skip = qs("introSkip");
        if (!skip) {
            return;
        }

        if (!config.allowSkip) {
            skip.style.display = "none";
            return;
        }

        skip.addEventListener("click", endIntro);
    }

    function setupWithoutIntro() {
        const intro = qs("intro");
        if (intro) {
            intro.style.display = "none";
        }
        revealSite();
    }

    window.addEventListener("load", function() {
        if (!shouldShowIntro()) {
            setupWithoutIntro();
            return;
        }

        state.startedAt = Date.now();
        attachSkip();
        startSelectedIntro();
    });

    // Expose minimal API for quick testing from browser console.
    window.IntroEngine = {
        replay: function replay() {
            window.localStorage.removeItem(config.storageKey);
            window.location.reload();
        },
        clearSeenState: function clearSeenState() {
            window.localStorage.removeItem(config.storageKey);
        }
    };
})();