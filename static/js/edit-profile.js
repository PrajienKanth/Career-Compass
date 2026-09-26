/* CAREER COMPASS - EDIT PROFILE */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* HELPERS */

    const reducedMotion =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    function qs(selector, parent = document) {
        return parent.querySelector(selector);
    }


    function qsa(selector, parent = document) {
        return Array.from(
            parent.querySelectorAll(selector)
        );
    }


    /* SCROLL REVEAL */

    function initScrollReveal() {

        const elements =
            qsa(".reveal, .reveal-small");

        if (!elements.length) {
            return;
        }


        if (reducedMotion) {

            elements.forEach(function (element) {

                element.classList.add(
                    "revealed"
                );

            });

            return;
        }


        if (!("IntersectionObserver" in window)) {

            elements.forEach(function (element) {

                element.classList.add(
                    "revealed"
                );

            });

            return;
        }


        const observer =
            new IntersectionObserver(
                function (entries, obs) {

                    entries.forEach(function (entry) {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.classList.add(
                            "revealed"
                        );


                        obs.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -45px 0px"
                }
            );


        elements.forEach(function (element, index) {

            if (
                element.classList.contains(
                    "reveal-small"
                )
            ) {

                element.style.transitionDelay =
                    `${Math.min(index * 45, 350)}ms`;

            }


            observer.observe(element);

        });

    }


    /* SKILLS */

    const LEVEL_NAMES = [
        "Not Proficient",
        "Beginner",
        "Intermediate",
        "Advanced",
        "Expert",
        "Master"
    ];


    function updateSkill(
        range,
        animate = false
    ) {

        if (!range) {
            return;
        }


        const card =
            range.closest(".skill-input");


        const selectId =
            range.dataset.selectId;


        const select =
            selectId
                ? document.getElementById(selectId)
                : null;


        let value =
            parseInt(
                range.value,
                10
            );


        if (Number.isNaN(value)) {
            value = 0;
        }


        value =
            Math.max(
                0,
                Math.min(5, value)
            );


        range.value =
            value;


        /* Keep WTForms select synchronized */

        if (select) {

            select.value =
                String(value);

        }


        /* Progress */

        const percentage =
            (value / 5) * 100;


        range.style.setProperty(
            "--skill-progress",
            `${percentage}%`
        );


        /* Card level */

        if (card) {

            card.dataset.level =
                String(value);

        }


        /* Current value */

        const valueElement =
            document.getElementById(
                `${range.id}-value`
            );


        if (valueElement) {

            const newValue =
                `${value}/5`;


            if (
                animate &&
                valueElement.textContent.trim() !== newValue
            ) {

                valueElement.classList.remove(
                    "value-pop"
                );


                void valueElement.offsetWidth;


                valueElement.classList.add(
                    "value-pop"
                );

            }


            valueElement.textContent =
                newValue;

        }


        /* Level */

        const levelElement =
            document.getElementById(
                `${range.id}-level`
            );


        if (levelElement) {

            const newLevel =
                LEVEL_NAMES[value];


            if (
                animate &&
                levelElement.textContent.trim() !== newLevel
            ) {

                levelElement.classList.remove(
                    "level-changing"
                );


                void levelElement.offsetWidth;


                levelElement.textContent =
                    newLevel;


                levelElement.classList.add(
                    "level-changing"
                );

            } else {

                levelElement.textContent =
                    newLevel;

            }

        }


        /* Markers */

        const markerContainer =
            range
                .closest(
                    ".skill-range-wrapper"
                )
                ?.querySelector(
                    ".range-markers"
                );


        if (markerContainer) {

            markerContainer
                .querySelectorAll("span")
                .forEach(
                    function (marker, index) {

                        marker.classList.toggle(
                            "active",
                            index <= value
                        );

                    }
                );

        }

    }


    function initializeSkills() {

        const ranges =
            qsa(".skill-range");


        if (!ranges.length) {
            return;
        }


        ranges.forEach(function (range) {

            const selectId =
                range.dataset.selectId;


            const select =
                selectId
                    ? document.getElementById(
                        selectId
                    )
                    : null;


            /*
             * If WTForms select already has a
             * value, use it as the source.
             */

            if (
                select &&
                select.value !== ""
            ) {

                range.value =
                    select.value;

            }


            updateSkill(
                range,
                false
            );


            /* Range input */

            range.addEventListener(
                "input",
                function () {

                    updateSkill(
                        range,
                        true
                    );

                }
            );


            range.addEventListener(
                "change",
                function () {

                    updateSkill(
                        range,
                        false
                    );

                }
            );


            /* Keyboard support */

            range.addEventListener(
                "keydown",
                function (event) {

                    let value =
                        parseInt(
                            range.value,
                            10
                        ) || 0;


                    if (
                        event.key === "ArrowRight" ||
                        event.key === "ArrowUp"
                    ) {

                        event.preventDefault();


                        value =
                            Math.min(
                                value + 1,
                                5
                            );


                        range.value =
                            value;


                        updateSkill(
                            range,
                            true
                        );

                    }


                    if (
                        event.key === "ArrowLeft" ||
                        event.key === "ArrowDown"
                    ) {

                        event.preventDefault();


                        value =
                            Math.max(
                                value - 1,
                                0
                            );


                        range.value =
                            value;


                        updateSkill(
                            range,
                            true
                        );

                    }


                    if (event.key === "Home") {

                        event.preventDefault();


                        range.value =
                            0;


                        updateSkill(
                            range,
                            true
                        );

                    }


                    if (event.key === "End") {

                        event.preventDefault();


                        range.value =
                            5;


                        updateSkill(
                            range,
                            true
                        );

                    }

                }
            );


            /* Dropdown → range */

            if (select) {

                select.addEventListener(
                    "change",
                    function () {

                        range.value =
                            this.value || 0;


                        updateSkill(
                            range,
                            true
                        );

                    }
                );

            }


            /* Clickable markers */

            const markerContainer =
                range
                    .closest(
                        ".skill-range-wrapper"
                    )
                    ?.querySelector(
                        ".range-markers"
                    );


            if (markerContainer) {

                const markers =
                    markerContainer.querySelectorAll(
                        "span"
                    );


                markers.forEach(
                    function (marker, index) {

                        marker.setAttribute(
                            "role",
                            "button"
                        );


                        marker.setAttribute(
                            "tabindex",
                            "0"
                        );


                        marker.setAttribute(
                            "aria-label",
                            `Set skill level to ${index}`
                        );


                        function selectLevel() {

                            range.value =
                                index;


                            updateSkill(
                                range,
                                true
                            );


                            range.focus();

                        }


                        marker.addEventListener(
                            "click",
                            selectLevel
                        );


                        marker.addEventListener(
                            "keydown",
                            function (event) {

                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {

                                    event.preventDefault();


                                    selectLevel();

                                }

                            }
                        );

                    }
                );

            }

        });

    }


    /* SKILL POINTER EFFECT */

    function initSkillPointerEffect() {

        if (reducedMotion) {
            return;
        }


        if (
            window.matchMedia(
                "(hover: none)"
            ).matches
        ) {
            return;
        }


        qsa(".skill-input")
            .forEach(function (card) {

                card.addEventListener(
                    "pointermove",
                    function (event) {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            (
                                (event.clientX -
                                    rect.left) /
                                rect.width
                            ) * 100;


                        const y =
                            (
                                (event.clientY -
                                    rect.top) /
                                rect.height
                            ) * 100;


                        card.style.setProperty(
                            "--pointer-x",
                            `${x}%`
                        );


                        card.style.setProperty(
                            "--pointer-y",
                            `${y}%`
                        );

                    }
                );


                card.addEventListener(
                    "pointerleave",
                    function () {

                        card.style.setProperty(
                            "--pointer-x",
                            "50%"
                        );


                        card.style.setProperty(
                            "--pointer-y",
                            "50%"
                        );

                    }
                );

            });

    }


    /* DATE PICKER */

    function initDatePicker() {

        const input =
            qs(
                'input[name="date_of_birth"]'
            );


        const button =
            qs("#openDatePicker");


        if (!input) {
            return;
        }


        /*
         * Make the complete field clickable.
         */

        const wrapper =
            input.closest(
                ".premium-date-wrapper"
            );


        if (wrapper) {

            wrapper.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target.closest(
                            ".date-picker-button"
                        )
                    ) {
                        return;
                    }


                    openPicker();

                }
            );

        }


        function openPicker() {

            try {

                if (
                    typeof input.showPicker ===
                    "function"
                ) {

                    input.showPicker();

                } else {

                    input.focus();
                    input.click();

                }

            } catch (error) {

                input.focus();

            }

        }


        if (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    openPicker();

                }
            );

        }

    }


    /* PROFILE PHOTO */

    function initPhotoPreview() {

        const photoInput =
            qs(
                'input[type="file"][name="profile_photo"]'
            );


        const uploadPreview =
            qs("#photoUploadPreview");


        const mainPreview =
            qs("#profilePreview");


        const fileName =
            qs("#photoFileName");


        const dropZone =
            qs("#photoDropZone");


        if (!photoInput) {
            return;
        }


        let currentImageUrl =
            null;


        let objectUrl =
            null;


        function updatePreview(
            container,
            imageUrl,
            altText
        ) {

            if (!container) {
                return;
            }


            container.innerHTML = "";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                imageUrl;


            image.alt =
                altText;


            container.appendChild(
                image
            );

        }


        function showImage(file) {

            if (!file) {
                return;
            }


            /* File validation */

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                if (fileName) {

                    fileName.textContent =
                        "Please select an image file.";

                }


                photoInput.value = "";

                return;

            }


            /* Size validation */

            const maxSize =
                5 * 1024 * 1024;


            if (file.size > maxSize) {

                if (fileName) {

                    fileName.textContent =
                        "Image is larger than 5 MB.";

                }


                photoInput.value = "";

                return;

            }


            if (fileName) {

                fileName.textContent =
                    file.name;

            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    currentImageUrl =
                        event.target.result;


                    updatePreview(
                        uploadPreview,
                        currentImageUrl,
                        "Uploaded profile photo"
                    );


                    updatePreview(
                        mainPreview,
                        currentImageUrl,
                        "Profile preview"
                    );


                    resetPhotoAdjustment();


                    if (
                        typeof window.updateProfileCompletion ===
                        "function"
                    ) {

                        window.updateProfileCompletion();

                    }


                    /*
                     * Small entrance animation.
                     */

                    if (
                        !reducedMotion &&
                        uploadPreview
                    ) {

                        uploadPreview.classList.remove(
                            "photo-image-enter"
                        );


                        void uploadPreview.offsetWidth;


                        uploadPreview.classList.add(
                            "photo-image-enter"
                        );

                    }

                };


            reader.readAsDataURL(file);

        }


        /* File selection */

        photoInput.addEventListener(
            "change",
            function () {

                const file =
                    this.files &&
                    this.files[0];


                showImage(file);

            }
        );


        /* Drag and drop */

        if (dropZone) {

            [
                "dragenter",
                "dragover"
            ].forEach(function (eventName) {

                dropZone.addEventListener(
                    eventName,
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        dropZone.classList.add(
                            "dragging"
                        );

                    }
                );

            });


            [
                "dragleave",
                "drop"
            ].forEach(function (eventName) {

                dropZone.addEventListener(
                    eventName,
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        dropZone.classList.remove(
                            "dragging"
                        );

                    }
                );

            });


            dropZone.addEventListener(
                "drop",
                function (event) {

                    const files =
                        event.dataTransfer &&
                        event.dataTransfer.files;


                    if (
                        !files ||
                        !files.length
                    ) {
                        return;
                    }


                    const file =
                        files[0];


                    try {

                        const dataTransfer =
                            new DataTransfer();


                        dataTransfer.items.add(
                            file
                        );


                        photoInput.files =
                            dataTransfer.files;

                    } catch (error) {

                        /* Browser does not support file assignment */

                    }


                    showImage(file);

                }
            );

        }


        /* PHOTO ADJUSTMENT */

        const zoom =
            qs("#photoZoom");


        const positionX =
            qs("#photoPositionX");


        const positionY =
            qs("#photoPositionY");


        const zoomValue =
            qs("#photoZoomValue");


        const positionXValue =
            qs("#photoPositionXValue");


        const positionYValue =
            qs("#photoPositionYValue");


        const resetButton =
            qs("#resetPhotoAdjustment");


        function getPreviewImage() {

            if (!uploadPreview) {
                return null;
            }


            return qs(
                "img",
                uploadPreview
            );

        }


        function updatePhotoTransform() {

            const image =
                getPreviewImage();


            if (!image) {
                return;
            }


            const zoomAmount =
                parseInt(
                    zoom?.value || 100,
                    10
                );


            const x =
                parseInt(
                    positionX?.value || 0,
                    10
                );


            const y =
                parseInt(
                    positionY?.value || 0,
                    10
                );


            const scale =
                zoomAmount / 100;


            image.style.setProperty(
                "--photo-scale",
                scale
            );


            image.style.setProperty(
                "--photo-x",
                `${x / 2}%`
            );


            image.style.setProperty(
                "--photo-y",
                `${y / 2}%`
            );


            if (zoomValue) {

                zoomValue.textContent =
                    `${zoomAmount}%`;

            }


            if (positionXValue) {

                positionXValue.textContent =
                    x > 0
                        ? `+${x}`
                        : String(x);

            }


            if (positionYValue) {

                positionYValue.textContent =
                    y > 0
                        ? `+${y}`
                        : String(y);

            }

        }


        function resetPhotoAdjustment() {

            if (zoom) {
                zoom.value = 100;
            }


            if (positionX) {
                positionX.value = 0;
            }


            if (positionY) {
                positionY.value = 0;
            }


            updatePhotoTransform();

        }


        if (zoom) {

            zoom.addEventListener(
                "input",
                updatePhotoTransform
            );

        }


        if (positionX) {

            positionX.addEventListener(
                "input",
                updatePhotoTransform
            );

        }


        if (positionY) {

            positionY.addEventListener(
                "input",
                updatePhotoTransform
            );

        }


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                function () {

                    resetPhotoAdjustment();

                }
            );

        }


        /*
         * Initialize adjustment for an
         * already existing profile image.
         */

        updatePhotoTransform();

    }


    /* PROFILE COMPLETION */

    function initCompletion() {

        const completionText =
            qs("#previewCompletion");


        const completionBar =
            qs("#previewCompletionBar");


        if (
            !completionText ||
            !completionBar
        ) {
            return;
        }


        const form =
            qs("#editProfileForm");


        if (!form) {
            return;
        }


        function hasValue(selector) {

            const element =
                qs(
                    selector,
                    form
                );


            return !!(
                element &&
                String(
                    element.value || ""
                ).trim()
            );

        }


        window.updateProfileCompletion =
            calculateCompletion;


        function calculateCompletion() {

            let score = 0;


            /* Username */

            if (
                hasValue(
                    '[name="username"]'
                )
            ) {

                score += 15;

            }


            /* Email */

            if (
                hasValue(
                    '[name="email"]'
                )
            ) {

                score += 15;

            }


            /* Profile photo */

            const photoInput =
                qs(
                    '[name="profile_photo"]',
                    form
                );


            const currentPhoto =
                qs(
                    "#profilePreview img"
                );


            if (
                (
                    photoInput &&
                    photoInput.files &&
                    photoInput.files.length
                ) ||
                currentPhoto
            ) {

                score += 10;

            }


            /* Date of birth */

            if (
                hasValue(
                    '[name="date_of_birth"]'
                )
            ) {

                score += 10;

            }


            /* Academic domain */

            if (
                hasValue(
                    '[name="academic_domain"]'
                )
            ) {

                score += 15;

            }


            /* Specialization */

            if (
                hasValue(
                    '[name="specialization"]'
                )
            ) {

                score += 15;

            }


            /* Hobbies */

            if (
                hasValue(
                    '[name="hobbies"]'
                )
            ) {

                score += 5;

            }


            /* Extracurricular */

            if (
                hasValue(
                    '[name="extracurricular"]'
                )
            ) {

                score += 5;

            }


            /* Sports */

            if (
                hasValue(
                    '[name="sports_achievements"]'
                )
            ) {

                score += 5;

            }


            score =
                Math.min(
                    score,
                    100
                );


            completionText.textContent =
                `${score}%`;


            if (reducedMotion) {

                completionBar.style.width =
                    `${score}%`;

            } else {

                requestAnimationFrame(
                    function () {

                        completionBar.style.width =
                            `${score}%`;

                    }
                );

            }

        }


        /* Watch form fields */

        qsa(
            "input, textarea, select",
            form
        ).forEach(function (field) {

            field.addEventListener(
                "input",
                calculateCompletion
            );


            field.addEventListener(
                "change",
                calculateCompletion
            );

        });


        calculateCompletion();

    }


    /* UNSAVED CHANGES */

    function initUnsavedChanges() {

        const form =
            qs("#editProfileForm");


        if (!form) {
            return;
        }


        let changed = false;


        form.addEventListener(
            "input",
            function () {

                changed = true;

            }
        );


        form.addEventListener(
            "change",
            function () {

                changed = true;

            }
        );


        form.addEventListener(
            "submit",
            function () {

                changed = false;

            }
        );


        qsa(
            ".btn-cancel"
        ).forEach(function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    if (!changed) {
                        return;
                    }


                    const leave =
                        window.confirm(
                            "You have unsaved changes. Leave this page?"
                        );


                    if (!leave) {

                        event.preventDefault();

                    }

                }
            );

        });


        window.addEventListener(
            "beforeunload",
            function (event) {

                if (!changed) {
                    return;
                }


                event.preventDefault();

                event.returnValue = "";

            }
        );

    }


    /* SAVE BUTTON */

    function initSaveButton() {

        const form =
            qs("#editProfileForm");


        const button =
            qs("#saveProfileButton");


        if (
            !form ||
            !button
        ) {
            return;
        }


        form.addEventListener(
            "submit",
            function () {

                button.classList.add(
                    "is-loading"
                );


                button.setAttribute(
                    "aria-disabled",
                    "true"
                );


                button.disabled =
                    true;

            }
        );

    }


    /* INPUT FOCUS EFFECT */

    function initInputEffects() {

        qsa(
            ".form-control"
        ).forEach(function (input) {

            input.addEventListener(
                "focus",
                function () {

                    const wrapper =
                        this.closest(
                            ".field-wrapper"
                        );


                    if (wrapper) {

                        wrapper.classList.add(
                            "field-focused"
                        );

                    }

                }
            );


            input.addEventListener(
                "blur",
                function () {

                    const wrapper =
                        this.closest(
                            ".field-wrapper"
                        );


                    if (wrapper) {

                        wrapper.classList.remove(
                            "field-focused"
                        );

                    }

                }
            );

        });

    }


    /* PREMIUM DATE INPUT EFFECT */

    function initDateInputEffects() {

        const input =
            qs(
                'input[name="date_of_birth"]'
            );


        if (!input) {
            return;
        }


        input.addEventListener(
            "change",
            function () {

                const wrapper =
                    input.closest(
                        ".premium-date-wrapper"
                    );


                if (!wrapper) {
                    return;
                }


                wrapper.classList.remove(
                    "date-selected"
                );


                void wrapper.offsetWidth;


                wrapper.classList.add(
                    "date-selected"
                );

            }
        );

    }


    /* BUTTON RIPPLE */

    function initButtonRipple() {

        if (reducedMotion) {
            return;
        }


        qsa(
            ".btn-save, .btn-cancel, .file-select-button, .photo-change-button, .photo-reset-button, .date-picker-button"
        ).forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    const rect =
                        button.getBoundingClientRect();


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


                    ripple.style.borderRadius =
                        "50%";


                    ripple.style.background =
                        "rgba(255,255,255,.18)";


                    ripple.style.pointerEvents =
                        "none";


                    ripple.style.transform =
                        "scale(0)";


                    ripple.style.opacity =
                        "1";


                    ripple.style.transition =
                        "transform .55s ease, opacity .55s ease";


                    ripple.style.zIndex =
                        "10";


                    button.style.position =
                        "relative";


                    button.style.overflow =
                        "hidden";


                    button.appendChild(
                        ripple
                    );


                    requestAnimationFrame(
                        function () {

                            ripple.style.transform =
                                "scale(1.8)";


                            ripple.style.opacity =
                                "0";

                        }
                    );


                    window.setTimeout(
                        function () {

                            ripple.remove();

                        },
                        600
                    );

                }
            );

        });

    }


    /* PHOTO DRAG CURSOR */

    function initPhotoEditorHover() {

        if (reducedMotion) {
            return;
        }


        const editor =
            qs(".premium-photo-editor");


        if (!editor) {
            return;
        }


        editor.addEventListener(
            "pointermove",
            function (event) {

                const rect =
                    editor.getBoundingClientRect();


                const x =
                    (
                        (event.clientX -
                            rect.left) /
                        rect.width
                    ) * 100;


                const y =
                    (
                        (event.clientY -
                            rect.top) /
                        rect.height
                    ) * 100;


                editor.style.setProperty(
                    "--photo-pointer-x",
                    `${x}%`
                );


                editor.style.setProperty(
                    "--photo-pointer-y",
                    `${y}%`
                );

            }
        );


        editor.addEventListener(
            "pointerleave",
            function () {

                editor.style.setProperty(
                    "--photo-pointer-x",
                    "50%"
                );


                editor.style.setProperty(
                    "--photo-pointer-y",
                    "50%"
                );

            }
        );

    }


    /* INITIALIZE */

    initScrollReveal();

    initPhotoPreview();

    initCompletion();

    initUnsavedChanges();

    initSaveButton();

    initInputEffects();

    initDateInputEffects();

    initDatePicker();

    initSkillPointerEffect();

    initButtonRipple();

    initPhotoEditorHover();

    initializeSkills();

});