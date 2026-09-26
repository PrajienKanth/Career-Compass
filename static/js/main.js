/*CAREER COMPASS - GLOBAL */

"use strict";


/*DOM READY */

document.addEventListener("DOMContentLoaded", () => {

    initPageLoader();

    initFlashMessages();

    initSmoothScrolling();

    initScrollAnimations();

    initBootstrapComponents();

    initPasswordStrength();

    initPasswordVisibility();

    initScrollProgress();

    initBackToTop();

    initButtonRipples();

    initAnimatedCounters();

    initProgressBars();

    initKeyboardAccessibility();

    initActiveNavigation();

    initMobileMenuButton();

});


/*CAREER COMPASS — GLOBAL PAGE LOADER */

(function () {

    "use strict";


    const loader =
        document.getElementById("cc-page-loader");


    if (!loader) {
        return;
    }


    const progressBar =
        document.getElementById(
            "cc-loader-progress-bar"
        );


    const progressValue =
        document.getElementById(
            "cc-loader-progress-value"
        );


    const statusText =
        document.getElementById(
            "cc-loader-status-text"
        );


    const statusMessages = [

        {
            progress: 15,
            text: "INITIALIZING"
        },

        {
            progress: 35,
            text: "LOADING YOUR WORKSPACE"
        },

        {
            progress: 55,
            text: "PREPARING EXPERIENCE"
        },

        {
            progress: 75,
            text: "SYNCING CAREER TOOLS"
        },

        {
            progress: 90,
            text: "FINALIZING"
        },

        {
            progress: 100,
            text: "READY"
        }

    ];


    let currentProgress = 0;

    let targetProgress = 0;

    let progressAnimation = null;

    let loaderFinished = false;


    /* UPDATE PROGRESS */

    function updateProgress(value) {

        targetProgress =
            Math.min(
                100,
                Math.max(0, value)
            );


        if (progressAnimation) {

            cancelAnimationFrame(
                progressAnimation
            );

        }


        function animate() {

            const difference =
                targetProgress - currentProgress;


            if (Math.abs(difference) < 0.4) {

                currentProgress =
                    targetProgress;

            } else {

                currentProgress +=
                    difference * 0.08;

            }


            const rounded =
                Math.round(currentProgress);


            if (progressBar) {

                progressBar.style.width =
                    rounded + "%";

            }


            if (progressValue) {

                progressValue.textContent =
                    rounded + "%";

            }


            progressAnimation =
                requestAnimationFrame(
                    animate
                );


            if (
                rounded >= targetProgress &&
                currentProgress === targetProgress
            ) {

                cancelAnimationFrame(
                    progressAnimation
                );

            }

        }


        animate();

    }



    function updateStatus(progress) {

        let selected =
            statusMessages[0];


        statusMessages.forEach(
            function (item) {

                if (
                    progress >= item.progress
                ) {

                    selected = item;

                }

            }
        );


        if (statusText) {

            statusText.style.opacity = "0";


            window.setTimeout(
                function () {

                    statusText.textContent =
                        selected.text;

                    statusText.style.opacity =
                        "1";

                },
                120
            );

        }

    }


    /* POGRESS */

    updateProgress(8);

    updateStatus(8);


    /* QUENCE */

    const progressSequence = [

        {
            value: 18,
            delay: 180
        },

        {
            value: 35,
            delay: 420
        },

        {
            value: 55,
            delay: 700
        },

        {
            value: 72,
            delay: 950
        },

        {
            value: 88,
            delay: 1200
        }

    ];


    progressSequence.forEach(
        function (item) {

            window.setTimeout(
                function () {

                    updateProgress(
                        item.value
                    );

                    updateStatus(
                        item.value
                    );

                },
                item.delay
            );

        }
    );


    /* COMPLETE */

    function finishLoader() {

        if (loaderFinished) {
            return;
        }


        loaderFinished = true;


        updateProgress(100);

        updateStatus(100);


        window.setTimeout(
            function () {

                loader.classList.add(
                    "cc-loader-hidden"
                );


                document.body.classList.add(
                    "cc-page-ready"
                );


                window.setTimeout(
                    function () {

                        loader.remove();

                    },
                    800
                );

            },
            350
        );

    }


    /* W LOAD */

    if (
        document.readyState ===
        "complete"
    ) {

        window.setTimeout(
            finishLoader,
            350
        );

    } else {

        window.addEventListener(
            "load",
            function () {

                window.setTimeout(
                    finishLoader,
                    350
                );

            },
            {
                once: true
            }
        );

    }


    /* IMEOUT */

    window.setTimeout(
        function () {

            finishLoader();

        },
        5000
    );


    /* UPPORT */

    window.addEventListener(
        "pageshow",
        function (event) {

            if (event.persisted) {

                const existingLoader =
                    document.getElementById(
                        "cc-page-loader"
                    );


                if (existingLoader) {

                    existingLoader.classList.add(
                        "cc-loader-hidden"
                    );

                    window.setTimeout(
                        function () {

                            existingLoader.remove();

                        },
                        300
                    );

                }

            }

        }
    );


})();

