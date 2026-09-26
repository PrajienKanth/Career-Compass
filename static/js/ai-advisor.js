/* CAREER COMPASS — AI CAREER ADVISOR*/ 

document.addEventListener("DOMContentLoaded", function () {


    "use strict";


    /* ELEMENTS */

    const page = document.querySelector(".ai-advisor-page");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const voiceInput = document.getElementById("voiceInput");
    const stopVoice = document.getElementById("stopVoice");
    const voiceStatus = document.getElementById("voiceStatus");
    const voiceStatusText = document.getElementById("voiceStatusText");
    const characterCount = document.getElementById("characterCount");
    const aiStatusText = document.getElementById("aiStatusText");


    if (!page) {
        return;
    }


    /* PAGE REVEAL */

    function initReveal() {

        const revealItems = document.querySelectorAll(".ai-reveal");

        if (!revealItems.length) {
            return;
        }

        document.documentElement.classList.add("js-reveal-enabled");

        if (
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {

            revealItems.forEach(function (item) {
                item.classList.add("is-visible");
            });

            return;
        }


        if (!("IntersectionObserver" in window)) {

            revealItems.forEach(function (item) {
                item.classList.add("is-visible");
            });

            return;
        }


        const observer = new IntersectionObserver(
            function (entries, obs) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    obs.unobserve(entry.target);

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -30px 0px"
            }
        );


        revealItems.forEach(function (item) {
            observer.observe(item);
        });

    }


    initReveal();



    /* TEXTAREA AUTO RESIZE */

    function resizeInput() {

        if (!chatInput) {
            return;
        }

        chatInput.style.height = "auto";

        chatInput.style.height =
            Math.min(chatInput.scrollHeight, 150) + "px";

    }


    if (chatInput) {

        chatInput.addEventListener("input", function () {

            resizeInput();

            updateCharacterCount();

        });

    }


    /* CHARACTER COUNT */

    function updateCharacterCount() {

        if (!chatInput || !characterCount) {
            return;
        }

        const length = chatInput.value.length;

        characterCount.textContent =
            length + " / 2000";

        if (length > 1800) {

            characterCount.style.color = "#fb7185";

        } else if (length > 1500) {

            characterCount.style.color = "#fbbf24";

        } else {

            characterCount.style.color = "";

        }

    }


    updateCharacterCount();



    /* VOICE RECOGNITION */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    let recognition = null;
    let isListening = false;
    let voiceBaseText = "";


    function setVoiceUI(listening) {

        isListening = listening;

        if (!voiceInput) {
            return;
        }


        if (listening) {

            voiceInput.classList.add("listening");

            voiceInput.innerHTML =
                '<i class="fa-solid fa-waveform-lines"></i>';

            voiceInput.setAttribute(
                "aria-label",
                "Stop voice input"
            );

            voiceInput.setAttribute(
                "title",
                "Stop listening"
            );


            if (voiceStatus) {
                voiceStatus.hidden = false;
            }

            if (voiceStatusText) {
                voiceStatusText.textContent =
                    "Listening... speak naturally";
            }

        } else {

            voiceInput.classList.remove("listening");

            voiceInput.innerHTML =
                '<i class="fa-solid fa-microphone"></i>';

            voiceInput.setAttribute(
                "aria-label",
                "Use voice input"
            );

            voiceInput.setAttribute(
                "title",
                "Speak your message"
            );


            if (voiceStatus) {
                voiceStatus.hidden = true;
            }

        }

    }


    function startVoiceRecognition() {

        if (!SpeechRecognition) {

            showVoiceMessage(
                "Voice recognition is not supported in this browser. Try Chrome or Edge."
            );

            return;
        }


        if (!recognition) {

            recognition = new SpeechRecognition();

            recognition.continuous = true;

            recognition.interimResults = true;

            recognition.lang =
                document.documentElement.lang || "en-US";


            recognition.onstart = function () {

                setVoiceUI(true);

                voiceBaseText =
                    chatInput ? chatInput.value.trim() : "";

                updateAIStatus("Listening");

            };


            recognition.onresult = function (event) {

                let interimTranscript = "";
                let finalTranscript = "";


                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    const transcript =
                        event.results[i][0].transcript;


                    if (event.results[i].isFinal) {

                        finalTranscript +=
                            transcript + " ";

                    } else {

                        interimTranscript += transcript;

                    }

                }


                if (chatInput) {

                    const base =
                        voiceBaseText
                            ? voiceBaseText + " "
                            : "";


                    chatInput.value =
                        base +
                        finalTranscript +
                        interimTranscript;


                    resizeInput();

                    updateCharacterCount();

                }

            };


            recognition.onerror = function (event) {

                console.warn(
                    "Speech recognition error:",
                    event.error
                );


                if (
                    event.error === "not-allowed" ||
                    event.error === "service-not-allowed"
                ) {

                    showVoiceMessage(
                        "Microphone permission was denied."
                    );

                } else if (event.error === "no-speech") {

                    showVoiceMessage(
                        "I didn't hear anything. Try speaking again."
                    );

                }


                setVoiceUI(false);

                updateAIStatus("Ready to help");

            };


            recognition.onend = function () {

                if (isListening) {

                    try {
                        recognition.start();
                    } catch (error) {
                        setVoiceUI(false);
                    }

                } else {

                    setVoiceUI(false);

                    updateAIStatus("Ready to help");

                }

            };

        }


        try {

            recognition.start();

        } catch (error) {

            console.warn(
                "Speech recognition could not start:",
                error
            );

        }

    }


    function stopVoiceRecognition() {

        if (!recognition) {
            return;
        }

        isListening = false;

        try {
            recognition.stop();
        } catch (error) {
            console.warn(error);
        }

        setVoiceUI(false);

        updateAIStatus("Ready to help");

    }


    if (voiceInput) {

        voiceInput.addEventListener("click", function () {

            if (isListening) {

                stopVoiceRecognition();

            } else {

                startVoiceRecognition();

            }

        });

    }


    if (stopVoice) {

        stopVoice.addEventListener(
            "click",
            stopVoiceRecognition
        );

    }


    function showVoiceMessage(message) {

        if (!voiceStatus || !voiceStatusText) {
            return;
        }

        voiceStatus.hidden = false;

        voiceStatusText.textContent = message;

        setTimeout(function () {

            if (!isListening) {
                voiceStatus.hidden = true;
            }

        }, 3500);

    }



    /* AI STATUS */

    function updateAIStatus(status) {

        if (aiStatusText) {
            aiStatusText.textContent = status;
        }

    }



    /* SUGGESTION BUTTONS */

    document
        .querySelectorAll(".suggestion-btn")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const question =
                    button.dataset.question || "";


                if (!chatInput) {
                    return;
                }


                chatInput.value = question;

                resizeInput();

                updateCharacterCount();

                chatInput.focus();


                setTimeout(function () {

                    const sendButton =
                        document.getElementById("sendMessage");


                    if (sendButton) {
                        sendButton.click();
                    }

                }, 100);

            });

        });



    /* SPEECH SYNTHESIS */

    let speechState = {
        utterance: null,
        words: [],
        index: 0,
        element: null,
        panel: null,
        progressTimer: null,
        cancelled: false
    };


    function getSpeechText(element) {

        if (!element) {
            return "";
        }

        return element.innerText
            .replace(/\s+/g, " ")
            .trim();

    }


    function prepareSpeechWords(element) {

        if (!element) {
            return [];
        }


        const text =
            getSpeechText(element);


        if (!text) {
            return [];
        }


        const words =
            text.split(/(\s+)/);


        element.innerHTML = "";


        words.forEach(function (part) {

            if (/^\s+$/.test(part)) {

                element.appendChild(
                    document.createTextNode(part)
                );

                return;
            }


            const span =
                document.createElement("span");


            span.className =
                "speech-word";


            span.textContent =
                part;


            element.appendChild(span);

        });


        return Array.from(
            element.querySelectorAll(".speech-word")
        );

    }


    function resetSpeechHighlight() {

        document
            .querySelectorAll(".speech-word.speaking")
            .forEach(function (word) {

                word.classList.remove("speaking");

            });

    }


    function stopSpeech() {

        speechState.cancelled = true;


        if (
            window.speechSynthesis &&
            window.speechSynthesis.speaking
        ) {

            window.speechSynthesis.cancel();

        }


        clearInterval(speechState.progressTimer);


        resetSpeechHighlight();


        if (speechState.panel) {

            speechState.panel.classList.remove(
                "speaking"
            );

            updateSpeechControls(
                speechState.panel,
                "stopped"
            );

        }


        const livePanel =
            speechState.element
                ?.closest(".message-content")
                ?.querySelector("[data-speech-text-panel]");


        if (livePanel) {
            livePanel.hidden = true;
        }


        speechState = {
            utterance: null,
            words: [],
            index: 0,
            element: null,
            panel: null,
            progressTimer: null,
            cancelled: false
        };


        updateAIStatus("Ready to help");

    }


    function playSpeech(panel) {

        if (!window.speechSynthesis) {

            showVoiceMessage(
                "Speech playback is not supported in this browser."
            );

            return;
        }


        const messageContent =
            panel.closest(".message-content");


        if (!messageContent) {
            return;
        }


        const textElement =
            messageContent.querySelector(
                ".ai-response-text"
            );


        if (!textElement) {
            return;
        }


        stopSpeech();


        const words =
            prepareSpeechWords(textElement);


        if (!words.length) {
            return;
        }


        const text =
            words
                .map(function (word) {
                    return word.textContent;
                })
                .join(" ");


        const utterance =
            new SpeechSynthesisUtterance(text);


        utterance.lang = "en-US";

        utterance.rate = .94;

        utterance.pitch = 1;

        utterance.volume = 1;


        speechState.utterance = utterance;

        speechState.words = words;

        speechState.index = 0;

        speechState.element = textElement;

        speechState.panel = panel;

        speechState.cancelled = false;


        const livePanel =
            messageContent.querySelector(
                "[data-speech-text-panel]"
            );


        const liveText =
            messageContent.querySelector(
                "[data-speech-live-text]"
            );


        if (livePanel) {
            livePanel.hidden = false;
        }


        if (liveText) {
            liveText.textContent = "";
        }


        panel.classList.add("speaking");


        updateSpeechControls(
            panel,
            "playing"
        );


        updateAIStatus("Speaking");


        utterance.onstart = function () {

            updateSpeechControls(
                panel,
                "playing"
            );

            startSpeechProgress(panel);

        };


        utterance.onboundary = function (event) {

            if (
                speechState.cancelled ||
                !speechState.words.length
            ) {
                return;
            }


            if (
                event.name &&
                event.name !== "word"
            ) {
                return;
            }


            const spokenText =
                text.substring(
                    0,
                    event.charIndex
                );


            const wordIndex =
                spokenText
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .length;


            const index =
                Math.min(
                    wordIndex,
                    speechState.words.length - 1
                );


            highlightSpeechWord(
                index,
                liveText
            );

        };


        utterance.onpause = function () {

            updateSpeechControls(
                panel,
                "paused"
            );

            updateAIStatus("Speech paused");

        };


        utterance.onresume = function () {

            updateSpeechControls(
                panel,
                "playing"
            );

            updateAIStatus("Speaking");

        };


        utterance.onend = function () {

            if (speechState.cancelled) {
                return;
            }


            finishSpeech(
                panel,
                livePanel
            );

        };


        utterance.onerror = function (event) {

            console.warn(
                "Speech synthesis error:",
                event
            );


            if (event.error !== "canceled") {

                updateSpeechControls(
                    panel,
                    "stopped"
                );

            }

        };


        window.speechSynthesis.speak(
            utterance
        );

    }


    function highlightSpeechWord(
        index,
        liveText
    ) {

        resetSpeechHighlight();


        if (
            !speechState.words[index]
        ) {
            return;
        }


        const word =
            speechState.words[index];


        word.classList.add("speaking");


        word.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });


        speechState.index = index;


        if (liveText) {

            const visibleWords =
                speechState.words
                    .slice(
                        Math.max(0, index - 3),
                        Math.min(
                            speechState.words.length,
                            index + 7
                        )
                    )
                    .map(function (item) {
                        return item.textContent;
                    })
                    .join(" ");


            liveText.textContent =
                visibleWords;

        }

    }


    function startSpeechProgress(panel) {

        clearInterval(
            speechState.progressTimer
        );


        speechState.progressTimer =
            setInterval(function () {

                if (
                    !speechState.words.length
                ) {
                    return;
                }


                const progress =
                    (
                        speechState.index /
                        Math.max(
                            1,
                            speechState.words.length - 1
                        )
                    ) * 100;


                const bar =
                    panel.querySelector(
                        "[data-speech-progress-bar]"
                    );


                const percentage =
                    panel.querySelector(
                        "[data-speech-progress]"
                    );


                if (bar) {
                    bar.style.width =
                        Math.min(100, progress) + "%";
                }


                if (percentage) {
                    percentage.textContent =
                        Math.round(
                            Math.min(100, progress)
                        ) + "%";
                }

            }, 100);

    }


    function finishSpeech(
        panel,
        livePanel
    ) {

        clearInterval(
            speechState.progressTimer
        );


        resetSpeechHighlight();


        speechState.words.forEach(
            function (word) {
                word.classList.add("spoken");
            }
        );


        const bar =
            panel.querySelector(
                "[data-speech-progress-bar]"
            );


        const percentage =
            panel.querySelector(
                "[data-speech-progress]"
            );


        if (bar) {
            bar.style.width = "100%";
        }


        if (percentage) {
            percentage.textContent = "100%";
        }


        if (livePanel) {
            livePanel.hidden = true;
        }


        panel.classList.remove("speaking");


        updateSpeechControls(
            panel,
            "finished"
        );


        updateAIStatus("Ready to help");


        speechState.utterance = null;

    }



    /* SPEECH CONTROL UI */

    function updateSpeechControls(
        panel,
        state
    ) {

        if (!panel) {
            return;
        }


        const play =
            panel.querySelector(
                '[data-speech-action="play"]'
            );


        const pause =
            panel.querySelector(
                '[data-speech-action="pause"]'
            );


        const resume =
            panel.querySelector(
                '[data-speech-action="resume"]'
            );


        const stop =
            panel.querySelector(
                '[data-speech-action="stop"]'
            );


        const status =
            panel.querySelector(
                "[data-speech-status]"
            );


        if (play) {
            play.hidden = true;
        }

        if (pause) {
            pause.hidden = true;
        }

        if (resume) {
            resume.hidden = true;
        }

        if (stop) {
            stop.hidden = true;
        }


        if (state === "playing") {

            if (pause) {
                pause.hidden = false;
            }

            if (stop) {
                stop.hidden = false;
            }

            if (status) {
                status.innerHTML =
                    '<i class="fa-solid fa-volume-high"></i> Speaking...';
            }

        } else if (state === "paused") {

            if (resume) {
                resume.hidden = false;
            }

            if (stop) {
                stop.hidden = false;
            }

            if (status) {
                status.innerHTML =
                    '<i class="fa-solid fa-pause"></i> Paused';
            }

        } else {

            if (play) {
                play.hidden = false;
            }

            if (status) {

                if (state === "finished") {

                    status.innerHTML =
                        '<i class="fa-solid fa-circle-check"></i> Finished';

                } else {

                    status.innerHTML =
                        '<i class="fa-solid fa-volume-high"></i> Listen to response';

                }

            }

        }

    }



    /* SPEECH BUTTON EVENTS */

    document
        .querySelectorAll("[data-speech-action]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const panel =
                        button.closest(".speech-panel");


                    if (!panel) {
                        return;
                    }


                    const action =
                        button.dataset.speechAction;


                    if (action === "play") {

                        playSpeech(panel);

                    }


                    if (action === "pause") {

                        if (
                            window.speechSynthesis &&
                            window.speechSynthesis.speaking
                        ) {

                            window.speechSynthesis.pause();

                        }

                    }


                    if (action === "resume") {

                        if (
                            window.speechSynthesis &&
                            window.speechSynthesis.paused
                        ) {

                            window.speechSynthesis.resume();

                        }

                    }


                    if (action === "stop") {

                        stopSpeech();

                    }

                }
            );

        });



    /* WATCH FOR NEW AI MESSAGES */

    function enhanceAIMessage(messageRow) {

        if (!messageRow) {
            return;
        }


        const response =
            messageRow.querySelector(
                ".ai-response-text"
            );


        if (!response) {
            return;
        }


        if (
            messageRow.querySelector(
                ".speech-panel"
            )
        ) {
            return;
        }


        const messageContent =
            messageRow.querySelector(
                ".message-content"
            );


        if (!messageContent) {
            return;
        }


        const panel =
            document.createElement("div");


        panel.className =
            "speech-panel";


        panel.innerHTML = `
            <div class="speech-panel-main">
    
                <button
                    type="button"
                    class="speech-button speech-play"
                    data-speech-action="play"
                    aria-label="Read response aloud"
                    title="Read response aloud">
    
                    <i class="fa-solid fa-play"></i>
    
                </button>
    
                <button
                    type="button"
                    class="speech-button speech-pause"
                    data-speech-action="pause"
                    aria-label="Pause speech"
                    title="Pause speech"
                    hidden>
    
                    <i class="fa-solid fa-pause"></i>
    
                </button>
    
                <button
                    type="button"
                    class="speech-button speech-resume"
                    data-speech-action="resume"
                    aria-label="Resume speech"
                    title="Resume speech"
                    hidden>
    
                    <i class="fa-solid fa-play"></i>
    
                </button>
    
                <button
                    type="button"
                    class="speech-button speech-stop"
                    data-speech-action="stop"
                    aria-label="Stop speech"
                    title="Stop speech"
                    hidden>
    
                    <i class="fa-solid fa-stop"></i>
    
                </button>
    
                <div class="speech-info">
    
                    <span class="speech-status"
                          data-speech-status>
    
                        <i class="fa-solid fa-volume-high"></i>
    
                        Listen to response
    
                    </span>
    
                    <span
                        class="speech-progress-text"
                        data-speech-progress>
                        0%
                    </span>
    
                </div>
    
            </div>
    
            <div class="speech-progress">
    
                <div
                    class="speech-progress-bar"
                    data-speech-progress-bar>
                </div>
    
            </div>
        `;


        const livePanel =
            document.createElement("div");


        livePanel.className =
            "speech-text-panel";


        livePanel.dataset.speechTextPanel =
            "";


        livePanel.hidden = true;


        livePanel.innerHTML = `
            <div class="speech-text-header">
    
                <span>
                    <i class="fa-solid fa-wave-square"></i>
                    Currently speaking
                </span>
    
                <span class="speech-live-dot">
                    LIVE
                </span>
    
            </div>
    
            <div
                class="speech-text-content"
                data-speech-live-text>
            </div>
        `;


        messageContent.appendChild(panel);

        messageContent.appendChild(livePanel);


        panel
            .querySelectorAll("[data-speech-action]")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const action =
                            button.dataset.speechAction;


                        if (action === "play") {
                            playSpeech(panel);
                        }


                        if (action === "pause") {

                            if (
                                window.speechSynthesis &&
                                window.speechSynthesis.speaking
                            ) {

                                window.speechSynthesis.pause();

                            }

                        }


                        if (action === "resume") {

                            if (
                                window.speechSynthesis &&
                                window.speechSynthesis.paused
                            ) {

                                window.speechSynthesis.resume();

                            }

                        }


                        if (action === "stop") {
                            stopSpeech();
                        }

                    }
                );

            });

    }


    function scanForAIResponses() {

        document
            .querySelectorAll(
                ".message-row.ai"
            )
            .forEach(function (row) {

                enhanceAIMessage(row);

            });

    }


    scanForAIResponses();



    /* MUTATION OBSERVER
       Detects new AI responses created by chat.js */

    if (chatMessages && "MutationObserver" in window) {

        const observer =
            new MutationObserver(function (mutations) {

                let shouldScan = false;


                mutations.forEach(function (mutation) {

                    if (
                        mutation.type === "childList" &&
                        mutation.addedNodes.length
                    ) {

                        shouldScan = true;

                    }

                });


                if (shouldScan) {

                    setTimeout(
                        scanForAIResponses,
                        50
                    );

                }

            });


        observer.observe(
            chatMessages,
            {
                childList: true,
                subtree: true
            }
        );

    }



    /* STOP SPEECH WHEN LEAVING PAGE */

    window.addEventListener(
        "beforeunload",
        function () {

            if (
                window.speechSynthesis
            ) {

                window.speechSynthesis.cancel();

            }


            if (recognition) {

                try {
                    recognition.stop();
                } catch (error) {
                    // Ignore shutdown error.
                }

            }

        }
    );



    /* ESCAPE KEY */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }


            if (isListening) {
                stopVoiceRecognition();
            }


            if (
                window.speechSynthesis &&
                (
                    window.speechSynthesis.speaking ||
                    window.speechSynthesis.paused
                )
            ) {

                stopSpeech();

            }

        }
    );


});
