/* CAREER COMPASS - COLLABORATIVE RECOMMENDATIONS */

   (function () {

    "use strict";


    document.addEventListener(
        "DOMContentLoaded",
        function () {


            /* COURSE INTERACTION */

            async function recordInteraction(
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

                        headers[
                            "X-CSRFToken"
                        ] =
                            csrfMeta.content;

                    }


                    await fetch(
                        "/api/recommendations/interaction",
                        {

                            method: "POST",

                            headers: headers,

                            credentials: "same-origin",

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
                        "Recommendation interaction skipped.",
                        error
                    );

                }

            }


            /* CARD VIEWS */

            const cards =
                document.querySelectorAll(
                    ".recommendation-card"
                );


            if (
                "IntersectionObserver" in window &&
                cards.length
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


                                    const courseId =
                                        entry.target
                                            .dataset
                                            .courseId;


                                    recordInteraction(
                                        courseId,
                                        "view"
                                    );


                                    observer.unobserve(
                                        entry.target
                                    );

                                },
                                {

                                    threshold: 0.45

                                }
                            );

                        }
                    );


                cards.forEach(
                    function (card) {

                        observer.observe(
                            card
                        );

                    }
                );

            }


            /* SAVE BUTTON */

            document
                .querySelectorAll(
                    ".recommendation-save-btn"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                const courseId =
                                    button.dataset.courseId;


                                recordInteraction(
                                    courseId,
                                    "save"
                                );


                                button.classList.add(
                                    "is-saved"
                                );


                                const icon =
                                    button.querySelector(
                                        "i"
                                    );


                                if (icon) {

                                    icon.classList.remove(
                                        "far"
                                    );

                                    icon.classList.add(
                                        "fas"
                                    );

                                }


                                button.innerHTML =
                                    `
                                    <i class="fas fa-bookmark"></i>
                                    Saved
                                    `;

                            }
                        );

                    }
                );


            /* CARD MOUSE EFFECT */

            cards.forEach(
                function (card) {

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


                            const xPercent =
                                (
                                    x /
                                    rect.width
                                ) * 100;


                            const yPercent =
                                (
                                    y /
                                    rect.height
                                ) * 100;


                            card.style.setProperty(
                                "--mouse-x",
                                `${xPercent}%`
                            );


                            card.style.setProperty(
                                "--mouse-y",
                                `${yPercent}%`
                            );

                        }
                    );


                    card.addEventListener(
                        "pointerleave",
                        function () {

                            card.style.setProperty(
                                "--mouse-x",
                                "50%"
                            );


                            card.style.setProperty(
                                "--mouse-y",
                                "50%"
                            );

                        }
                    );

                }
            );


        }
    );

})();