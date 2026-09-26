/* CAREER COMPASS - TAKE APTITUDE TEST */

   document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* ELEMENTS */

    const form = document.getElementById("aptitude-test-form");

    if (!form) {
        return;
    }


    const questions = Array.from(
        document.querySelectorAll(".question-card")
    );

    const prevBtn =
        document.getElementById("prev-question");

    const nextBtn =
        document.getElementById("next-question");

    const submitBtn =
        document.getElementById("submit-test");

    const navBtns =
        Array.from(
            document.querySelectorAll(".question-nav-btn")
        );

    const progressBar =
        document.getElementById("aptitude-progress");

    const answeredCount =
        document.getElementById("answered-count");

    const progressPercentage =
        document.getElementById("progress-percentage");

    const currentQuestionIndicator =
        document.getElementById("current-question-indicator");


    /* STATE */

    let currentQuestion = 0;

    const answeredQuestions = new Set();


    /* TOTAL QUESTIONS */

    const totalQuestions =
        questions.length;


    if (!totalQuestions) {
        return;
    }


    /* SHOW QUESTION */

    function showQuestion(index) {

        if (
            index < 0 ||
            index >= totalQuestions
        ) {
            return;
        }


        questions.forEach(function (question, questionIndex) {

            question.classList.toggle(
                "question-active",
                questionIndex === index
            );

        });


        currentQuestion = index;


        /* PREVIOUS BUTTON */

        if (prevBtn) {

            prevBtn.disabled =
                currentQuestion === 0;

        }


        /* NEXT / SUBMIT BUTTON */

        const isLastQuestion =
            currentQuestion === totalQuestions - 1;


        if (nextBtn) {

            nextBtn.style.display =
                isLastQuestion
                    ? "none"
                    : "inline-flex";

        }


        if (submitBtn) {

            submitBtn.classList.toggle(
                "visible",
                isLastQuestion
            );

        }


        /* NAVIGATION BUTTONS */

        navBtns.forEach(function (button, buttonIndex) {

            button.classList.toggle(
                "active",
                buttonIndex === currentQuestion
            );

        });


        /* CURRENT QUESTION INDICATOR */

        if (currentQuestionIndicator) {

            currentQuestionIndicator.textContent =
                `Question ${currentQuestion + 1}`;

        }


        /* SCROLL QUESTION INTO VIEW */

        if (window.innerWidth < 900) {

            const questionPanel =
                document.querySelector(".question-panel");

            if (questionPanel) {

                questionPanel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }

    }


    /* UPDATE PROGRESS */

    function updateProgress() {

        const answered =
            answeredQuestions.size;

        const percentage =
            Math.round(
                (answered / totalQuestions) * 100
            );


        /* COUNT */

        if (answeredCount) {

            answeredCount.textContent =
                answered;

        }


        /* PROGRESS BAR */

        if (progressBar) {

            progressBar.style.width =
                `${percentage}%`;

            progressBar.setAttribute(
                "aria-valuenow",
                percentage
            );

        }


        /* PERCENTAGE */

        if (progressPercentage) {

            progressPercentage.textContent =
                `${percentage}%`;

        }


        /* QUESTION STATUS */

        questions.forEach(function (question, index) {

            const answered =
                answeredQuestions.has(index);

            question.classList.toggle(
                "is-answered",
                answered
            );


            const status =
                question.querySelector(
                    ".question-status"
                );

            if (!status) {
                return;
            }


            const icon =
                status.querySelector("i");

            const text =
                status.querySelector("span");


            if (answered) {

                if (icon) {

                    icon.className =
                        "fas fa-check-circle";

                }

                if (text) {

                    text.textContent =
                        "Answered";

                }

            } else {

                if (icon) {

                    icon.className =
                        "far fa-circle";

                }

                if (text) {

                    text.textContent =
                        "Not answered";

                }

            }

        });


        /* NAVIGATION STATUS */

        navBtns.forEach(function (button, index) {

            button.classList.toggle(
                "answered",
                answeredQuestions.has(index)
            );

        });

    }


    /* FIND QUESTION INDEX */

    function getQuestionIndexFromRadio(radio) {

        const questionId =
            radio.name;


        return questions.findIndex(function (question) {

            return question.querySelector(
                `input[name="${CSS.escape(questionId)}"]`
            );

        });

    }


    /* RADIO CHANGE */

    const radios =
        form.querySelectorAll(
            'input[type="radio"]'
        );


    radios.forEach(function (radio) {

        radio.addEventListener(
            "change",
            function () {

                const questionIndex =
                    getQuestionIndexFromRadio(this);


                if (questionIndex < 0) {
                    return;
                }


                answeredQuestions.add(
                    questionIndex
                );


                updateProgress();

            }
        );

    });


    /* PREVIOUS */

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            function () {

                if (currentQuestion > 0) {

                    showQuestion(
                        currentQuestion - 1
                    );

                }

            }
        );

    }


    /* NEXT */

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function () {

                if (
                    currentQuestion <
                    totalQuestions - 1
                ) {

                    showQuestion(
                        currentQuestion + 1
                    );

                }

            }
        );

    }


    /* QUESTION NAVIGATION */

    navBtns.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const index =
                    Number(
                        this.dataset.question
                    );


                if (
                    Number.isInteger(index) &&
                    index >= 0 &&
                    index < totalQuestions
                ) {

                    showQuestion(index);

                }

            }
        );

    });


    /* FORM SUBMISSION */

    form.addEventListener(
        "submit",
        function (event) {

            const answered =
                answeredQuestions.size;


            if (answered < totalQuestions) {

                const remaining =
                    totalQuestions - answered;


                const confirmed =
                    window.confirm(
                        `You have answered ${answered} out of ${totalQuestions} questions. ` +
                        `${remaining} question${remaining === 1 ? "" : "s"} remain unanswered.\n\n` +
                        "Are you sure you want to submit the test?"
                    );


                if (!confirmed) {

                    event.preventDefault();

                    return;

                }

            }


            /* SUBMIT LOADING STATE */

            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.innerHTML =
                    `
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Submitting...</span>
                    `;

            }

        }
    );


    /* KEYBOARD SHORTCUTS */

    document.addEventListener(
        "keydown",
        function (event) {


            const tag =
                document.activeElement?.tagName;


            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {
                return;
            }


            /* LEFT ARROW */

            if (
                event.key === "ArrowLeft" &&
                currentQuestion > 0
            ) {

                event.preventDefault();

                showQuestion(
                    currentQuestion - 1
                );

            }


            /* RIGHT ARROW */

            if (
                event.key === "ArrowRight" &&
                currentQuestion < totalQuestions - 1
            ) {

                event.preventDefault();

                showQuestion(
                    currentQuestion + 1
                );

            }

        }
    );


    /* SCROLL REVEAL */

    const revealElements =
        document.querySelectorAll(
            ".reveal-on-scroll"
        );


    if (
        "IntersectionObserver" in window &&
        revealElements.length
    ) {

        const revealObserver =
            new IntersectionObserver(
                function (entries, observer) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.classList.add(
                            "revealed"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.08
                }
            );


        revealElements.forEach(function (element) {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(function (element) {

            element.classList.add(
                "revealed"
            );

        });

    }


    /* INITIALIZE */

    showQuestion(0);

    updateProgress();

});