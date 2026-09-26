/* CAREER COMPASS — CODE EDITOR */

   (function () {

    "use strict";


    function initCodeEditor() {

        const textarea =
            document.getElementById("code-editor");

        if (!textarea) {
            return;
        }


        const languageSelect =
            document.getElementById("language");


        let editor = null;


        /* LANGUAGE MODE */

        function modeFor(language) {

            if (language === "javascript") {
                return "javascript";
            }

            return "python";

        }


        /* INITIALIZE CODEMIRROR */

        if (
            typeof window.CodeMirror === "function" &&
            !textarea.dataset.ccEditorReady
        ) {

            editor =
                window.CodeMirror.fromTextArea(
                    textarea,
                    {
                        lineNumbers: true,

                        matchBrackets: true,

                        autoCloseBrackets: true,

                        styleActiveLine: true,

                        mode: modeFor(
                            languageSelect
                                ? languageSelect.value
                                : "python"
                        ),

                        theme: "monokai",

                        lineWrapping: true,

                        tabSize: 4,

                        indentUnit: 4,

                        indentWithTabs: false,

                        autofocus: false,

                        viewportMargin: Infinity

                    }
                );


            textarea.dataset.ccEditorReady =
                "true";


            window.codeEditor =
                editor;


            /* LANGUAGE CHANGE */

            if (languageSelect) {

                languageSelect.addEventListener(
                    "change",
                    function () {

                        editor.setOption(
                            "mode",
                            modeFor(
                                this.value
                            )
                        );

                    }
                );

            }


            /* SAVE BEFORE SUBMIT */

            const form =
                document.getElementById(
                    "solution-form"
                );


            if (form) {

                form.addEventListener(
                    "submit",
                    function () {

                        editor.save();

                    }
                );

            }

        } else {


            window.codeEditor =
                null;

        }


        /* KEYBOARD SHORTCUT */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    const runButton =
                        document.getElementById(
                            "run-code"
                        );

                    if (runButton) {
                        runButton.click();
                    }

                }

            }
        );


        /* TAB SUPPORT */

        if (editor) {

            editor.setOption(
                "extraKeys",
                {
                    Tab: function (cm) {

                        cm.replaceSelection(
                            "    ",
                            "end"
                        );

                    }
                }
            );

        }

    }

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initCodeEditor,
            {
                once: true
            }
        );

    } else {

        initCodeEditor();

    }

})();