/*FLASH MESSAGES */

function initFlashMessages() {

    const alerts =
        document.querySelectorAll(".app-alert");

    if (!alerts.length) {
        return;
    }


    alerts.forEach((alert, index) => {

        /*
         * Stagger multiple alerts.
         */

        alert.style.animationDelay =
            `${index * 70}ms`;


        const closeButton =
            alert.querySelector(".alert-close");


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                () => {
                    dismissAlert(alert);
                }
            );

        }


        /*
         * Automatically dismiss success
         * and info messages.
         */

        if (
            alert.classList.contains("alert-success") ||
            alert.classList.contains("alert-info")
        ) {

            window.setTimeout(
                () => {
                    dismissAlert(alert);
                },
                5000 + (index * 250)
            );

        }

    });

}


/*DISMISS ALERT */

function dismissAlert(alert) {

    if (
        !alert ||
        alert.dataset.closing === "true"
    ) {
        return;
    }


    alert.dataset.closing = "true";


    alert.style.transition =
        "opacity 250ms ease, transform 250ms ease";


    alert.style.opacity = "0";


    alert.style.transform =
        "translateY(-10px) scale(.98)";


    window.setTimeout(() => {

        if (alert.parentNode) {
            alert.remove();
        }

    }, 270);

}


/*SMOOTH SCROLLING */

function initSmoothScrolling() {

    const links =
        document.querySelectorAll('a[href^="#"]');

    if (!links.length) {
        return;
    }


    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                let target;

                try {

                    target =
                        document.querySelector(
                            targetId
                        );

                } catch (error) {

                    return;

                }


                if (!target) {
                    return;
                }


                event.preventDefault();


                const mobileHeader =
                    document.querySelector(
                        ".mobile-topbar"
                    );


                const offset =
                    mobileHeader
                        ? mobileHeader.offsetHeight
                        : 20;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    offset -
                    10;


                window.scrollTo({

                    top: Math.max(
                        targetPosition,
                        0
                    ),

                    behavior:
                        prefersReducedMotion()
                            ? "auto"
                            : "smooth"

                });

            }
        );

    });

}


/*SCROLL REVEAL ANIMATIONS */

function initScrollAnimations() {

    const elements =
        document.querySelectorAll(
            ".animate-on-scroll, .reveal"
        );


    if (!elements.length) {
        return;
    }


    /*
     * Reduced motion.
     */

    if (prefersReducedMotion()) {

        elements.forEach(element => {

            element.classList.add(
                "visible",
                "revealed",
                "active"
            );

        });

        return;
    }


    /*
     * Browser fallback.
     */

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(element => {

            element.classList.add(
                "visible",
                "revealed",
                "active"
            );

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible",
                            "revealed",
                            "active"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.08,

                rootMargin:
                    "0px 0px -45px 0px"
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });

}


/*BOOTSTRAP COMPONENTS */

