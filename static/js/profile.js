/* CAREER COMPASS — PROFILE */

   (function () {

    "use strict";


    /* DOM READY */

    document.addEventListener("DOMContentLoaded", function () {

        initProfileReveal();

        initCounters();

        initSkillBars();

        initAptitudeBars();

        initCompletionBar();

        initCardTilt();

        initProfileToast();

    });


    /* REDUCED MOTION */

    function prefersReducedMotion() {

        return window.matchMedia &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

    }


    /* SCROLL REVEAL */

    function initProfileReveal() {

        const elements = document.querySelectorAll(
            ".profile-reveal"
        );

        if (!elements.length) {
            return;
        }


        if (prefersReducedMotion()) {

            elements.forEach(function (element) {

                element.classList.add("is-visible");

            });

            return;
        }


        if (!("IntersectionObserver" in window)) {

            elements.forEach(function (element) {

                element.classList.add("is-visible");

            });

            return;
        }


        const observer = new IntersectionObserver(
            function (entries, observerInstance) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "is-visible"
                    );


                    observerInstance.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );


        elements.forEach(function (element, index) {

            element.style.transitionDelay =
                Math.min(index * 45, 350) + "ms";

            observer.observe(element);

        });

    }


    /* COUNTERS */

    function initCounters() {

        const counters = document.querySelectorAll(
            "[data-count]"
        );

        if (!counters.length) {
            return;
        }


        counters.forEach(function (counter) {

            const target = Number(
                counter.dataset.count || 0
            );


            if (
                prefersReducedMotion() ||
                target === 0
            ) {

                counter.textContent = target;
                return;

            }


            counter.textContent = "0";


            if (
                "IntersectionObserver" in window
            ) {

                const observer =
                    new IntersectionObserver(
                        function (entries, observerInstance) {

                            entries.forEach(function (entry) {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }

                                animateCounter(
                                    counter,
                                    target
                                );

                                observerInstance.unobserve(
                                    counter
                                );

                            });

                        },
                        {
                            threshold: 0.5
                        }
                    );


                observer.observe(counter);

            } else {

                animateCounter(
                    counter,
                    target
                );

            }

        });

    }


    function animateCounter(element, target) {

        const duration = 900;
        const startTime = performance.now();


        function update(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const eased =
                1 - Math.pow(
                    1 - progress,
                    3
                );


            const value =
                Math.round(
                    target * eased
                );


            element.textContent = value;


            if (progress < 1) {

                requestAnimationFrame(update);

            } else {

                element.textContent = target;

            }

        }


        requestAnimationFrame(update);

    }


    /* SKILL BARS */

    function initSkillBars() {

        const bars = document.querySelectorAll(
            ".skill-progress"
        );

        if (!bars.length) {
            return;
        }


        if (prefersReducedMotion()) {

            bars.forEach(function (bar) {

                bar.style.width =
                    normalizePercent(
                        bar.dataset.width
                    );

            });

            return;

        }


        if (!("IntersectionObserver" in window)) {

            bars.forEach(function (bar) {

                animateBar(
                    bar,
                    normalizePercent(
                        bar.dataset.width
                    )
                );

            });

            return;

        }


        const observer = new IntersectionObserver(
            function (entries, observerInstance) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const bar = entry.target;

                    animateBar(
                        bar,
                        normalizePercent(
                            bar.dataset.width
                        )
                    );


                    observerInstance.unobserve(bar);

                });

            },
            {
                threshold: 0.4
            }
        );


        bars.forEach(function (bar) {

            observer.observe(bar);

        });

    }


    /* APTITUDE BARS */

    function initAptitudeBars() {

        const bars = document.querySelectorAll(
            ".aptitude-fill"
        );

        if (!bars.length) {
            return;
        }


        if (prefersReducedMotion()) {

            bars.forEach(function (bar) {

                bar.style.width =
                    normalizePercent(
                        bar.dataset.width
                    );

            });

            return;

        }


        const observer =
            "IntersectionObserver" in window
                ? new IntersectionObserver(
                    function (
                        entries,
                        observerInstance
                    ) {

                        entries.forEach(
                            function (entry) {

                                if (
                                    !entry.isIntersecting
                                ) {
                                    return;
                                }


                                animateBar(
                                    entry.target,
                                    normalizePercent(
                                        entry.target.dataset.width
                                    )
                                );


                                observerInstance.unobserve(
                                    entry.target
                                );

                            }
                        );

                    },
                    {
                        threshold: 0.35
                    }
                )
                : null;


        bars.forEach(function (bar) {

            if (observer) {

                observer.observe(bar);

            } else {

                animateBar(
                    bar,
                    normalizePercent(
                        bar.dataset.width
                    )
                );

            }

        });

    }


    /* PROFILE COMPLETION */

    function initCompletionBar() {

        const fill =
            document.querySelector(
                ".completion-fill"
            );

        if (!fill) {
            return;
        }


        const width =
            normalizePercent(
                fill.dataset.width
            );


        if (prefersReducedMotion()) {

            fill.style.width = width;
            return;

        }


        setTimeout(function () {

            fill.style.width = width;

        }, 250);

    }


    /* BAR ANIMATION */

    function animateBar(bar, width) {

        if (!bar) {
            return;
        }


        bar.style.width = "0%";


        requestAnimationFrame(function () {

            requestAnimationFrame(function () {

                bar.style.width = width;

            });

        });

    }


    /* NORMALIZE PERCENT */

    function normalizePercent(value) {

        let number =
            parseFloat(value);


        if (Number.isNaN(number)) {
            number = 0;
        }


        number =
            Math.max(
                0,
                Math.min(
                    100,
                    number
                )
            );


        return number + "%";

    }


    /* CARD TILT */

    function initCardTilt() {

        if (prefersReducedMotion()) {
            return;
        }


        if (window.innerWidth < 900) {
            return;
        }


        const cards =
            document.querySelectorAll(
                "[data-tilt]"
            );


        if (!cards.length) {
            return;
        }


        cards.forEach(function (card) {

            let rafId = null;


            card.addEventListener(
                "pointermove",
                function (event) {

                    if (
                        event.pointerType ===
                        "touch"
                    ) {
                        return;
                    }


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


                    const rotateX =
                        ((y - centerY) /
                            centerY) *
                        -2.2;


                    const rotateY =
                        ((x - centerX) /
                            centerX) *
                        2.2;


                    if (rafId) {

                        cancelAnimationFrame(
                            rafId
                        );

                    }


                    rafId =
                        requestAnimationFrame(
                            function () {

                                card.style.transform =
                                    "perspective(1000px) " +
                                    "rotateX(" +
                                    rotateX +
                                    "deg) " +
                                    "rotateY(" +
                                    rotateY +
                                    "deg) " +
                                    "translateY(-2px)";

                            }
                        );

                }
            );


            card.addEventListener(
                "pointerleave",
                function () {

                    if (rafId) {

                        cancelAnimationFrame(
                            rafId
                        );

                    }


                    card.style.transform = "";

                }
            );

        });

    }


    /* PROFILE TOAST */

    function initProfileToast() {

        const toast =
            document.getElementById(
                "profileToast"
            );


        if (!toast) {
            return;
        }


        /*
         * Keep the toast subtle.
         * It only appears once per browser session.
         */

        try {

            if (
                sessionStorage.getItem(
                    "careerCompassProfileToast"
                )
            ) {
                return;
            }


            sessionStorage.setItem(
                "careerCompassProfileToast",
                "1"
            );

        } catch (error) {

            // Ignore storage restrictions.

        }


        setTimeout(function () {

            toast.classList.add("show");


            setTimeout(function () {

                toast.classList.remove(
                    "show"
                );

            }, 3000);

        }, 900);

    }


})();