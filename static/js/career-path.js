/* CAREER COMPASS — CAREER PATHS */

(function () {

    "use strict";


    /* DOM READY */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const page =
                document.querySelector(".career-page");

            if (!page) {
                return;
            }


            const searchInput =
                document.getElementById(
                    "careerSearch"
                );

            const searchClear =
                document.getElementById(
                    "careerSearchClear"
                );

            const searchEmpty =
                document.getElementById(
                    "searchEmpty"
                );

            const resetSearch =
                document.getElementById(
                    "resetCareerSearch"
                );

            const searchStatus =
                document.getElementById(
                    "searchStatusText"
                );

            const cards =
                Array.from(
                    page.querySelectorAll(
                        ".career-card"
                    )
                );


            const reducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;



            /* NORMALIZE */

            function normalize(value) {

                return String(value || "")
                    .toLowerCase()
                    .replace(/\s+/g, " ")
                    .trim();

            }



            /* SEARCH */

            function filterCareers() {

                if (!searchInput) {
                    return;
                }


                const search =
                    normalize(
                        searchInput.value
                    );


                let visibleCount = 0;


                cards.forEach(
                    function (card) {

                        const searchableText =
                            normalize(
                                card.dataset.search
                            );


                        const matches =
                            !search ||
                            searchableText.includes(
                                search
                            );


                        if (matches) {

                            card.classList.remove(
                                "hidden"
                            );

                            visibleCount++;


                            if (
                                !reducedMotion &&
                                search
                            ) {

                                card.animate(
                                    [
                                        {
                                            opacity: 0.55,
                                            transform:
                                                "translateY(5px)"
                                        },
                                        {
                                            opacity: 1,
                                            transform:
                                                "translateY(0)"
                                        }
                                    ],
                                    {
                                        duration: 220,
                                        easing:
                                            "cubic-bezier(.16,1,.3,1)"
                                    }
                                );

                            }

                        } else {

                            card.classList.add(
                                "hidden"
                            );

                        }

                    }
                );


                updateSearchUI(
                    search,
                    visibleCount
                );

            }



            /* SEARCH UI */

            function updateSearchUI(
                search,
                visibleCount
            ) {

                if (searchStatus) {

                    if (!search) {

                        searchStatus.textContent =
                            cards.length === 1
                                ? "Showing 1 available career path"
                                : `Showing ${cards.length} available career paths`;

                    } else if (visibleCount === 0) {

                        searchStatus.textContent =
                            `No career paths found for "${search}"`;

                    } else {

                        searchStatus.textContent =
                            visibleCount === 1
                                ? `Found 1 career path for "${search}"`
                                : `Found ${visibleCount} career paths for "${search}"`;

                    }

                }


                if (searchClear) {

                    searchClear.classList.toggle(
                        "visible",
                        Boolean(search)
                    );

                }


                if (searchEmpty) {

                    searchEmpty.classList.toggle(
                        "visible",
                        Boolean(search) &&
                        visibleCount === 0
                    );

                }

            }



            /* CLEAR SEARCH */

            function clearSearch() {

                if (!searchInput) {
                    return;
                }


                searchInput.value = "";


                filterCareers();


                searchInput.focus();

            }



            if (searchInput) {

                searchInput.addEventListener(
                    "input",
                    filterCareers
                );

            }


            if (searchClear) {

                searchClear.addEventListener(
                    "click",
                    clearSearch
                );

            }


            if (resetSearch) {

                resetSearch.addEventListener(
                    "click",
                    clearSearch
                );

            }



            /* KEYBOARD SHORTCUT */

            document.addEventListener(
                "keydown",
                function (event) {

                    /*
                     * "/" focuses search.
                     */

                    if (
                        event.key === "/" &&
                        document.activeElement !== searchInput &&
                        !isTypingTarget(
                            document.activeElement
                        )
                    ) {

                        event.preventDefault();

                        if (searchInput) {

                            searchInput.focus();

                        }

                    }


                    /*
                     * Escape clears search.
                     */

                    if (
                        event.key === "Escape" &&
                        document.activeElement === searchInput &&
                        searchInput &&
                        searchInput.value
                    ) {

                        clearSearch();

                    }

                }
            );



            function isTypingTarget(element) {

                if (!element) {
                    return false;
                }


                const tag =
                    element.tagName
                        ? element.tagName.toLowerCase()
                        : "";


                return (
                    tag === "input" ||
                    tag === "textarea" ||
                    tag === "select" ||
                    element.isContentEditable
                );

            }



            /* SCROLL REVEAL */

            const revealElements =
                Array.from(
                    page.querySelectorAll(
                        ".career-reveal"
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
                        function (entries, observer) {

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
                                "0px 0px -40px 0px"
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



            /* CARD POINTER EFFECT */

            if (
                !reducedMotion &&
                window.matchMedia(
                    "(pointer:fine)"
                ).matches
            ) {

                cards.forEach(
                    function (card) {

                        card.addEventListener(
                            "pointermove",
                            function (event) {

                                if (
                                    card.classList.contains(
                                        "hidden"
                                    )
                                ) {
                                    return;
                                }


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


                                const rotateY =
                                    (x - 0.5) * 2.5;


                                const rotateX =
                                    (0.5 - y) * 2.5;


                                card.style.transform =
                                    `translateY(-7px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

                            }
                        );


                        card.addEventListener(
                            "pointerleave",
                            function () {

                                card.style.transform = "";

                            }
                        );

                    }
                );

            }



            /* SEARCH INITIAL STATE */

            filterCareers();



            /* PAGE LOAD HASH */

            if (window.location.hash) {

                const target =
                    document.querySelector(
                        window.location.hash
                    );


                if (target) {

                    setTimeout(
                        function () {

                            target.scrollIntoView(
                                {
                                    behavior:
                                        reducedMotion
                                            ? "auto"
                                            : "smooth",
                                    block: "start"
                                }
                            );

                        },
                        250
                    );

                }

            }

        }
    );

})();