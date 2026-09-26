/* CAREER COMPASS — SOLVE PROBLEM */

(function () {

    "use strict";


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            /* DOM */

            const form =
                document.getElementById(
                    "solution-form"
                );

            const language =
                document.getElementById(
                    "language"
                );

            const actionField =
                document.getElementById(
                    "action"
                );

            const runButton =
                document.getElementById(
                    "run-code"
                );

            const submitButton =
                document.getElementById(
                    "submit-code"
                );

            const status =
                document.getElementById(
                    "editor-file-status"
                );

            const hint =
                document.getElementById(
                    "editor-hint"
                );

            const output =
                document.getElementById(
                    "code-output"
                );

            const editorTextarea =
                document.getElementById(
                    "code-editor"
                );


            if (!form || !language) {
                return;
            }


            /* SETTINGS */

            const reduceMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;


            /* SUPPORTED LANGUAGES */

            const LANGUAGE_CONFIG = {

                python: {
                    label: "Python",
                    mode: "python",
                    fileExtension: "py",
                    hint:
                        "Python test input is available through test_input."
                },

                javascript: {
                    label: "JavaScript",
                    mode: "javascript",
                    fileExtension: "js",
                    hint:
                        "JavaScript test input is available through testInput."
                },

                java: {
                    label: "Java",
                    mode: "text/x-java",
                    fileExtension: "java",
                    hint:
                        "Java solutions run through the Main class."
                },

                c: {
                    label: "C",
                    mode: "text/x-csrc",
                    fileExtension: "c",
                    hint:
                        "C solutions are compiled with GCC before execution."
                }

            };


            /* CODE EDITOR */

            let editor =
                window.codeEditor || null;

            let isSubmitting = false;

            let currentLanguage =
                language.value || "python";


            /* STARTER CODES */

            const starterCodes =
                window.CC_CODE_STARTERS || {};


            /* PER-LANGUAGE DRAFTS */

            const languageDrafts = {};


            /* PER-LANGUAGE STARTERS */

            const languageStarters = {};


            /* GET CURRENT LANGUAGE */

            function getCurrentLanguage() {

                const selected =
                    (
                        language.value ||
                        "python"
                    )
                    .toLowerCase()
                    .trim();


                if (
                    LANGUAGE_CONFIG[
                        selected
                    ]
                ) {

                    return selected;

                }


                return "python";

            }


            /* GET STARTER CODE */

            function getStarterCode(
                selectedLanguage
            ) {

                selectedLanguage =
                    selectedLanguage ||
                    getCurrentLanguage();


                return (
                    starterCodes[
                        selectedLanguage
                    ] || ""
                );

            }


            /* GET EDITOR VALUE */

            function getEditorValue() {

                if (editor) {

                    return editor.getValue();

                }


                if (editorTextarea) {

                    return editorTextarea.value;

                }


                return "";

            }


            /* SET EDITOR VALUE */

            function setEditorValue(
                value
            ) {

                value =
                    typeof value === "string"
                        ? value
                        : "";


                if (editor) {

                    /*
                     * CodeMirror setValue()
                     * triggers a change event.
                     *
                     * isSubmitting prevents
                     * unwanted Modified state
                     * while submitting.
                     */

                    editor.setValue(
                        value
                    );

                } else if (editorTextarea) {

                    editorTextarea.value =
                        value;

                }

            }


            /* SAVE EDITOR */

            function saveEditor() {

                if (
                    editor &&
                    typeof editor.save ===
                    "function"
                ) {

                    editor.save();

                }

            }


            /* EDITOR STATUS */

            function setStatus(
                text
            ) {

                if (!status) {
                    return;
                }


                const indicator =
                    status.querySelector(
                        "span"
                    );


                if (indicator) {

                    indicator.classList.toggle(
                        "is-dirty",
                        text === "Modified"
                    );

                }


                /*
                 * Remove old text nodes.
                 * Keep the indicator span.
                 */

                Array.from(
                    status.childNodes
                ).forEach(
                    function (node) {

                        if (
                            node.nodeType ===
                            Node.TEXT_NODE
                        ) {

                            node.remove();

                        }

                    }
                );


                status.appendChild(
                    document.createTextNode(
                        " " + text
                    )
                );

            }


            /* GET LANGUAGE CONFIG */

            function getLanguageConfig(
                selectedLanguage
            ) {

                return (
                    LANGUAGE_CONFIG[
                        selectedLanguage
                    ] ||
                    LANGUAGE_CONFIG.python
                );

            }


            /* UPDATE LANGUAGE HINT */

            function updateLanguageHint() {

                if (!hint) {
                    return;
                }


                const selected =
                    getCurrentLanguage();


                const config =
                    getLanguageConfig(
                        selected
                    );


                hint.textContent =
                    config.hint;

            }


            /* UPDATE FILE NAME */

            function updateFileName() {

                const fileName =
                    document.querySelector(
                        ".cc-file-name"
                    );


                if (!fileName) {
                    return;
                }


                const selected =
                    getCurrentLanguage();


                const config =
                    getLanguageConfig(
                        selected
                    );


                fileName.textContent =
                    "solution." +
                    config.fileExtension;

            }


            /* CODEMIRROR MODE */

            const modeScripts = {

                python:
                    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js",

                javascript:
                    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js",

                java:
                    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/clike/clike.min.js",

                c:
                    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/clike/clike.min.js"

            };


            const loadedModeScripts =
                {};


            /* LOAD CODEMIRROR MODE SCRIPT */

            function loadModeScript(
                selectedLanguage
            ) {

                return new Promise(
                    function (resolve) {

                        /*
                         * CodeMirror unavailable.
                         */

                        if (
                            typeof CodeMirror ===
                            "undefined"
                        ) {

                            resolve(false);

                            return;

                        }


                        const scriptUrl =
                            modeScripts[
                                selectedLanguage
                            ];


                        /*
                         * No script required.
                         */

                        if (!scriptUrl) {

                            resolve(false);

                            return;

                        }


                        /*
                         * Already loaded.
                         */

                        if (
                            loadedModeScripts[
                                scriptUrl
                            ]
                        ) {

                            resolve(true);

                            return;

                        }


                        /*
                         * Check existing script.
                         */

                        const existing =
                            document.querySelector(
                                `script[src="${scriptUrl}"]`
                            );


                        if (existing) {

                            loadedModeScripts[
                                scriptUrl
                            ] = true;

                            resolve(true);

                            return;

                        }


                        /*
                         * Load mode.
                         */

                        const script =
                            document.createElement(
                                "script"
                            );


                        script.src =
                            scriptUrl;

                        script.async = true;


                        script.onload =
                            function () {

                                loadedModeScripts[
                                    scriptUrl
                                ] = true;

                                resolve(true);

                            };


                        script.onerror =
                            function () {

                                console.warn(
                                    "Could not load CodeMirror mode:",
                                    selectedLanguage
                                );

                                resolve(false);

                            };


                        document.head.appendChild(
                            script
                        );

                    }
                );

            }


            /* UPDATE CODEMIRROR MODE */

            async function updateEditorMode() {

                if (
                    !editor ||
                    typeof editor.setOption !==
                    "function"
                ) {

                    return;

                }


                const selected =
                    getCurrentLanguage();


                const config =
                    getLanguageConfig(
                        selected
                    );


                await loadModeScript(
                    selected
                );


                try {

                    editor.setOption(
                        "mode",
                        config.mode
                    );

                } catch (error) {

                    console.warn(
                        "Could not change CodeMirror mode:",
                        error
                    );

                }


                /*
                 * CodeMirror sometimes needs a
                 * refresh after dynamically loading
                 * a mode.
                 */

                if (
                    typeof editor.refresh ===
                    "function"
                ) {

                    setTimeout(
                        function () {

                            editor.refresh();

                        },
                        50
                    );

                }

            }


            /* SAVE CURRENT LANGUAGE DRAFT */

            function saveCurrentDraft() {

                const selected =
                    getCurrentLanguage();


                languageDrafts[
                    selected
                ] =
                    getEditorValue();

            }


            /* LOAD LANGUAGE STARTER */

            function loadLanguageStarter(
                selectedLanguage
            ) {

                const starter =
                    getStarterCode(
                        selectedLanguage
                    );


                languageStarters[
                    selectedLanguage
                ] =
                    starter;


                return starter;

            }


            /* LOAD LANGUAGE CODE */

            function loadLanguageCode(
                selectedLanguage
            ) {

                const starter =
                    loadLanguageStarter(
                        selectedLanguage
                    );


                /*
                 * If the user has already written
                 * code in this language, restore it.
                 */

                if (
                    Object.prototype.hasOwnProperty.call(
                        languageDrafts,
                        selectedLanguage
                    )
                ) {

                    const savedCode =
                        languageDrafts[
                            selectedLanguage
                        ];


                    setEditorValue(
                        savedCode
                    );


                    if (
                        savedCode === starter
                    ) {

                        setStatus(
                            "Ready"
                        );

                    } else {

                        setStatus(
                            "Modified"
                        );

                    }


                    return;

                }


                /*
                 * First time selecting this
                 * language → load its starter.
                 */

                setEditorValue(
                    starter
                );


                languageDrafts[
                    selectedLanguage
                ] =
                    starter;


                setStatus(
                    "Ready"
                );

            }


            /* INITIAL STARTER */

            function initializeStarter() {

                const selected =
                    getCurrentLanguage();


                const starter =
                    getStarterCode(
                        selected
                    );


                languageStarters[
                    selected
                ] =
                    starter;


                const current =
                    getEditorValue();


                /*
                 * If Flask already provided code,
                 * preserve it.
                 */

                if (
                    current.trim()
                ) {

                    languageDrafts[
                        selected
                    ] =
                        current;

                    setStatus(
                        current === starter
                            ? "Ready"
                            : "Modified"
                    );


                    return;

                }


                /*
                 * Empty editor → load starter.
                 */

                setEditorValue(
                    starter
                );


                languageDrafts[
                    selected
                ] =
                    starter;


                setStatus(
                    "Ready"
                );

            }


            /* MARK MODIFIED */

            function markModified() {

                if (isSubmitting) {
                    return;
                }


                const selected =
                    getCurrentLanguage();


                const current =
                    getEditorValue();


                const starter =
                    languageStarters[
                        selected
                    ] ??
                    getStarterCode(
                        selected
                    );


                /*
                 * Keep the latest code for
                 * this language.
                 */

                languageDrafts[
                    selected
                ] =
                    current;


                if (
                    current === starter
                ) {

                    setStatus(
                        "Ready"
                    );

                } else {

                    setStatus(
                        "Modified"
                    );

                }

            }


            /* EDITOR CHANGE */

            if (editor) {

                editor.on(
                    "change",
                    markModified
                );

            } else if (editorTextarea) {

                editorTextarea.addEventListener(
                    "input",
                    markModified
                );

            }


            /* LANGUAGE CHANGE */

            language.addEventListener(
                "change",
                async function () {

                    if (isSubmitting) {
                        return;
                    }


                    const nextLanguage =
                        getCurrentLanguage();


                    /*
                     * Save the current language
                     * before switching.
                     */

                    saveCurrentDraft();


                    /*
                     * Update current language.
                     */

                    currentLanguage =
                        nextLanguage;


                    /*
                     * Load the correct starter
                     * or previously typed code.
                     */

                    loadLanguageCode(
                        nextLanguage
                    );


                    /*
                     * Update UI.
                     */

                    updateLanguageHint();

                    updateFileName();


                    /*
                     * Change syntax highlighting.
                     */

                    await updateEditorMode();


                    /*
                     * Focus editor.
                     */

                    if (
                        editor &&
                        typeof editor.focus ===
                        "function"
                    ) {

                        setTimeout(
                            function () {

                                editor.focus();

                            },
                            80
                        );

                    }

                }
            );


            /* SET ACTION */

            function setAction(
                action
            ) {

                if (!actionField) {
                    return;
                }


                actionField.value =
                    action;

            }


            /* BUTTON LOADING — RUN */

            function setRunLoading() {

                if (!runButton) {
                    return;
                }


                runButton.disabled =
                    true;


                runButton.innerHTML =
                    `
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Running...</span>
                    `;

            }


            /* BUTTON LOADING — SUBMIT */

            function setSubmitLoading() {

                if (!submitButton) {
                    return;
                }


                submitButton.disabled =
                    true;


                submitButton.innerHTML =
                    `
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Submitting...</span>
                    `;

            }


            /* PREPARE SUBMISSION */

            function prepareSubmission(
                action
            ) {

                /*
                 * Save CodeMirror content back
                 * into the textarea.
                 */

                saveEditor();


                /*
                 * Save current language draft.
                 */

                saveCurrentDraft();


                /*
                 * Set Run / Submit.
                 */

                setAction(
                    action
                );


                /*
                 * Make sure the selected language
                 * is one of our four languages.
                 */

                const selected =
                    getCurrentLanguage();


                if (
                    !LANGUAGE_CONFIG[
                        selected
                    ]
                ) {

                    language.value =
                        "python";

                }

            }


            /* RUN */

            if (runButton) {

                runButton.addEventListener(
                    "click",
                    function () {

                        if (isSubmitting) {
                            return;
                        }


                        isSubmitting =
                            true;


                        prepareSubmission(
                            "run"
                        );


                        setStatus(
                            "Running"
                        );


                        setRunLoading();


                        /*
                         * Native form submit.
                         */

                        form.submit();

                    }
                );

            }


            /* SUBMIT */

            if (submitButton) {

                submitButton.addEventListener(
                    "click",
                    function () {

                        if (isSubmitting) {
                            return;
                        }


                        isSubmitting =
                            true;


                        prepareSubmission(
                            "submit"
                        );


                        setStatus(
                            "Submitting"
                        );


                        setSubmitLoading();

                    }
                );

            }


            /* FORM SUBMIT SAFETY */

            form.addEventListener(
                "submit",
                function () {

                    saveEditor();

                    saveCurrentDraft();


                    if (!actionField) {
                        return;
                    }


                    if (
                        !actionField.value
                    ) {

                        actionField.value =
                            "submit";

                    }

                }
            );


            /* EXAMPLE TOGGLES */

            document
                .querySelectorAll(
                    ".show-example-btn"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                const targetId =
                                    this.dataset.target;


                                const target =
                                    document.getElementById(
                                        targetId
                                    );


                                if (!target) {
                                    return;
                                }


                                const isOpen =
                                    target.classList.toggle(
                                        "is-open"
                                    );


                                this.classList.toggle(
                                    "is-open",
                                    isOpen
                                );


                                this.setAttribute(
                                    "aria-expanded",
                                    String(isOpen)
                                );

                            }
                        );

                    }
                );


            /* KEYBOARD SHORTCUTS */

            document.addEventListener(
                "keydown",
                function (event) {

                    /*
                     * Ctrl + Shift + Enter
                     * Submit
                     *
                     * Check this FIRST because
                     * Ctrl + Shift + Enter also contains
                     * Ctrl + Enter.
                     */

                    if (
                        event.ctrlKey &&
                        event.shiftKey &&
                        event.key === "Enter"
                    ) {

                        event.preventDefault();


                        if (
                            submitButton &&
                            !submitButton.disabled
                        ) {

                            submitButton.click();

                        }


                        return;

                    }


                    /*
                     * Ctrl + Enter
                     * Run
                     */

                    if (
                        event.ctrlKey &&
                        !event.shiftKey &&
                        event.key === "Enter"
                    ) {

                        event.preventDefault();


                        if (
                            runButton &&
                            !runButton.disabled
                        ) {

                            runButton.click();

                        }

                    }

                }
            );


            /* SCROLL TO RESULTS */

            function scrollToResults() {

                if (!output) {
                    return;
                }


                /*
                 * Only scroll when actual test
                 * results exist.
                 */

                const hasResult =
                    output.querySelector(
                        ".cc-test-results"
                    );


                if (!hasResult) {
                    return;
                }


                setTimeout(
                    function () {

                        output.scrollIntoView({
                            behavior:
                                reduceMotion
                                    ? "auto"
                                    : "smooth",

                            block:
                                "nearest"
                        });

                    },
                    reduceMotion
                        ? 0
                        : 180
                );

            }


            /* REVEAL ANIMATIONS */

            function initReveal() {

                const elements =
                    document.querySelectorAll(
                        ".cc-reveal"
                    );


                if (!elements.length) {
                    return;
                }


                /*
                 * Reduced motion / unsupported
                 * IntersectionObserver.
                 */

                if (
                    reduceMotion ||
                    !(
                        "IntersectionObserver"
                        in window
                    )
                ) {

                    elements.forEach(
                        function (element) {

                            element.classList.add(
                                "is-visible"
                            );

                        }
                    );

                    return;

                }


                const observer =
                    new IntersectionObserver(
                        function (entries) {

                            entries.forEach(
                                function (entry) {

                                    if (
                                        entry.isIntersecting
                                    ) {

                                        entry.target.classList.add(
                                            "is-visible"
                                        );


                                        observer.unobserve(
                                            entry.target
                                        );

                                    }

                                }
                            );

                        },
                        {
                            threshold: 0.08,

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
                            index < 10
                        ) {

                            element.style.transitionDelay =
                                `${Math.min(
                                    index * 45,
                                    250
                                )}ms`;

                        }


                        observer.observe(
                            element
                        );

                    }
                );

            }


            /* INITIALIZE EDITOR */

            async function initializeEditor() {

                currentLanguage =
                    getCurrentLanguage();


                /*
                 * Initialize starter/draft.
                 */

                initializeStarter();


                /*
                 * Update UI.
                 */

                updateLanguageHint();

                updateFileName();


                /*
                 * Initialize syntax highlighting.
                 */

                await updateEditorMode();


                /*
                 * Refresh CodeMirror after
                 * page layout is ready.
                 */

                if (
                    editor &&
                    typeof editor.refresh ===
                    "function"
                ) {

                    setTimeout(
                        function () {

                            editor.refresh();

                        },
                        100
                    );

                }

            }


            /* START */

            initializeEditor();

            initReveal();

            scrollToResults();

        }
    );

})();