function initBootstrapComponents() {

    if (
        typeof bootstrap === "undefined"
    ) {
        return;
    }


    /*
     * Tooltips.
     */

    document
        .querySelectorAll(
            '[data-bs-toggle="tooltip"]'
        )
        .forEach(element => {

            try {

                new bootstrap.Tooltip(
                    element
                );

            } catch (error) {

                console.warn(
                    "Tooltip initialization failed:",
                    error
                );

            }

        });


    /*
     * Popovers.
     */

    document
        .querySelectorAll(
            '[data-bs-toggle="popover"]'
        )
        .forEach(element => {

            try {

                new bootstrap.Popover(
                    element
                );

            } catch (error) {

                console.warn(
                    "Popover initialization failed:",
                    error
                );

            }

        });

}


/*PASSWORD STRENGTH */

function initPasswordStrength() {

    const passwordInputs =
        document.querySelectorAll(
            'input[type="password"]'
        );


    if (!passwordInputs.length) {
        return;
    }


    passwordInputs.forEach(input => {

        const inputName =
            input.name?.toLowerCase() || "";


        const inputId =
            input.id?.toLowerCase() || "";


        if (
            !inputName.includes("password") &&
            !inputId.includes("password")
        ) {
            return;
        }


        /*
         * Prevent duplicate meters.
         */

        if (
            input.parentElement?.querySelector(
                ".password-strength"
            )
        ) {
            return;
        }


        const wrapper =
            input.parentElement;


        if (!wrapper) {
            return;
        }


        const meter =
            document.createElement("div");


        meter.className =
            "password-strength";


        meter.innerHTML = `
   
               <div class="password-strength-track">
   
                   <span></span>
   
               </div>
   
               <small class="password-strength-text">
   
                   Enter a password
   
               </small>
   
           `;


        wrapper.appendChild(meter);


        const bar =
            meter.querySelector(
                ".password-strength-track span"
            );


        const text =
            meter.querySelector(
                ".password-strength-text"
            );


        input.addEventListener(
            "input",
            () => {

                updatePasswordStrength(
                    input.value,
                    bar,
                    text
                );

            }
        );


        updatePasswordStrength(
            input.value,
            bar,
            text
        );

    });

}


/*PASSWORD STRENGTH CALCULATOR */

function updatePasswordStrength(
    password,
    bar,
    text
) {

    if (!bar || !text) {
        return;
    }


    if (!password) {

        bar.style.width = "0%";

        text.textContent =
            "Enter a password";

        text.dataset.level =
            "empty";

        return;

    }


    let score = 0;


    /*
     * Length.
     */

    if (password.length >= 8) {
        score++;
    }

    if (password.length >= 12) {
        score++;
    }


    /*
     * Uppercase.
     */

    if (/[A-Z]/.test(password)) {
        score++;
    }


    /*
     * Number.
     */

    if (/[0-9]/.test(password)) {
        score++;
    }


    /*
     * Special character.
     */

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }


    const levels = {

        1: {
            width: "20%",
            label: "Very weak"
        },

        2: {
            width: "40%",
            label: "Weak"
        },

        3: {
            width: "60%",
            label: "Medium"
        },

        4: {
            width: "80%",
            label: "Strong"
        },

        5: {
            width: "100%",
            label: "Very strong"
        }

    };


    const level =
        levels[
        Math.max(
            1,
            Math.min(score, 5)
        )
        ];


    bar.style.width =
        level.width;


    text.textContent =
        level.label;


    text.dataset.level =
        level.label
            .toLowerCase()
            .replace(/\s+/g, "-");

}


/*PASSWORD VISIBILITY */

function initPasswordVisibility() {

    const toggleButtons =
        document.querySelectorAll(
            "[data-password-toggle]"
        );


    toggleButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.getAttribute(
                        "data-password-toggle"
                    );


                if (!targetId) {
                    return;
                }


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {
                    return;
                }


                const isPassword =
                    input.type === "password";


                input.type =
                    isPassword
                        ? "text"
                        : "password";


                button.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );


                /*
                 * FIXED:
                 * querySelector("i")
                 */

                const icon =
                    button.querySelector("i");


                if (icon) {

                    icon.classList.toggle(
                        "fa-eye",
                        !isPassword
                    );


                    icon.classList.toggle(
                        "fa-eye-slash",
                        isPassword
                    );

                }

            }
        );

    });

}


/*SCROLL PROGRESS */

