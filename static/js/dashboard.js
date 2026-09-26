/* CAREER COMPASS — DASHBOARD */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* DASHBOARD INITIALIZATION */

    const dashboard =
        document.querySelector(".dashboard-page");

    if (!dashboard) {
        return;
    }


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* SCROLL REVEAL */

    const revealElements =
        document.querySelectorAll(".reveal");


    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        revealElements.forEach(function (element) {

            element.classList.add("is-visible");

        });

    } else {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        const element =
                            entry.target;


                        const delay =
                            element.dataset.delay;


                        if (delay) {

                            element.style.setProperty(
                                "--delay",
                                `${delay}ms`
                            );

                        }


                        element.classList.add(
                            "is-visible"
                        );


                        observer.unobserve(
                            element
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -45px 0px"
                }
            );


        revealElements.forEach(function (element) {

            revealObserver.observe(
                element
            );

        });

    }


    /* SCROLL PROGRESS */

    const scrollProgress =
        document.getElementById(
            "dashboardScrollProgress"
        );


    function updateScrollProgress() {

        if (!scrollProgress) {
            return;
        }


        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;


        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;


        if (documentHeight <= 0) {

            scrollProgress.style.width =
                "0%";

            return;

        }


        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    (scrollTop / documentHeight) * 100
                )
            );


        scrollProgress.style.width =
            `${percentage}%`;

    }


    window.addEventListener(
        "scroll",
        updateScrollProgress,
        {
            passive: true
        }
    );


    updateScrollProgress();


    /* COUNTER ANIMATION */

    const counters =
        document.querySelectorAll(
            "[data-count]"
        );


    function animateCounter(element) {

        const target =
            parseInt(
                element.dataset.count,
                10
            );


        if (Number.isNaN(target)) {
            return;
        }


        if (prefersReducedMotion) {

            element.textContent =
                target.toLocaleString();

            return;

        }


        const duration = 1100;

        const startTime =
            performance.now();


        function updateCounter(currentTime) {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const current =
                Math.floor(
                    eased * target
                );


            element.textContent =
                current.toLocaleString();


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                element.textContent =
                    target.toLocaleString();

            }

        }


        requestAnimationFrame(
            updateCounter
        );

    }


    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        animateCounter(
                            entry.target
                        );


                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.5
                }
            );


        counters.forEach(function (counter) {

            counterObserver.observe(
                counter
            );

        });

    } else {

        counters.forEach(
            animateCounter
        );

    }


    /* PROGRESS BAR ANIMATION */

    const progressBars =
        document.querySelectorAll(
            "[data-progress]"
        );


    function animateProgressBar(element) {

        let progress =
            parseFloat(
                element.dataset.progress
            );


        if (Number.isNaN(progress)) {
            progress = 0;
        }


        progress =
            Math.max(
                0,
                Math.min(
                    100,
                    progress
                )
            );


        if (prefersReducedMotion) {

            element.style.width =
                `${progress}%`;

            return;

        }


        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                element.style.width =
                    `${progress}%`;

            });

        });

    }


    if (
        progressBars.length &&
        "IntersectionObserver" in window
    ) {

        const progressObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        animateProgressBar(
                            entry.target
                        );


                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.25
                }
            );


        progressBars.forEach(function (bar) {

            progressObserver.observe(
                bar
            );

        });

    } else {

        progressBars.forEach(
            animateProgressBar
        );

    }


    /* HERO CURSOR GLOW */

    const hero =
        document.querySelector(
            ".dashboard-hero"
        );


    const heroGlow =
        document.querySelector(
            ".hero-cursor-glow"
        );


    if (
        hero &&
        heroGlow &&
        !prefersReducedMotion &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        hero.addEventListener(
            "pointermove",
            function (event) {

                const rect =
                    hero.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                hero.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );


                hero.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );

            }
        );


        hero.addEventListener(
            "pointerleave",
            function () {

                hero.style.setProperty(
                    "--mouse-x",
                    "55%"
                );


                hero.style.setProperty(
                    "--mouse-y",
                    "50%"
                );

            }
        );

    }


    /* PREMIUM CARD TILT */

    const tiltCards =
        document.querySelectorAll(
            ".interactive-card"
        );


    if (
        !prefersReducedMotion &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        tiltCards.forEach(function (card) {

            card.addEventListener(
                "pointermove",
                function (event) {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX -
                        rect.left;


                    const y =
                        event.clientY -
                        rect.top;


                    const centerX =
                        rect.width / 2;


                    const centerY =
                        rect.height / 2;


                    if (
                        centerX <= 0 ||
                        centerY <= 0
                    ) {
                        return;
                    }


                    const rotateX =
                        ((y - centerY) /
                            centerY) *
                        -2.2;


                    const rotateY =
                        ((x - centerX) /
                            centerX) *
                        2.2;


                    card.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-3px)`;

                }
            );


            card.addEventListener(
                "pointerleave",
                function () {

                    card.style.transform =
                        "";

                }
            );

        });

    }


    /* PROFILE VISUAL — POINTER EFFECT */

    const profileVisual =
        document.querySelector(
            ".profile-hero-visual"
        );


    if (
        profileVisual &&
        !prefersReducedMotion &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        profileVisual.addEventListener(
            "pointermove",
            function (event) {

                const rect =
                    profileVisual.getBoundingClientRect();


                if (
                    rect.width <= 0 ||
                    rect.height <= 0
                ) {
                    return;
                }


                const x =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width;


                const y =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height;


                const moveX =
                    (x - 0.5) * 10;


                const moveY =
                    (y - 0.5) * 10;


                profileVisual.style.setProperty(
                    "--profile-move-x",
                    `${moveX}px`
                );


                profileVisual.style.setProperty(
                    "--profile-move-y",
                    `${moveY}px`
                );

            }
        );


        profileVisual.addEventListener(
            "pointerleave",
            function () {

                profileVisual.style.setProperty(
                    "--profile-move-x",
                    "0px"
                );


                profileVisual.style.setProperty(
                    "--profile-move-y",
                    "0px"
                );

            }
        );

    }


    /* PROFILE IMAGE */

    const profileImage =
        document.querySelector(
            ".dashboard-profile-image"
        );


    const profileFrame =
        document.querySelector(
            ".profile-image-frame"
        );


    const profileFallback =
        profileFrame
            ? profileFrame.querySelector(
                ".dashboard-profile-fallback"
            )
            : null;


    function showProfileFallback() {

        if (!profileFrame) {
            return;
        }


        const image =
            profileFrame.querySelector(
                ".dashboard-profile-image"
            );


        if (image) {

            image.style.display =
                "none";

        }


        const fallback =
            profileFrame.querySelector(
                ".dashboard-profile-fallback"
            );


        if (fallback) {

            fallback.style.display =
                "grid";

            return;

        }


        const newFallback =
            document.createElement(
                "div"
            );


        newFallback.className =
            "dashboard-profile-fallback";


        const username =
            dashboard.dataset.username ||
            "U";


        newFallback.textContent =
            username
                .trim()
                .charAt(0)
                .toUpperCase();


        profileFrame.appendChild(
            newFallback
        );

    }


    if (profileImage) {

        profileImage.style.opacity =
            "0";


        profileImage.addEventListener(
            "load",
            function () {

                profileImage.style.opacity =
                    "1";


                profileImage.classList.add(
                    "profile-image-loaded"
                );


                if (profileFallback) {

                    profileFallback.style.display =
                        "none";

                }

            }
        );


        profileImage.addEventListener(
            "error",
            function () {

                showProfileFallback();

            }
        );


        /* Handle cached images */

        if (profileImage.complete) {

            if (
                profileImage.naturalWidth > 0
            ) {

                profileImage.style.opacity =
                    "1";

            } else {

                showProfileFallback();

            }

        }

    } else {

        if (profileFallback) {

            profileFallback.style.display =
                "grid";

        }

    }


    /* CAREER OVERVIEW HOVER PREVIEWS */

    const overviewCards =
        document.querySelectorAll(
            ".career-overview-card"
        );


    if (overviewCards.length) {

        const touchDevice =
            window.matchMedia(
                "(hover: none)"
            ).matches ||
            "ontouchstart" in window;


        function closeOverviewPreviews(
            except = null
        ) {

            overviewCards.forEach(
                function (card) {

                    if (card !== except) {

                        card.classList.remove(
                            "preview-open"
                        );

                    }

                }
            );

        }


        if (touchDevice) {

            overviewCards.forEach(
                function (card) {

                    card.addEventListener(
                        "click",
                        function (event) {

                            /*
                             * The preview itself should not
                             * cause another card to toggle.
                             */

                            const clickedInsidePreview =
                                event.target.closest(
                                    ".overview-hover-preview"
                                );


                            if (clickedInsidePreview) {
                                return;
                            }


                            const wasOpen =
                                card.classList.contains(
                                    "preview-open"
                                );


                            closeOverviewPreviews(
                                card
                            );


                            card.classList.toggle(
                                "preview-open",
                                !wasOpen
                            );

                        }
                    );

                }
            );


            document.addEventListener(
                "click",
                function (event) {

                    if (
                        !event.target.closest(
                            ".career-overview-card"
                        )
                    ) {

                        closeOverviewPreviews();

                    }

                }
            );

        }


        overviewCards.forEach(
            function (card) {

                card.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();


                            const wasOpen =
                                card.classList.contains(
                                    "preview-open"
                                );


                            closeOverviewPreviews(
                                card
                            );


                            card.classList.toggle(
                                "preview-open",
                                !wasOpen
                            );

                        }


                        if (
                            event.key === "Escape"
                        ) {

                            card.classList.remove(
                                "preview-open"
                            );


                            card.blur();

                        }

                    }
                );

            }
        );

    }


    /* JOURNEY MODAL */

    const journeyModal =
        document.getElementById(
            "journeyModal"
        );


    const openJourneyModal =
        document.getElementById(
            "openJourneyModal"
        );


    const closeJourneyModal =
        document.getElementById(
            "closeJourneyModal"
        );


    const modalBackdrop =
        journeyModal
            ? journeyModal.querySelector(
                "[data-close-modal]"
            )
            : null;


    let lastFocusedElement =
        null;


    function openJourney() {

        if (!journeyModal) {
            return;
        }


        lastFocusedElement =
            document.activeElement;


        journeyModal.hidden =
            false;


        requestAnimationFrame(
            function () {

                journeyModal.classList.add(
                    "is-open"
                );

            }
        );


        document.body.classList.add(
            "dashboard-modal-open"
        );


        if (closeJourneyModal) {

            setTimeout(
                function () {

                    closeJourneyModal.focus();

                },
                50
            );

        }

    }


    function closeJourney() {

        if (!journeyModal) {
            return;
        }


        journeyModal.classList.remove(
            "is-open"
        );


        document.body.classList.remove(
            "dashboard-modal-open"
        );


        setTimeout(
            function () {

                journeyModal.hidden =
                    true;


                if (
                    lastFocusedElement &&
                    typeof lastFocusedElement.focus ===
                        "function"
                ) {

                    lastFocusedElement.focus();

                }

            },
            350
        );

    }


    if (openJourneyModal) {

        openJourneyModal.addEventListener(
            "click",
            openJourney
        );

    }


    if (closeJourneyModal) {

        closeJourneyModal.addEventListener(
            "click",
            closeJourney
        );

    }


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeJourney
        );

    }


    /* DASHBOARD NOTIFICATIONS */

    function showDashboardNotification(
        title,
        message,
        type = "success",
        duration = 5000
    ) {

        /*
         * Use the new global notification system.
         */

        if (
            window.CCNotify &&
            typeof window.CCNotify.show === "function"
        ) {

            return window.CCNotify.show(
                message,
                type,
                {
                    title: title,
                    duration: duration
                }
            );

        }


        /*
         * Backward-compatible fallback.
         */

        if (
            window.CareerCompass &&
            typeof window.CareerCompass.showToast ===
                "function"
        ) {

            return window.CareerCompass.showToast(
                message,
                type,
                duration
            );

        }

    }


    /* WELCOME NOTIFICATION */

    if (
        !prefersReducedMotion &&
        !sessionStorage.getItem(
            "careerCompassDashboardSeen"
        )
    ) {

        sessionStorage.setItem(
            "careerCompassDashboardSeen",
            "true"
        );


        setTimeout(
            function () {

                showDashboardNotification(
                    "Welcome back!",
                    "Your Career Compass workspace is ready.",
                    "success",
                    5000
                );

            },
            1000
        );

    }


    /* QUICK ACTION MICRO INTERACTION */

    document
        .querySelectorAll(
            ".quick-action"
        )
        .forEach(function (action) {

            action.addEventListener(
                "pointerdown",
                function () {

                    action.classList.add(
                        "action-pressed"
                    );

                }
            );


            action.addEventListener(
                "pointerup",
                function () {

                    action.classList.remove(
                        "action-pressed"
                    );

                }
            );


            action.addEventListener(
                "pointercancel",
                function () {

                    action.classList.remove(
                        "action-pressed"
                    );

                }
            );


            action.addEventListener(
                "pointerleave",
                function () {

                    action.classList.remove(
                        "action-pressed"
                    );

                }
            );

        });


    /* GLOBAL ESCAPE KEY */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Escape"
            ) {

                return;

            }


            if (
                journeyModal &&
                journeyModal.classList.contains(
                    "is-open"
                )
            ) {

                closeJourney();

                return;

            }


            if (overviewCards.length) {

                overviewCards.forEach(
                    function (card) {

                        card.classList.remove(
                            "preview-open"
                        );

                    }
                );

            }

        }
    );


    /* INITIAL PAGE POLISH */

    requestAnimationFrame(
        function () {

            dashboard.classList.add(
                "dashboard-ready"
            );

        }
    );


});


/* COLLABORATIVE RECOMMENDATION TRACKING */

(function () {

    "use strict";


    const recommendationCards =
        document.querySelectorAll(
            ".dashboard-recommendation-card"
        );


    if (!recommendationCards.length) {
        return;
    }


    async function trackRecommendation(
        courseId,
        interaction
    ) {

        if (!courseId) {
            return;
        }


        try {

            const csrfMeta =
                document.querySelector(
                    'meta[name="csrf-token"]'
                );


            const headers = {

                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json"

            };


            if (csrfMeta) {

                headers["X-CSRFToken"] =
                    csrfMeta.content;

            }


            await fetch(
                "/api/recommendations/interaction",
                {

                    method: "POST",

                    headers,

                    credentials:
                        "same-origin",

                    body: JSON.stringify({

                        course_id:
                            courseId,

                        interaction:
                            interaction

                    })

                }
            );

        }

        catch (error) {

            console.debug(
                "Recommendation tracking skipped.",
                error
            );

        }

    }


    /* VIEW TRACKING */

    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            const card =
                                entry.target;


                            trackRecommendation(
                                card.dataset.courseId,
                                "view"
                            );


                            observer.unobserve(
                                card
                            );

                        }
                    );

                },
                {
                    threshold: 0.5
                }
            );


        recommendationCards.forEach(
            function (card) {

                observer.observe(
                    card
                );

            }
        );

    }


    /* SAVE TRACKING */

    document
        .querySelectorAll(
            ".dashboard-recommendation-save"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        trackRecommendation(
                            button.dataset.courseId,
                            "save"
                        );

                    }
                );

            }
        );


})();

