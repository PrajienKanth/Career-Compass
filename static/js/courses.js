/* CAREER COMPASS — COURSES */

(function () {

    "use strict";

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            /* ELEMENTS */

            const searchInput =
                document.getElementById(
                    "courseSearch"
                );


            const searchClear =
                document.getElementById(
                    "searchClear"
                );


            const domainFilter =
                document.getElementById(
                    "domainFilter"
                );


            const institutionFilter =
                document.getElementById(
                    "institutionFilter"
                );


            const durationFilter =
                document.getElementById(
                    "durationFilter"
                );


            const clearButton =
                document.getElementById(
                    "clearFilters"
                );


            const emptyClearButton =
                document.getElementById(
                    "emptyClearFilters"
                );


            const cards =
                Array.from(
                    document.querySelectorAll(
                        ".course-card"
                    )
                );


            const countElement =
                document.getElementById(
                    "visibleCourseCount"
                );


            const noResults =
                document.getElementById(
                    "noResults"
                );


            const activeFilterStatus =
                document.getElementById(
                    "activeFilterStatus"
                );


            const catalogStatusText =
                document.getElementById(
                    "catalogStatusText"
                );


            const reduceMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;


            /* NORMALIZE */

            function normalize(value) {

                return String(
                    value || ""
                )
                    .toLowerCase()
                    .trim();

            }


            /* SAFE ARRAY */

            function parseRelatedDomains(
                value
            ) {

                if (!value) {
                    return [];
                }


                return String(value)
                    .split("|")
                    .map(function (item) {

                        return normalize(item);

                    })
                    .filter(Boolean);

            }


            /* DURATION */

            function matchesDuration(
                courseDuration,
                selectedDuration
            ) {

                if (!selectedDuration) {

                    return true;

                }


                const duration =
                    normalize(
                        courseDuration
                    );


                const numbers =
                    duration.match(
                        /\d+(?:\.\d+)?/g
                    );


                if (
                    !numbers ||
                    !numbers.length
                ) {

                    return true;

                }


                const firstNumber =
                    parseFloat(
                        numbers[0]
                    );


                if (
                    Number.isNaN(
                        firstNumber
                    )
                ) {

                    return true;

                }

                if (
                    selectedDuration ===
                    "short"
                ) {

                    return (
                        firstNumber <= 4
                    );

                }


                if (
                    selectedDuration ===
                    "medium"
                ) {

                    return (
                        firstNumber > 4 &&
                        firstNumber <= 12
                    );

                }


                if (
                    selectedDuration ===
                    "long"
                ) {

                    return (
                        firstNumber > 12
                    );

                }


                return true;

            }


            /* SEARCH CLEAR */

            function updateSearchClear() {

                if (
                    !searchClear ||
                    !searchInput
                ) {

                    return;

                }


                const hasValue =
                    searchInput.value
                        .trim()
                        .length > 0;


                searchClear.classList.toggle(
                    "visible",
                    hasValue
                );

            }


            /* FILTER STATUS */

            function updateFilterStatus() {

                if (
                    !activeFilterStatus
                ) {

                    return;

                }


                const active = [];


                const search =
                    normalize(
                        searchInput?.value
                    );


                const domain =
                    normalize(
                        domainFilter?.value
                    );


                const institution =
                    normalize(
                        institutionFilter?.value
                    );


                const duration =
                    normalize(
                        durationFilter?.value
                    );


                if (search) {

                    active.push(
                        "Search"
                    );

                }


                if (domain) {

                    active.push(
                        "Domain"
                    );

                }


                if (institution) {

                    active.push(
                        "Institution"
                    );

                }


                if (duration) {

                    active.push(
                        "Duration"
                    );


                }


                const text =
                    activeFilterStatus
                        .querySelector(
                            "span"
                        );


                if (!active.length) {

                    activeFilterStatus
                        .classList
                        .remove(
                            "active"
                        );


                    if (text) {

                        text.textContent =
                            "No filters applied";

                    }

                    return;

                }


                activeFilterStatus
                    .classList
                    .add(
                        "active"
                    );


                if (text) {

                    text.textContent =
                        `${active.length} filter${
                            active.length === 1
                                ? ""
                                : "s"
                        } active`;

                }

            }


            /* ANIMATE NUMBER */

            function animateNumber(
                element,
                target
            ) {

                if (!element) {

                    return;

                }


                target =
                    Number.isFinite(
                        target
                    )
                        ? target
                        : 0;


                const current =
                    parseInt(
                        element.textContent,
                        10
                    ) || 0;


                if (
                    reduceMotion ||
                    current === target
                ) {

                    element.textContent =
                        target;

                    return;

                }


                const difference =
                    target - current;


                const duration =
                    280;


                const start =
                    performance.now();


                function update(
                    time
                ) {

                    const progress =
                        Math.min(
                            (
                                time -
                                start
                            ) /
                            duration,
                            1
                        );


                    const eased =
                        1 -
                        Math.pow(
                            1 - progress,
                            3
                        );


                    const value =
                        Math.round(
                            current +
                            difference *
                            eased
                        );


                    element.textContent =
                        value;


                    if (
                        progress < 1
                    ) {

                        requestAnimationFrame(
                            update
                        );

                    }

                }


                requestAnimationFrame(
                    update
                );

            }


            /* FILTER COURSES */

            function filterCourses() {

                const search =
                    normalize(
                        searchInput?.value
                    );


                const domain =
                    normalize(
                        domainFilter?.value
                    );


                const institution =
                    normalize(
                        institutionFilter?.value
                    );


                const duration =
                    normalize(
                        durationFilter?.value
                    );


                let visible = 0;


                cards.forEach(
                    function (card) {

                        const cardDomain =
                            normalize(
                                card.dataset.domain
                            );


                        const relatedDomains =
                            parseRelatedDomains(
                                card.dataset
                                    .relatedDomains
                            );


                        const cardInstitution =
                            normalize(
                                card.dataset
                                    .institution
                            );


                        const cardDuration =
                            normalize(
                                card.dataset
                                    .duration
                            );


                        const searchableText =
                            normalize(
                                card.dataset
                                    .search
                            );


                        /* SEARCH */

                        const searchMatch =
                            !search ||
                            searchableText.includes(
                                search
                            );


                        /* DOMAIN */

                        const domainMatch =
                            !domain ||
                            cardDomain === domain ||
                            relatedDomains.includes(
                                domain
                            );


                        /* INSTITUTION */

                        const institutionMatch =
                            !institution ||
                            cardInstitution.includes(
                                institution
                            );


                        /* DURATION */

                        const durationMatch =
                            matchesDuration(
                                cardDuration,
                                duration
                            );


                        /* FINAL MATCH */

                        const shouldShow =
                            searchMatch &&
                            domainMatch &&
                            institutionMatch &&
                            durationMatch;


                        if (
                            shouldShow
                        ) {

                            card.classList.remove(
                                "hidden"
                            );

                            visible++;

                        } else {

                            card.classList.add(
                                "hidden"
                            );

                        }

                    }
                );


                /* COUNT */

                animateNumber(
                    countElement,
                    visible
                );


                /* EMPTY STATE */

                if (noResults) {

                    noResults.classList.toggle(
                        "visible",
                        visible === 0
                    );

                }


                /* CATALOG STATUS */

                if (
                    catalogStatusText
                ) {

                    if (
                        visible ===
                        cards.length
                    ) {

                        catalogStatusText
                            .textContent =
                            "All courses available";

                    } else if (
                        visible === 0
                    ) {

                        catalogStatusText
                            .textContent =
                            "No matching courses";

                    } else {

                        catalogStatusText
                            .textContent =
                            `${visible} matching ${
                                visible === 1
                                    ? "course"
                                    : "courses"
                            }`;

                    }

                }


                updateFilterStatus();

                updateSearchClear();

            }


            /* CLEAR SEARCH */

            function clearSearch() {

                if (!searchInput) {

                    return;

                }


                searchInput.value =
                    "";


                filterCourses();


                searchInput.focus();

            }


            /* CLEAR ALL FILTERS */

            function clearFilters() {

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                if (domainFilter) {

                    domainFilter.value =
                        "";

                }


                if (institutionFilter) {

                    institutionFilter.value =
                        "";

                }


                if (durationFilter) {

                    durationFilter.value =
                        "";

                }


                filterCourses();

            }


            /* EVENTS */

            if (searchInput) {

                searchInput.addEventListener(
                    "input",
                    filterCourses
                );


                searchInput.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key ===
                            "Escape"
                        ) {

                            clearSearch();

                        }

                    }
                );

            }


            if (searchClear) {

                searchClear.addEventListener(
                    "click",
                    clearSearch
                );

            }


            if (domainFilter) {

                domainFilter.addEventListener(
                    "change",
                    filterCourses
                );

            }


            if (institutionFilter) {

                institutionFilter.addEventListener(
                    "change",
                    filterCourses
                );

            }


            if (durationFilter) {

                durationFilter.addEventListener(
                    "change",
                    filterCourses
                );

            }


            if (clearButton) {

                clearButton.addEventListener(
                    "click",
                    clearFilters
                );

            }


            if (emptyClearButton) {

                emptyClearButton.addEventListener(
                    "click",
                    clearFilters
                );

            }


            /* SAVE BUTTON */

            const saveForms =
                document.querySelectorAll(
                    ".save-course-form"
                );


            saveForms.forEach(
                function (form) {

                    form.addEventListener(
                        "submit",
                        function () {

                            const button =
                                form.querySelector(
                                    ".save-course-btn"
                                );


                            if (!button) {

                                return;

                            }


                            button.classList.add(
                                "is-saving"
                            );


                            const icon =
                                button.querySelector(
                                    "i"
                                );


                            if (icon) {

                                icon.className =
                                    "fa-solid fa-spinner";

                            }


                            const text =
                                button.querySelector(
                                    "span"
                                );


                            if (text) {

                                text.textContent =
                                    "Saving...";

                            }

                        }
                    );

                }
            );


            /* SCROLL REVEAL */

            function initReveal() {

                const elements =
                    document.querySelectorAll(
                        ".cc-reveal"
                    );


                if (!elements.length) {

                    return;

                }


                document.documentElement
                    .classList
                    .add(
                        "js-reveal-enabled"
                    );


                if (
                    reduceMotion ||
                    !(
                        "IntersectionObserver"
                        in window
                    )
                ) {

                    elements.forEach(
                        function (
                            element
                        ) {

                            element.classList.add(
                                "is-visible"
                            );

                        }
                    );

                    return;

                }


                const observer =
                    new IntersectionObserver(
                        function (
                            entries
                        ) {

                            entries.forEach(
                                function (
                                    entry
                                ) {

                                    if (
                                        entry.isIntersecting
                                    ) {

                                        entry.target
                                            .classList
                                            .add(
                                                "is-visible"
                                            );


                                        observer
                                            .unobserve(
                                                entry.target
                                            );

                                    }

                                }
                            );

                        },
                        {
                            threshold: 0.06,

                            rootMargin:
                                "0px 0px -30px 0px"
                        }
                    );


                elements.forEach(
                    function (
                        element,
                        index
                    ) {

                        if (
                            element.classList
                                .contains(
                                    "course-card"
                                )
                        ) {

                            element.style
                                .transitionDelay =
                                `${
                                    Math.min(
                                        index * 45,
                                        350
                                    )
                                }ms`;

                        }


                        observer.observe(
                            element
                        );

                    }
                );

            }


            /* CARD POINTER GLOW */

            function initCardGlow() {

                if (
                    reduceMotion ||
                    window.matchMedia(
                        "(pointer: coarse)"
                    ).matches
                ) {

                    return;

                }


                cards.forEach(
                    function (card) {

                        card.addEventListener(
                            "pointermove",
                            function (
                                event
                            ) {

                                const rect =
                                    card.getBoundingClientRect();


                                const x =
                                    event.clientX -
                                    rect.left;


                                const y =
                                    event.clientY -
                                    rect.top;


                                card.style
                                    .setProperty(
                                        "--mouse-x",
                                        `${x}px`
                                    );


                                card.style
                                    .setProperty(
                                        "--mouse-y",
                                        `${y}px`
                                    );

                            }
                        );


                        card.addEventListener(
                            "pointerleave",
                            function () {

                                card.style
                                    .removeProperty(
                                        "--mouse-x"
                                    );


                                card.style
                                    .removeProperty(
                                        "--mouse-y"
                                    );

                            }
                        );

                    }
                );

            }


            /* HERO COUNTERS */

            function initHeroCounters() {

                const counters =
                    document.querySelectorAll(
                        ".hero-stat [data-count]"
                    );


                if (!counters.length) {

                    return;

                }


                counters.forEach(
                    function (
                        element
                    ) {

                        const target =
                            parseInt(
                                element.dataset
                                    .count,
                                10
                            );


                        if (
                            Number.isNaN(
                                target
                            )
                        ) {

                            return;

                        }


                        if (reduceMotion) {

                            element.textContent =
                                target;

                            return;

                        }


                        let started =
                            false;


                        if (
                            !(
                                "IntersectionObserver"
                                in window
                            )
                        ) {

                            element.textContent =
                                target;

                            return;

                        }


                        const observer =
                            new IntersectionObserver(
                                function (
                                    entries
                                ) {

                                    if (
                                        !entries[0]
                                            .isIntersecting ||
                                        started
                                    ) {

                                        return;

                                    }


                                    started =
                                        true;


                                    const duration =
                                        900;


                                    const start =
                                        performance.now();


                                    function animate(
                                        time
                                    ) {

                                        const progress =
                                            Math.min(
                                                (
                                                    time -
                                                    start
                                                ) /
                                                duration,
                                                1
                                            );


                                        const eased =
                                            1 -
                                            Math.pow(
                                                1 -
                                                progress,
                                                3
                                            );


                                        element
                                            .textContent =
                                            Math.round(
                                                target *
                                                eased
                                            );


                                        if (
                                            progress < 1
                                        ) {

                                            requestAnimationFrame(
                                                animate
                                            );

                                        }

                                    }


                                    requestAnimationFrame(
                                        animate
                                    );


                                    observer.disconnect();

                                },
                                {
                                    threshold: .5
                                }
                            );


                        observer.observe(
                            element
                        );

                    }
                );

            }


            /* INITIALIZE */


            filterCourses();


            initReveal();

            initCardGlow();

            initHeroCounters();

        }

    );

})();