function initScrollProgress() {

    const progress =
        document.querySelector(
            ".scroll-progress"
        ) ||
        document.querySelector(
            ".dashboard-scroll-progress"
        );


    if (!progress) {
        return;
    }


    const updateProgress = () => {

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;


        if (documentHeight <= 0) {

            progress.style.width =
                "0%";

            return;

        }


        const current =
            window.scrollY;


        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    (current / documentHeight) * 100
                )
            );


        progress.style.width =
            `${percentage}%`;


        progress.style.setProperty(
            "--scroll-progress",
            `${percentage}%`
        );

    };


    window.addEventListener(
        "scroll",
        updateProgress,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        debounce(
            updateProgress,
            100
        )
    );


    updateProgress();

}


/*BACK TO TOP */

function initBackToTop() {

    const button =
        document.getElementById(
            "back-to-top"
        );


    if (!button) {
        return;
    }


    const updateVisibility = () => {

        if (window.scrollY > 450) {

            button.classList.add(
                "visible"
            );


            button.setAttribute(
                "aria-hidden",
                "false"
            );

        } else {

            button.classList.remove(
                "visible"
            );


            button.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    };


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior:
                    prefersReducedMotion()
                        ? "auto"
                        : "smooth"

            });

        }
    );


    window.addEventListener(
        "scroll",
        updateVisibility,
        {
            passive: true
        }
    );


    updateVisibility();

}


/*BUTTON RIPPLE EFFECT */

function initButtonRipples() {

    if (prefersReducedMotion()) {
        return;
    }


    const buttons =
        document.querySelectorAll(
            ".btn, .quick-action, .cc-editor-btn, .cc-problem-open"
        );


    buttons.forEach(button => {

        /*
         * Prevent duplicate initialization.
         */

        if (
            button.dataset.rippleInitialized === "true"
        ) {
            return;
        }


        button.dataset.rippleInitialized =
            "true";


        button.addEventListener(
            "click",
            event => {

                if (
                    button.disabled ||
                    button.getAttribute(
                        "aria-disabled"
                    ) === "true"
                ) {
                    return;
                }


                const rect =
                    button.getBoundingClientRect();


                const ripple =
                    document.createElement("span");


                ripple.className =
                    "cc-ripple";


                const size =
                    Math.max(
                        rect.width,
                        rect.height
                    );


                ripple.style.width =
                    `${size}px`;


                ripple.style.height =
                    `${size}px`;


                ripple.style.left =
                    `${event.clientX -
                    rect.left -
                    size / 2}px`;


                ripple.style.top =
                    `${event.clientY -
                    rect.top -
                    size / 2}px`;


                button.appendChild(ripple);


                window.setTimeout(
                    () => {

                        if (ripple.parentNode) {
                            ripple.remove();
                        }

                    },
                    650
                );

            }
        );

    });

}


/*ANIMATED COUNTERS */

