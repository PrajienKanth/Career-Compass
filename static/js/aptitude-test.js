/* CAREER COMPASS — APTITUDE TEST */

(function () {

    "use strict";


    document.addEventListener(
        "DOMContentLoaded",
        function () {


            /* PAGE */

            const page =
                document.querySelector(
                    ".aptitude-page"
                );


            if (!page) {
                return;
            }


            const reducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;



            /* SCROLL REVEAL */

            const revealElements =
                Array.from(
                    page.querySelectorAll(
                        ".aptitude-reveal"
                    )
                );


            if (
                reducedMotion ||
                !("IntersectionObserver" in window)
            ) {

                revealElements.forEach(
                    function (element) {

                        element.classList.add(
                            "is-visible"
                        );

                    }
                );

            } else {

                const revealObserver =
                    new IntersectionObserver(
                        function (
                            entries,
                            observer
                        ) {

                            entries.forEach(
                                function (entry) {

                                    if (
                                        !entry.isIntersecting
                                    ) {
                                        return;
                                    }


                                    entry.target.classList.add(
                                        "is-visible"
                                    );


                                    observer.unobserve(
                                        entry.target
                                    );

                                }
                            );

                        },
                        {
                            threshold: 0.10,
                            rootMargin:
                                "0px 0px -35px 0px"
                        }
                    );


                revealElements.forEach(
                    function (element) {

                        revealObserver.observe(
                            element
                        );

                    }
                );

            }



            /* PROGRESS BARS */

            const progressBars =
                Array.from(
                    page.querySelectorAll(
                        ".progress-fill"
                    )
                );


            function animateProgressBars() {

                progressBars.forEach(
                    function (bar) {

                        const value =
                            parseFloat(
                                bar.dataset.progress || 0
                            );


                        const safeValue =
                            Math.max(
                                0,
                                Math.min(
                                    100,
                                    value
                                )
                            );


                        if (reducedMotion) {

                            bar.style.width =
                                safeValue + "%";

                            return;

                        }


                        bar.style.width = "0%";


                        requestAnimationFrame(
                            function () {

                                setTimeout(
                                    function () {

                                        bar.style.width =
                                            safeValue + "%";

                                    },
                                    120
                                );

                            }
                        );

                    }
                );

            }


            if (
                reducedMotion ||
                !("IntersectionObserver" in window)
            ) {

                animateProgressBars();

            } else {

                const progressObserver =
                    new IntersectionObserver(
                        function (
                            entries,
                            observer
                        ) {

                            entries.forEach(
                                function (entry) {

                                    if (
                                        !entry.isIntersecting
                                    ) {
                                        return;
                                    }


                                    const bars =
                                        entry.target.querySelectorAll(
                                            ".progress-fill"
                                        );


                                    bars.forEach(
                                        function (bar) {

                                            const value =
                                                parseFloat(
                                                    bar.dataset.progress || 0
                                                );


                                            const safeValue =
                                                Math.max(
                                                    0,
                                                    Math.min(
                                                        100,
                                                        value
                                                    )
                                                );


                                            if (
                                                reducedMotion
                                            ) {

                                                bar.style.width =
                                                    safeValue + "%";

                                            } else {

                                                setTimeout(
                                                    function () {

                                                        bar.style.width =
                                                            safeValue + "%";

                                                    },
                                                    120
                                                );

                                            }

                                        }
                                    );


                                    observer.unobserve(
                                        entry.target
                                    );

                                }
                            );

                        },
                        {
                            threshold: 0.20
                        }
                    );


                page.querySelectorAll(
                    ".result-card"
                ).forEach(
                    function (card) {

                        progressObserver.observe(
                            card
                        );

                    }
                );

            }



            /* RESULT CARD POINTER EFFECT */

            const resultCards =
                Array.from(
                    page.querySelectorAll(
                        ".result-card"
                    )
                );


            if (
                !reducedMotion &&
                window.matchMedia(
                    "(pointer:fine)"
                ).matches
            ) {

                resultCards.forEach(
                    function (card) {


                        card.addEventListener(
                            "pointermove",
                            function (event) {

                                const rect =
                                    card.getBoundingClientRect();


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


                                const rotateX =
                                    (0.5 - y) * 2.2;


                                const rotateY =
                                    (x - 0.5) * 2.2;


                                card.style.transform =
                                    `translateY(-5px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

                            }
                        );


                        card.addEventListener(
                            "pointerleave",
                            function () {

                                card.style.transform =
                                    "";

                            }
                        );

                    }
                );

            }



            /* TEST OPTION RIPPLE */

            const testOptions =
                Array.from(
                    page.querySelectorAll(
                        ".test-option"
                    )
                );


            if (!reducedMotion) {

                testOptions.forEach(
                    function (option) {

                        option.addEventListener(
                            "pointerdown",
                            function (event) {

                                const rect =
                                    option.getBoundingClientRect();


                                const ripple =
                                    document.createElement(
                                        "span"
                                    );


                                const size =
                                    Math.max(
                                        rect.width,
                                        rect.height
                                    );


                                ripple.style.position =
                                    "absolute";

                                ripple.style.width =
                                    size + "px";

                                ripple.style.height =
                                    size + "px";

                                ripple.style.left =
                                    (
                                        event.clientX -
                                        rect.left -
                                        size / 2
                                    ) + "px";

                                ripple.style.top =
                                    (
                                        event.clientY -
                                        rect.top -
                                        size / 2
                                    ) + "px";

                                ripple.style.borderRadius =
                                    "50%";

                                ripple.style.pointerEvents =
                                    "none";

                                ripple.style.background =
                                    "rgba(139,92,246,.12)";

                                ripple.style.transform =
                                    "scale(0)";

                                ripple.style.opacity =
                                    "1";

                                ripple.style.transition =
                                    "transform .55s ease, opacity .55s ease";


                                option.appendChild(
                                    ripple
                                );


                                requestAnimationFrame(
                                    function () {

                                        ripple.style.transform =
                                            "scale(1)";

                                        ripple.style.opacity =
                                            "0";

                                    }
                                );


                                setTimeout(
                                    function () {

                                        ripple.remove();

                                    },
                                    600
                                );

                            }
                        );

                    }
                );

            }



            /* CHART RESIZE */

            const chart =
                document.getElementById(
                    "aptitude-results-chart"
                );


            if (chart) {

                window.addEventListener(
                    "resize",
                    debounce(
                        function () {


                            if (
                                window.Chart &&
                                Chart.getChart
                            ) {

                                const chartInstance =
                                    Chart.getChart(
                                        chart
                                    );


                                if (chartInstance) {

                                    chartInstance.resize();

                                }

                            }

                        },
                        180
                    )
                );

            }



            /* DEBOUNCE */

            function debounce(
                callback,
                delay
            ) {

                let timeout;


                return function () {

                    const args =
                        arguments;


                    clearTimeout(
                        timeout
                    );


                    timeout =
                        setTimeout(
                            function () {

                                callback.apply(
                                    null,
                                    args
                                );

                            },
                            delay
                        );

                };

            }



            /* INITIAL PROGRESS FALLBACK */

            if (
                progressBars.length &&
                !("IntersectionObserver" in window)
            ) {

                progressBars.forEach(
                    function (bar) {

                        const value =
                            parseFloat(
                                bar.dataset.progress || 0
                            );


                        bar.style.width =
                            Math.max(
                                0,
                                Math.min(
                                    100,
                                    value
                                )
                            ) + "%";

                    }
                );

            }

        }
    );

})();