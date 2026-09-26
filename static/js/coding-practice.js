/* CAREER COMPASS - CODING PRACTICE */

(function () {

    "use strict";


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initRevealAnimations();

            initProgressBar();

            initProblemFilters();

            initViewToggle();

            initKeyboardSearch();

            initCardEffects();

        }
    );


    /* REDUCED MOTION */

    function prefersReducedMotion() {

        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    }


    /* REVEAL ANIMATIONS */

    function initRevealAnimations() {

        const elements =
            document.querySelectorAll(".cc-reveal");


        if (!elements.length) {
            return;
        }


        if (prefersReducedMotion()) {

            elements.forEach(function (element) {

                element.classList.add(
                    "is-visible"
                );

            });

            return;

        }


        if (!("IntersectionObserver" in window)) {

            elements.forEach(function (element) {

                element.classList.add(
                    "is-visible"
                );

            });

            return;

        }


        const observer =
            new IntersectionObserver(
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
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -30px 0px"
                }
            );


        elements.forEach(
            function (element, index) {

                element.style.transitionDelay =
                    Math.min(
                        index * 45,
                        350
                    ) + "ms";


                observer.observe(element);

            }
        );

    }


    /* PROGRESS BAR */

    function initProgressBar() {

        const bars =
            document.querySelectorAll(
                ".cc-progress-bar span"
            );


        if (!bars.length) {
            return;
        }


        bars.forEach(function (bar) {

            const value =
                Number(
                    bar.dataset.progress
                ) || 0;


            const progress =
                Math.max(
                    0,
                    Math.min(value, 100)
                );


            if (prefersReducedMotion()) {

                bar.style.width =
                    progress + "%";

                return;

            }


            window.setTimeout(
                function () {

                    bar.style.width =
                        progress + "%";

                },
                250
            );

        });

    }


    /* PROBLEM FILTERS */

    function initProblemFilters() {

        const grid =
            document.getElementById(
                "problem-grid"
            );


        if (!grid) {
            return;
        }


        const cards =
            Array.from(
                grid.querySelectorAll(
                    ".cc-problem-card"
                )
            );


        const search =
            document.getElementById(
                "problem-search"
            );


        const difficulty =
            document.getElementById(
                "difficulty-filter"
            );


        const topic =
            document.getElementById(
                "topic-filter"
            );


        const status =
            document.getElementById(
                "status-filter"
            );


        const apply =
            document.getElementById(
                "apply-filter"
            );


        const reset =
            document.getElementById(
                "reset-filter"
            );


        const empty =
            document.getElementById(
                "coding-search-empty"
            );


        const count =
            document.getElementById(
                "problem-count"
            );


        const emptyReset =
            document.getElementById(
                "empty-reset-btn"
            );


        if (!cards.length) {
            return;
        }


        function applyFilters() {

            const searchValue =
                (
                    search
                        ? search.value
                        : ""
                )
                .trim()
                .toLowerCase();


            const difficultyValue =
                (
                    difficulty
                        ? difficulty.value
                        : "all"
                )
                .toLowerCase();


            const topicValue =
                (
                    topic
                        ? topic.value
                        : "all"
                )
                .toLowerCase();


            const statusValue =
                status
                    ? status.value
                    : "all";


            let visibleCount = 0;


            cards.forEach(function (card) {

                const cardDifficulty =
                    (
                        card.dataset.difficulty ||
                        ""
                    ).toLowerCase();


                const cardTopic =
                    (
                        card.dataset.topic ||
                        ""
                    ).toLowerCase();


                const completed =
                    card.dataset.completed ===
                    "true";


                const title =
                    card.dataset.title ||
                    "";


                const description =
                    card.dataset.description ||
                    "";


                const matchesSearch =
                    !searchValue ||
                    title.includes(searchValue) ||
                    description.includes(searchValue);


                const matchesDifficulty =
                    difficultyValue === "all" ||
                    cardDifficulty ===
                        difficultyValue;


                const matchesTopic =
                    topicValue === "all" ||
                    cardTopic === topicValue;


                const matchesStatus =
                    statusValue === "all" ||

                    (
                        statusValue ===
                            "completed" &&
                        completed
                    ) ||

                    (
                        statusValue ===
                            "incomplete" &&
                        !completed
                    );


                const shouldShow =
                    matchesSearch &&
                    matchesDifficulty &&
                    matchesTopic &&
                    matchesStatus;


                if (shouldShow) {

                    card.style.display = "";

                    visibleCount++;

                } else {

                    card.style.display = "none";

                }

            });


            updateProblemCount(
                visibleCount
            );


            if (empty) {

                empty.hidden =
                    visibleCount !== 0;

            }

        }


        function updateProblemCount(
            visibleCount
        ) {

            if (!count) {
                return;
            }


            count.textContent =
                visibleCount +
                " " +
                (
                    visibleCount === 1
                        ? "problem"
                        : "problems"
                );

        }


        function resetFilters() {

            if (search) {
                search.value = "";
            }


            if (difficulty) {
                difficulty.value = "all";
            }


            if (topic) {
                topic.value = "all";
            }


            if (status) {
                status.value = "all";
            }


            applyFilters();


            if (search) {

                search.focus();

            }

        }


        if (apply) {

            apply.addEventListener(
                "click",
                applyFilters
            );

        }


        if (reset) {

            reset.addEventListener(
                "click",
                resetFilters
            );

        }


        if (emptyReset) {

            emptyReset.addEventListener(
                "click",
                resetFilters
            );

        }


        if (search) {

            search.addEventListener(
                "input",
                applyFilters
            );

        }


        [difficulty, topic, status]
            .forEach(function (select) {

                if (!select) {
                    return;
                }


                select.addEventListener(
                    "change",
                    applyFilters
                );

            });


        applyFilters();

    }


    /* VIEW TOGGLE */

    function initViewToggle() {

        const grid =
            document.getElementById(
                "problem-grid"
            );


        if (!grid) {
            return;
        }


        const buttons =
            document.querySelectorAll(
                ".cc-view-btn"
            );


        if (!buttons.length) {
            return;
        }


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const view =
                        button.dataset.view;


                    if (view === "list") {

                        grid.classList.add(
                            "list-view"
                        );

                    } else {

                        grid.classList.remove(
                            "list-view"
                        );

                    }

                }
            );

        });

    }


    /* KEYBOARD SEARCH */

    function initKeyboardSearch() {

        const search =
            document.getElementById(
                "problem-search"
            );


        if (!search) {
            return;
        }


        document.addEventListener(
            "keydown",
            function (event) {


                if (
                    event.key !== "/" ||
                    event.ctrlKey ||
                    event.metaKey ||
                    event.altKey
                ) {
                    return;
                }


                const active =
                    document.activeElement;


                const isTyping =
                    active &&
                    (
                        active.tagName === "INPUT" ||
                        active.tagName === "TEXTAREA" ||
                        active.tagName === "SELECT" ||
                        active.isContentEditable
                    );


                if (isTyping) {
                    return;
                }


                event.preventDefault();

                search.focus();

            }
        );

    }


    /* CARD POINTER EFFECT */

    function initCardEffects() {

        if (prefersReducedMotion()) {
            return;
        }


        if (window.innerWidth < 900) {
            return;
        }


        const cards =
            document.querySelectorAll(
                ".cc-problem-card"
            );


        cards.forEach(function (card) {

            card.addEventListener(
                "mousemove",
                function (event) {


                    if (
                        card.classList.contains(
                            "cc-card-tilt-disabled"
                        )
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
                        (
                            (y - centerY) /
                            centerY
                        ) * -1;


                    const rotateY =
                        (
                            (x - centerX) /
                            centerX
                        ) * 1;


                    card.style.transform =
                        "translateY(-6px) " +
                        "perspective(900px) " +
                        "rotateX(" +
                        rotateX +
                        "deg) " +
                        "rotateY(" +
                        rotateY +
                        "deg)";

                }
            );


            card.addEventListener(
                "mouseleave",
                function () {

                    card.style.transform = "";

                }
            );

        });

    }


})();