function initAnimatedCounters() {

    const counters =
        document.querySelectorAll(
            "[data-count]"
        );


    if (!counters.length) {
        return;
    }


    if (prefersReducedMotion()) {

        counters.forEach(counter => {

            const value =
                parseFloat(
                    counter.dataset.count
                ) || 0;


            counter.textContent =
                formatCounterValue(
                    value,
                    counter
                );

        });

        return;
    }


    if (
        !("IntersectionObserver" in window)
    ) {

        counters.forEach(
            counter => {
                animateCounter(counter);
            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        animateCounter(
                            entry.target
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {

        observer.observe(counter);

    });

}


/*COUNTER ANIMATION */

function animateCounter(element) {

    if (
        element.dataset.counterAnimated ===
        "true"
    ) {
        return;
    }


    element.dataset.counterAnimated =
        "true";


    const target =
        parseFloat(
            element.dataset.count
        ) || 0;


    const duration =
        parseInt(
            element.dataset.duration,
            10
        ) || 1000;


    const decimals =
        target % 1 !== 0
            ? 1
            : 0;


    const startTime =
        performance.now();


    const update = currentTime => {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
         * Ease-out cubic.
         */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const current =
            target * eased;


        element.textContent =
            current.toFixed(
                decimals
            );


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        } else {

            element.textContent =
                formatCounterValue(
                    target,
                    element
                );

        }

    };


    requestAnimationFrame(
        update
    );

}


/*COUNTER FORMAT */

function formatCounterValue(
    value,
    element
) {

    const decimals =
        parseInt(
            element.dataset.decimals,
            10
        );


    if (!Number.isNaN(decimals)) {

        return value.toFixed(
            decimals
        );

    }


    if (
        Number.isInteger(value)
    ) {

        return value.toLocaleString();

    }


    return value.toFixed(1);

}


/*PROGRESS BARS */

function initProgressBars() {

    const bars =
        document.querySelectorAll(
            "[data-progress]"
        );


    if (!bars.length) {
        return;
    }


    bars.forEach(bar => {

        const value =
            Math.min(
                100,
                Math.max(
                    0,
                    parseFloat(
                        bar.dataset.progress
                    ) || 0
                )
            );


        if (
            !prefersReducedMotion()
        ) {

            bar.style.width =
                "0%";


            requestAnimationFrame(() => {

                window.setTimeout(() => {

                    bar.style.width =
                        `${value}%`;

                }, 100);

            });

        } else {

            bar.style.width =
                `${value}%`;

        }

    });

}


/*ACTIVE NAVIGATION */

function initActiveNavigation() {

    const links =
        document.querySelectorAll(
            ".app-sidebar a"
        );


    if (!links.length) {
        return;
    }


    const currentPath =
        window.location.pathname;


    links.forEach(link => {

        const href =
            link.getAttribute("href");


        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("javascript:")
        ) {
            return;
        }


        let linkPath;


        try {

            linkPath =
                new URL(
                    href,
                    window.location.origin
                ).pathname;

        } catch (error) {

            return;

        }


        /*
         * Do not override server-side
         * active navigation.
         */

        if (
            link.classList.contains("active")
        ) {
            return;
        }


        if (
            linkPath === currentPath
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}


/*KEYBOARD ACCESSIBILITY */

function initKeyboardAccessibility() {

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Escape closes custom modals.
             */

            if (
                event.key === "Escape"
            ) {

                closeCustomModals();

            }


            /*
             * Enter / Space activates
             * custom role buttons.
             */

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {
                return;
            }


            const element =
                event.target;


            if (
                element &&
                element.matches(
                    '[role="button"]'
                )
            ) {

                event.preventDefault();

                element.click();

            }

        }
    );

}


/*CUSTOM MODAL CLOSE */

function closeCustomModals() {

    const modals =
        document.querySelectorAll(
            ".custom-modal.open, .custom-modal.show"
        );


    modals.forEach(modal => {

        modal.classList.remove(
            "open",
            "show"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );

    });


    document.body.classList.remove(
        "no-scroll"
    );

}


/*REDUCED MOTION */

function prefersReducedMotion() {

    return (
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    );

}


/*DEBOUNCE */

function debounce(
    callback,
    delay = 200
) {

    let timeout;


    return function (...args) {

        window.clearTimeout(
            timeout
        );


        timeout =
            window.setTimeout(
                () => {

                    callback.apply(
                        this,
                        args
                    );

                },
                delay
            );

    };

}


/*THROTTLE */

function throttle(
    callback,
    delay = 100
) {

    let waiting = false;


    return function (...args) {

        if (waiting) {
            return;
        }


        callback.apply(
            this,
            args
        );


        waiting = true;


        window.setTimeout(
            () => {

                waiting = false;

            },
            delay
        );

    };

}


/*CSRF HELPER */

function getCSRFToken() {

    const meta =
        document.querySelector(
            'meta[name="csrf-token"]'
        );


    if (!meta) {
        return "";
    }


    return (
        meta.getAttribute(
            "content"
        ) || ""
    );

}


/*FETCH HELPER */

async function ccFetch(
    url,
    options = {}
) {

    const config = {
        ...options
    };


    config.headers = {
        ...(options.headers || {})
    };


    const csrfToken =
        getCSRFToken();


    const method =
        (
            options.method ||
            "GET"
        ).toUpperCase();


    /*
     * CSRF for state-changing requests.
     */

    if (
        csrfToken &&
        ![
            "GET",
            "HEAD",
            "OPTIONS"
        ].includes(method)
    ) {

        config.headers[
            "X-CSRFToken"
        ] = csrfToken;

    }


    /*
     * Automatically convert
     * plain objects to JSON.
     */

    if (
        config.body &&
        typeof config.body === "object" &&
        !(config.body instanceof FormData) &&
        !(config.body instanceof Blob)
    ) {

        config.headers[
            "Content-Type"
        ] = "application/json";


        config.body =
            JSON.stringify(
                config.body
            );

    }


    return fetch(
        url,
        config
    );

}


/*GLOBAL TOAST */

function showToast(
    message,
    type = "info",
    duration = 3500
) {

    let container =
        document.getElementById(
            "cc-toast-container"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );


        container.id =
            "cc-toast-container";


        container.className =
            "cc-toast-container";


        document.body.appendChild(
            container
        );

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `cc-toast cc-toast-${type}`;


    toast.innerHTML = `
   
           <div class="cc-toast-icon">
   
               <i class="fa-solid
                   fa-circle-info"></i>
   
           </div>
   
           <div class="cc-toast-message"></div>
   
           <button
               type="button"
               class="cc-toast-close"
               aria-label="Close notification"
           >
   
               <i class="fa-solid fa-xmark"></i>
   
           </button>
   
       `;


    const messageElement =
        toast.querySelector(
            ".cc-toast-message"
        );


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    const icon =
        toast.querySelector(
            ".cc-toast-icon i"
        );


    if (icon) {

        icon.className =
            getToastIcon(type);

    }


    container.appendChild(
        toast
    );


    requestAnimationFrame(() => {

        toast.classList.add(
            "show"
        );

    });


    let closed = false;


    const close = () => {

        if (closed) {
            return;
        }


        closed = true;


        toast.classList.remove(
            "show"
        );


        window.setTimeout(() => {

            if (
                toast.parentNode
            ) {

                toast.remove();

            }

        }, 250);

    };


    const closeButton =
        toast.querySelector(
            ".cc-toast-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            close
        );

    }


    window.setTimeout(
        close,
        duration
    );


    return toast;

}


/*TOAST ICON */

function getToastIcon(type) {

    switch (type) {

        case "success":

            return "fa-solid fa-circle-check";


        case "warning":

            return "fa-solid fa-triangle-exclamation";


        case "danger":

        case "error":

            return "fa-solid fa-circle-xmark";


        case "info":

        default:

            return "fa-solid fa-circle-info";

    }

}

/* MOBILE MENU BUTTON */

function initMobileMenuButton() {

    const menuButton =
        document.getElementById("mobile-menu-toggle");

    if (!menuButton) {
        return;
    }

    if (
        menuButton.dataset.menuInitialized === "true"
    ) {
        return;
    }

    menuButton.dataset.menuInitialized = "true";


    /* Keep accessible label in sync */

    const updateMenuState = () => {

        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";


        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    };


    /* Watch aria-expanded changes */

    const observer =
        new MutationObserver(() => {

            updateMenuState();

        });


    observer.observe(
        menuButton,
        {
            attributes: true,
            attributeFilter: ["aria-expanded"]
        }
    );


    /* Touch feedback */

    menuButton.addEventListener(
        "pointerdown",
        () => {

            if (prefersReducedMotion()) {
                return;
            }

            menuButton.classList.add(
                "menu-press"
            );

        }
    );


    menuButton.addEventListener(
        "pointerup",
        () => {

            menuButton.classList.remove(
                "menu-press"
            );

        }
    );


    menuButton.addEventListener(
        "pointercancel",
        () => {

            menuButton.classList.remove(
                "menu-press"
            );

        }
    );


    menuButton.addEventListener(
        "pointerleave",
        () => {

            menuButton.classList.remove(
                "menu-press"
            );

        }
    );


    /* Initial state */

    updateMenuState();

}


/*WINDOW GLOBAL */

window.CareerCompass = {

    dismissAlert,

    updatePasswordStrength,

    debounce,

    throttle,

    prefersReducedMotion,

    getCSRFToken,

    ccFetch,

    showToast,

    animateCounter,

    closeCustomModals

};

