/* CAREER COMPASS - AUTHENTICATION */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* AUTH ROOT */

    const authPage =
        document.querySelector(".cc-auth");

    if (!authPage) {
        return;
    }


    /* AUTH STAGE */

    const authStage =
        document.querySelector(".cc-auth-stage");


    /* REDUCED MOTION */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* PASSWORD SHOW / HIDE */

    const passwordToggles =
        document.querySelectorAll(
            ".cc-auth-password-toggle"
        );


    passwordToggles.forEach(function (toggle) {

        toggle.addEventListener(
            "click",
            function () {

                const targetId =
                    this.getAttribute("data-target");

                const input =
                    document.getElementById(targetId);

                const icon =
                    this.querySelector("i");


                if (!input) {
                    return;
                }


                const isVisible =
                    input.type === "text";


                if (isVisible) {

                    input.type = "password";

                    this.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                    this.setAttribute(
                        "aria-pressed",
                        "false"
                    );


                    if (icon) {

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );

                    }

                } else {

                    input.type = "text";

                    this.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                    this.setAttribute(
                        "aria-pressed",
                        "true"
                    );


                    if (icon) {

                        icon.classList.remove(
                            "fa-eye"
                        );

                        icon.classList.add(
                            "fa-eye-slash"
                        );

                    }

                }


                input.focus();

            }
        );

    });


    /* INPUT MICRO INTERACTIONS */

    const inputs =
        document.querySelectorAll(
            ".cc-auth-input"
        );


    inputs.forEach(function (input) {

        function updateInputState() {

            if (input.value.trim() !== "") {

                input.classList.add(
                    "has-value"
                );

            } else {

                input.classList.remove(
                    "has-value"
                );

            }

        }


        input.addEventListener(
            "input",
            updateInputState
        );


        input.addEventListener(
            "focus",
            function () {

                const field =
                    input.closest(
                        ".cc-auth-field"
                    );


                const wrapper =
                    input.closest(
                        ".cc-auth-input-wrap"
                    );


                if (field) {

                    field.style.transform =
                        "translateY(-1px)";

                }


                if (wrapper) {

                    wrapper.classList.add(
                        "is-focused"
                    );

                }

            }
        );


        input.addEventListener(
            "blur",
            function () {

                const field =
                    input.closest(
                        ".cc-auth-field"
                    );


                const wrapper =
                    input.closest(
                        ".cc-auth-input-wrap"
                    );


                if (field) {

                    field.style.transform =
                        "translateY(0)";

                }


                if (wrapper) {

                    wrapper.classList.remove(
                        "is-focused"
                    );

                }

            }
        );


        updateInputState();

    });


    /* PASSWORD SECURITY */

    const passwordInput =
        document.getElementById("password");


    const confirmPasswordInput =
        document.getElementById(
            "confirm_password"
        );


    const strengthContainer =
        document.querySelector(
            ".cc-password-strength"
        );


    const strengthBar =
        document.querySelector(
            ".cc-password-strength-bar"
        );


    const passwordMatch =
        document.querySelector(
            ".cc-password-match"
        );


    const registerSubmit =
        document.querySelector(
            ".cc-auth-register-submit"
        );


    /* PASSWORD REQUIREMENTS */

    function checkPasswordRequirements(
        password
    ) {

        return {

            length:
                password.length >= 8,

            lowercase:
                /[a-z]/.test(password),

            uppercase:
                /[A-Z]/.test(password),

            number:
                /\d/.test(password),

            special:
                /[^A-Za-z0-9]/.test(password)

        };

    }


    /* UPDATE REQUIREMENT */

    function updateRequirement(
        selector,
        passed
    ) {

        const item =
            document.querySelector(selector);


        if (!item) {
            return;
        }


        const icon =
            item.querySelector("i");


        if (passed) {

            item.classList.add(
                "valid"
            );

            item.classList.remove(
                "invalid"
            );


            if (icon) {

                icon.className =
                    "fa-solid fa-circle-check";

            }

        } else {

            item.classList.remove(
                "valid"
            );

            item.classList.add(
                "invalid"
            );


            if (icon) {

                icon.className =
                    "fa-solid fa-circle";

            }

        }

    }


    /* PASSWORD STRENGTH */

    function calculateStrength(
        password,
        requirements
    ) {

        if (!password) {
            return 0;
        }


        let score = 0;


        if (requirements.length) {
            score++;
        }


        if (requirements.lowercase) {
            score++;
        }


        if (requirements.uppercase) {
            score++;
        }


        if (requirements.number) {
            score++;
        }


        if (requirements.special) {
            score++;
        }


        if (password.length >= 12) {
            score += 0.5;
        }


        if (password.length >= 16) {
            score += 0.5;
        }


        return Math.min(
            score,
            6
        );

    }


    /* UPDATE PASSWORD UI */

    function updatePasswordUI() {

        if (!passwordInput) {
            return;
        }


        const password =
            passwordInput.value;


        const requirements =
            checkPasswordRequirements(
                password
            );


        /* Update requirements */

        updateRequirement(
            '[data-requirement="length"]',
            requirements.length
        );


        updateRequirement(
            '[data-requirement="lowercase"]',
            requirements.lowercase
        );


        updateRequirement(
            '[data-requirement="uppercase"]',
            requirements.uppercase
        );


        updateRequirement(
            '[data-requirement="number"]',
            requirements.number
        );


        updateRequirement(
            '[data-requirement="special"]',
            requirements.special
        );


        /* Calculate strength */

        const score =
            calculateStrength(
                password,
                requirements
            );


        const percentage =
            Math.min(
                (score / 6) * 100,
                100
            );


        /* Update strength bar */

        if (strengthBar) {

            strengthBar.style.width =
                percentage + "%";

        }


        /* Update strength state */

        if (strengthContainer) {

            strengthContainer.classList.remove(
                "strength-empty",
                "strength-weak",
                "strength-fair",
                "strength-good",
                "strength-strong"
            );


            if (!password) {

                strengthContainer.classList.add(
                    "strength-empty"
                );

            } else if (score <= 2) {

                strengthContainer.classList.add(
                    "strength-weak"
                );

            } else if (score <= 3) {

                strengthContainer.classList.add(
                    "strength-fair"
                );

            } else if (score <= 4.5) {

                strengthContainer.classList.add(
                    "strength-good"
                );

            } else {

                strengthContainer.classList.add(
                    "strength-strong"
                );

            }

        }


        /* Password input state */

        const allRequirementsPassed =
            requirements.length &&
            requirements.lowercase &&
            requirements.uppercase &&
            requirements.number &&
            requirements.special;


        if (password && allRequirementsPassed) {

            passwordInput.classList.add(
                "password-valid"
            );

            passwordInput.classList.remove(
                "password-invalid"
            );

        } else if (password) {

            passwordInput.classList.add(
                "password-invalid"
            );

            passwordInput.classList.remove(
                "password-valid"
            );

        } else {

            passwordInput.classList.remove(
                "password-valid",
                "password-invalid"
            );

        }


        /* Update confirmation */

        updatePasswordMatch();


        /* Update register button */

        updateRegisterButton();

    }


    /* CONFIRM PASSWORD */

    function updatePasswordMatch() {

        if (
            !passwordInput ||
            !confirmPasswordInput
        ) {

            return;

        }


        const password =
            passwordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;


        /* Empty fields */

        if (!password && !confirmPassword) {

            confirmPasswordInput.classList.remove(
                "password-match-valid",
                "password-match-invalid"
            );


            if (passwordMatch) {

                passwordMatch.classList.remove(
                    "visible",
                    "match-success",
                    "match-error"
                );

                passwordMatch.innerHTML =
                    "";

            }

            return;

        }


        /* Confirm password empty */

        if (!confirmPassword) {

            confirmPasswordInput.classList.remove(
                "password-match-valid",
                "password-match-invalid"
            );


            if (passwordMatch) {

                passwordMatch.classList.remove(
                    "visible",
                    "match-success",
                    "match-error"
                );

                passwordMatch.innerHTML =
                    "";

            }

            return;

        }


        /* Passwords match */

        if (password === confirmPassword) {

            confirmPasswordInput.classList.add(
                "password-match-valid"
            );

            confirmPasswordInput.classList.remove(
                "password-match-invalid"
            );


            if (passwordMatch) {

                passwordMatch.classList.add(
                    "visible",
                    "match-success"
                );

                passwordMatch.classList.remove(
                    "match-error"
                );


                passwordMatch.innerHTML =
                    '<i class="fa-solid fa-circle-check"></i>' +
                    '<span>Passwords match</span>';

            }

        } else {

            confirmPasswordInput.classList.add(
                "password-match-invalid"
            );

            confirmPasswordInput.classList.remove(
                "password-match-valid"
            );


            if (passwordMatch) {

                passwordMatch.classList.add(
                    "visible",
                    "match-error"
                );

                passwordMatch.classList.remove(
                    "match-success"
                );


                passwordMatch.innerHTML =
                    '<i class="fa-solid fa-circle-xmark"></i>' +
                    '<span>Passwords do not match</span>';

            }

        }

    }


    /* REGISTER BUTTON STATE */

    function updateRegisterButton() {

        if (
            !registerSubmit ||
            !passwordInput ||
            !confirmPasswordInput
        ) {

            return;

        }


        const password =
            passwordInput.value;


        const confirmPassword =
            confirmPasswordInput.value;


        const requirements =
            checkPasswordRequirements(
                password
            );


        const passwordValid =
            requirements.length &&
            requirements.lowercase &&
            requirements.uppercase &&
            requirements.number &&
            requirements.special;


        const passwordsMatch =
            password &&
            confirmPassword &&
            password === confirmPassword;


        if (
            passwordValid &&
            passwordsMatch
        ) {

            registerSubmit.disabled =
                false;

            registerSubmit.classList.add(
                "ready"
            );

        } else {

            registerSubmit.disabled =
                true;

            registerSubmit.classList.remove(
                "ready"
            );

        }

    }


    /* PASSWORD EVENTS */

    if (passwordInput) {

        passwordInput.addEventListener(
            "input",
            updatePasswordUI
        );


        updatePasswordUI();

    }


    /* CONFIRM PASSWORD EVENTS */

    if (confirmPasswordInput) {

        confirmPasswordInput.addEventListener(
            "input",
            function () {

                updatePasswordMatch();

                updateRegisterButton();

            }
        );

    }


    /* AUTH PAGE NAVIGATION */

    const switchLinks =
        document.querySelectorAll(
            ".cc-auth-switch-link"
        );


    switchLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const destination =
                    this.getAttribute("href");


                if (!destination) {
                    return;
                }


                event.preventDefault();


                const target =
                    this.getAttribute(
                        "data-auth-target"
                    );


                if (!target) {

                    window.location.href =
                        destination;

                    return;

                }


                authPage.classList.add(
                    "is-switching"
                );


                authPage.classList.remove(
                    "to-login",
                    "to-register"
                );


                if (target === "register") {

                    authPage.classList.add(
                        "to-register"
                    );

                } else if (target === "login") {

                    authPage.classList.add(
                        "to-login"
                    );

                }


                window.setTimeout(
                    function () {

                        window.location.href =
                            destination;

                    },
                    500
                );

            }
        );

    });


    /* FORM SUBMIT LOADING */

    const forms =
        document.querySelectorAll(
            ".cc-auth-form"
        );


    forms.forEach(function (form) {

        form.addEventListener(
            "submit",
            function (event) {

                const isRegisterForm =
                    form.classList.contains(
                        "cc-register-form"
                    );


                /* Register validation */

                if (isRegisterForm) {

                    updatePasswordUI();


                    const password =
                        passwordInput
                            ? passwordInput.value
                            : "";


                    const confirmPassword =
                        confirmPasswordInput
                            ? confirmPasswordInput.value
                            : "";


                    const requirements =
                        checkPasswordRequirements(
                            password
                        );


                    const passwordValid =
                        requirements.length &&
                        requirements.lowercase &&
                        requirements.uppercase &&
                        requirements.number &&
                        requirements.special;


                    const passwordsMatch =
                        password &&
                        confirmPassword &&
                        password ===
                        confirmPassword;


                    if (
                        !passwordValid ||
                        !passwordsMatch
                    ) {

                        event.preventDefault();


                        authPage.classList.add(
                            "form-shake"
                        );


                        window.setTimeout(
                            function () {

                                authPage.classList.remove(
                                    "form-shake"
                                );

                            },
                            500
                        );


                        return;

                    }

                }


                const button =
                    form.querySelector(
                        ".cc-auth-submit"
                    );


                if (!button) {
                    return;
                }


                /*
                 * Allow native HTML validation
                 * to run before loading state.
                 */

                window.setTimeout(
                    function () {

                        if (
                            !form.checkValidity()
                        ) {

                            return;

                        }


                        button.disabled =
                            true;

                        button.classList.add(
                            "is-loading"
                        );


                        button.style.cursor =
                            "wait";


                        /* Current button selectors */

                        const text =
                            button.querySelector(
                                ".cc-auth-submit-text"
                            );


                        const arrow =
                            button.querySelector(
                                ".cc-submit-arrow"
                            );


                        const spinner =
                            button.querySelector(
                                ".cc-auth-submit-spinner"
                            );


                        /* Loading text */

                        if (text) {

                            text.textContent =
                                button.getAttribute(
                                    "data-loading-text"
                                ) ||
                                "Please wait...";

                        }


                        /* Hide arrow */

                        if (arrow) {

                            arrow.style.display =
                                "none";

                        }


                        /* Show spinner */

                        if (spinner) {

                            spinner.classList.remove(
                                "d-none"
                            );

                        }

                    },
                    30
                );

            }
        );

    });


    /* PARALLAX BACKGROUND */

    const orbs =
        document.querySelectorAll(
            ".cc-auth-orb"
        );


    if (
        !reducedMotion &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches &&
        window.innerWidth > 1000 &&
        orbs.length
    ) {

        authPage.addEventListener(
            "mousemove",
            function (event) {

                const x =
                    (event.clientX /
                        window.innerWidth) -
                    0.5;


                const y =
                    (event.clientY /
                        window.innerHeight) -
                    0.5;


                orbs.forEach(
                    function (orb, index) {

                        const amount =
                            (index + 1) * 10;


                        orb.style.transform =
                            `translate3d(
                                ${x * amount}px,
                                ${y * amount}px,
                                0
                            )`;

                    }
                );

            }
        );


        authPage.addEventListener(
            "mouseleave",
            function () {

                orbs.forEach(
                    function (orb) {

                        orb.style.transform =
                            "";

                    }
                );

            }
        );

    }


    /* PAGE READY */

    window.requestAnimationFrame(
        function () {

            authPage.classList.add(
                "auth-ready"
            );

        }
    );

});