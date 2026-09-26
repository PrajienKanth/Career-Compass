
/* CAREER COMPASS — AI ADVISOR CHAT */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    /* ELEMENTS */

    const messagesContainer =
        document.getElementById("chatMessages");

    const input =
        document.getElementById("chatInput");

    const sendButton =
        document.getElementById("sendMessage");

    const typingIndicator =
        document.getElementById("typingIndicator");

    const clearButton =
        document.getElementById("clearChat");

    const suggestions =
        document.querySelectorAll(".suggestion-btn");


    if (
        !messagesContainer ||
        !input ||
        !sendButton
    ) {
        return;
    }


    /* STATE */

    let isSending = false;
    let activeController = null;

    const MAX_MESSAGE_LENGTH = 2000;


    /* CSRF TOKEN */

    function getCSRFToken() {

        const meta =
            document.querySelector(
                'meta[name="csrf-token"]'
            );

        if (meta) {
            return meta.getAttribute("content");
        }


        const hidden =
            document.querySelector(
                'input[name="csrf_token"]'
            );

        if (hidden) {
            return hidden.value;
        }


        return null;
    }


    /* SCROLL */

    function scrollToBottom(smooth = true) {

        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: smooth ? "smooth" : "auto"
        });

    }


    /* SAFE TEXT */

    function escapeHTML(value) {

        const div =
            document.createElement("div");

        div.textContent =
            String(value ?? "");

        return div.innerHTML;
    }


    /* AI RESPONSE FORMATTER */

    function formatAIResponse(text) {

        let safe =
            escapeHTML(text);


        /*
         * Code blocks
         *
         * Only triple-backtick blocks are
         * treated as code.
         */

        safe = safe.replace(
            /```([\s\S]*?)```/g,
            function (_, code) {

                return (
                    "<pre><code>" +
                    code.trim() +
                    "</code></pre>"
                );

            }
        );


        /*
         * Inline code
         */

        safe = safe.replace(
            /`([^`\n]+)`/g,
            "<code>$1</code>"
        );


        /*
         * Bold
         */

        safe = safe.replace(
            /\*\*([^*]+)\*\*/g,
            "<strong>$1</strong>"
        );


        /*
         * Bullet lines
         */

        safe = safe.replace(
            /^[•*-]\s+(.+)$/gm,
            "<li>$1</li>"
        );


        /*
         * Convert consecutive list items
         */

        safe = safe.replace(
            /(<li>.*?<\/li>)(?:\s*(<li>.*?<\/li>))+/gs,
            function (match) {

                return "<ul>" +
                    match +
                    "</ul>";

            }
        );


        /*
         * Paragraphs
         */

        safe = safe
            .split(/\n{2,}/)
            .map(function (paragraph) {

                paragraph =
                    paragraph.trim();

                if (!paragraph) {
                    return "";
                }


                if (
                    paragraph.startsWith("<pre>") ||
                    paragraph.startsWith("<ul>")
                ) {
                    return paragraph;
                }


                return "<p>" +
                    paragraph.replace(
                        /\n/g,
                        "<br>"
                    ) +
                    "</p>";

            })
            .join("");


        return safe;
    }


    /* CREATE MESSAGE */

    function addMessage(text, type) {

        const row =
            document.createElement("div");

        row.className =
            type === "user"
                ? "message-row user ai-message-reveal"
                : "message-row ai ai-message-reveal";


        /* AVATAR */

        const avatar =
            document.createElement("div");


        if (type === "user") {

            avatar.className =
                "message-avatar user-message-avatar";


            const profileImage =
                messagesContainer.dataset.profileImage;


            if (profileImage) {

                const image =
                    document.createElement("img");

                image.src =
                    profileImage;

                image.alt =
                    "Your profile photo";


                image.onerror = function () {

                    image.remove();

                    avatar.classList.add(
                        "avatar-fallback"
                    );

                    const icon =
                        document.createElement("i");

                    icon.className =
                        "fa-solid fa-user avatar-fallback-icon";

                    avatar.appendChild(icon);

                };


                avatar.appendChild(image);

            } else {

                const icon =
                    document.createElement("i");

                icon.className =
                    "fa-solid fa-user avatar-fallback-icon";

                avatar.appendChild(icon);

            }


        } else {

            avatar.className =
                "message-avatar ai-message-avatar";


            const glow =
                document.createElement("span");

            glow.className =
                "message-avatar-glow";


            avatar.appendChild(glow);


            const aiLogo =
                messagesContainer.dataset.aiLogo;


            if (aiLogo) {

                const image =
                    document.createElement("img");

                image.src =
                    aiLogo;

                image.alt =
                    "Career Compass AI";


                image.onerror = function () {

                    image.remove();

                    const icon =
                        document.createElement("i");

                    icon.className =
                        "fa-solid fa-sparkles";

                    avatar.appendChild(icon);

                };


                avatar.appendChild(image);

            } else {

                const icon =
                    document.createElement("i");

                icon.className =
                    "fa-solid fa-sparkles";

                avatar.appendChild(icon);

            }

        }


        /* CONTENT */

        const content =
            document.createElement("div");

        content.className =
            "message-content";


        /* TOPLINE */

        const topline =
            document.createElement("div");

        topline.className =
            "message-topline";


        const name =
            document.createElement("span");

        name.className =
            "message-name";

        name.textContent =
            type === "user"
                ? "You"
                : "Career Compass AI";


        topline.appendChild(name);


        if (type === "user") {

            const timeIcon =
                document.createElement("span");

            timeIcon.className =
                "message-time";

            timeIcon.innerHTML =
                '<i class="fa-regular fa-message"></i>';

            topline.appendChild(timeIcon);

        } else {

            const aiLabel =
                document.createElement("span");

            aiLabel.className =
                "ai-response-label";

            aiLabel.innerHTML =
                '<i class="fa-solid fa-wand-magic-sparkles"></i> AI';

            topline.appendChild(aiLabel);

        }


        /* MESSAGE BUBBLE */

        const bubble =
            document.createElement("div");

        bubble.className =
            type === "user"
                ? "message-bubble user-bubble"
                : "message-bubble ai-bubble";


        if (type === "user") {

            bubble.textContent =
                String(text);

        } else {

            const response =
                document.createElement("div");

            response.className =
                "ai-response-text";

            response.innerHTML =
                formatAIResponse(text);

            bubble.appendChild(response);

        }


        content.appendChild(topline);
        content.appendChild(bubble);


        row.appendChild(avatar);
        row.appendChild(content);


        messagesContainer.insertBefore(
            row,
            typingIndicator
        );


        scrollToBottom();


        return row;
    }



    /* REMOVE WELCOME */

    function removeWelcome() {

        const welcome =
            document.getElementById("chatWelcome");


        if (welcome) {
            welcome.remove();
        }

    }


    /* TYPING */

    function showTyping() {

        typingIndicator.hidden = false;
        typingIndicator.style.display = "flex";

        scrollToBottom();
    }


    function hideTyping() {

        typingIndicator.hidden = true;
        typingIndicator.style.display = "none";
    }


    /* INPUT HEIGHT */

    function resizeInput() {

        input.style.height = "auto";


        const maxHeight = 120;


        input.style.height =
            Math.min(
                input.scrollHeight,
                maxHeight
            ) + "px";
    }


    /* BUTTON STATE */

    function setSendingState(sending) {

        isSending =
            sending;


        sendButton.disabled =
            sending;


        input.disabled =
            sending;


        if (sending) {

            sendButton.innerHTML =
                '<i class="fa-solid fa-stop"></i>';

        } else {

            sendButton.innerHTML =
                '<i class="fa-solid fa-arrow-up"></i>';

        }

    }


    /* SEND MESSAGE */

    async function sendMessage(
        suppliedMessage = null
    ) {

        if (isSending) {
            return;
        }


        const message =
            suppliedMessage !== null
                ? String(suppliedMessage).trim()
                : input.value.trim();


        if (!message) {
            return;
        }


        if (
            message.length >
            MAX_MESSAGE_LENGTH
        ) {

            addMessage(
                "Please keep your message within 2000 characters.",
                "ai"
            );

            return;
        }


        removeWelcome();


        /* Add user message immediately */

        addMessage(
            message,
            "user"
        );


        input.value = "";

        resizeInput();


        /* Prepare request */

        setSendingState(true);

        showTyping();


        activeController =
            new AbortController();


        const csrfToken =
            getCSRFToken();


        try {

            const headers = {

                "Content-Type":
                    "application/json",

                "Accept":
                    "application/json"

            };


            if (csrfToken) {

                headers["X-CSRFToken"] =
                    csrfToken;

            }


            const response =
                await fetch(
                    "/api/chat",
                    {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({
                            message: message
                        }),
                        signal:
                            activeController.signal
                    }
                );


            let data = null;


            try {

                data =
                    await response.json();

            } catch (jsonError) {

                throw new Error(
                    "The server returned an invalid response."
                );

            }


            if (!response.ok) {

                throw new Error(
                    data?.error ||
                    "Unable to get a response right now."
                );

            }


            if (
                !data ||
                typeof data.response !== "string"
            ) {

                throw new Error(
                    "The AI response was empty."
                );

            }


            hideTyping();


            const aiRow =
                addMessage(
                    data.response,
                    "ai"
                );


            /*
             * Make sure the speech enhancement
             * can process dynamically created
             * AI messages immediately.
             */

            document.dispatchEvent(
                new CustomEvent(
                    "careerCompassAIMessage",
                    {
                        detail: {
                            row: aiRow
                        }
                    }
                )
            );


        } catch (error) {

            hideTyping();


            if (
                error.name === "AbortError"
            ) {

                addMessage(
                    "The request was stopped.",
                    "ai"
                );

            } else {

                console.error(
                    "AI Advisor error:",
                    error
                );


                addMessage(
                    error.message ||
                    "Something went wrong. Please try again.",
                    "ai"
                );

            }

        } finally {

            activeController =
                null;


            setSendingState(false);


            input.disabled =
                false;


            input.focus();

        }

    }


    /* SEND BUTTON */

    sendButton.addEventListener(
        "click",
        function () {

            if (isSending) {

                if (activeController) {
                    activeController.abort();
                }

                return;
            }


            sendMessage();

        }
    );


    /* KEYBOARD */

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* INPUT RESIZE */

    input.addEventListener(
        "input",
        resizeInput
    );


    /* SUGGESTIONS */

    suggestions.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const question =
                        button.dataset.question ||
                        button.textContent.trim();


                    input.value =
                        question;


                    resizeInput();

                    input.focus();

                }
            );

        }
    );


    /* CLEAR CONVERSATION */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                if (isSending) {

                    if (activeController) {
                        activeController.abort();
                    }

                }


                const confirmed =
                    window.confirm(
                        "Clear the current conversation?"
                    );


                if (!confirmed) {
                    return;
                }


                messagesContainer
                    .querySelectorAll(
                        ".message-row"
                    )
                    .forEach(
                        function (row) {

                            if (
                                row.id !==
                                "typingIndicator"
                            ) {

                                row.remove();

                            }

                        }
                    );


                hideTyping();


                /* Recreate welcome */

                const welcome =
                    document.createElement("div");


                welcome.className =
                    "chat-welcome";


                welcome.id =
                    "chatWelcome";


                welcome.innerHTML = `
                    <div class="welcome-icon">
                        <i class="fa-solid fa-sparkles"></i>
                    </div>

                    <h2>
                        What would you like to work on?
                    </h2>

                    <p>
                        You can ask me about careers,
                        learning paths, technical skills,
                        projects, interviews, coding practice
                        or your next step.
                    </p>

                    <div class="suggestion-list">

                        <button
                            type="button"
                            class="suggestion-btn"
                            data-question="What career paths can I explore based on my current skills?">
                            Career paths
                        </button>

                        <button
                            type="button"
                            class="suggestion-btn"
                            data-question="What skills should I improve for an AI or machine learning career?">
                            Skills to improve
                        </button>

                        <button
                            type="button"
                            class="suggestion-btn"
                            data-question="What projects should I build to strengthen my portfolio?">
                            Portfolio projects
                        </button>

                        <button
                            type="button"
                            class="suggestion-btn"
                            data-question="How should I prepare for a technical interview as a fresher?">
                            Interview preparation
                        </button>

                    </div>
                `;


                messagesContainer.insertBefore(
                    welcome,
                    typingIndicator
                );


                welcome
                    .querySelectorAll(".suggestion-btn")
                    .forEach(
                        function (button) {

                            button.addEventListener(
                                "click",
                                function () {

                                    input.value =
                                        button.dataset.question;

                                    resizeInput();

                                    input.focus();

                                }
                            );

                        }
                    );


                input.value = "";

                resizeInput();

                scrollToBottom(false);

            }
        );

    }


    /* INITIALIZE */

    resizeInput();

    hideTyping();

    scrollToBottom(false);

    input.focus();

});

