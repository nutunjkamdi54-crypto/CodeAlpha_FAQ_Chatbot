const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");
const chatHistory = document.getElementById("chatHistory");
const newChatBtn = document.querySelector(".new-chat");

/* Load History */

loadHistory();

/* Add Message */

function addMessage(message, className) {

    const msg = document.createElement("div");

    msg.classList.add(className);

    msg.innerHTML = message;

    chatBox.appendChild(msg);

    chatBox.scrollTop = chatBox.scrollHeight;
}

/* Save Chat History */

function addToHistory(question) {

    const item = document.createElement("div");

    item.classList.add("chat-item");

    item.textContent =
    question.length > 25
    ? question.substring(0,25) + "..."
    : question;

    chatHistory.appendChild(item);

    let chats =
        JSON.parse(
            localStorage.getItem("devai_history")
        ) || [];

    chats.push(question);

    localStorage.setItem(
        "devai_history",
        JSON.stringify(chats)
    );
}

/* Load Previous History */

function loadHistory() {

    let chats =
        JSON.parse(
            localStorage.getItem("devai_history")
        ) || [];

    chats.forEach(chat => {

        const item =
            document.createElement("div");

        item.classList.add("chat-item");

        item.textContent =
    chat.length > 25
    ? chat.substring(0,25) + "..."
    : chat;

        chatHistory.appendChild(item);

    });
}

/* Send Message */

async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") return;

    addMessage(message, "user-message");

    addToHistory(message);

    userInput.value = "";

    const typingDiv = document.createElement("div");

    typingDiv.classList.add("bot-message");

    typingDiv.innerHTML = `
        <div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    chatBox.appendChild(typingDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });

        const data = await response.json();

        typingDiv.remove();

        addMessage(
            "🤖 <strong>Dev AI</strong><br><br>" +
            data.response,
            "bot-message"
        );


    } catch (error) {

        typingDiv.remove();

        addMessage(
            "🤖 <strong>Dev AI</strong><br><br>Sorry, something went wrong.",
            "bot-message"
        );

        console.error(error);
    }
}

/* Send Button */

sendBtn.addEventListener(
    "click",
    sendMessage
);

/* Enter Key */

userInput.addEventListener(
    "keypress",
    (e) => {

        if (e.key === "Enter") {

            sendMessage();
        }
    }
);

/* New Chat */

newChatBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "devai_history"
        );

        chatHistory.innerHTML = `
            <div class="chat-item">
                Recent Chats
            </div>
        `;

        chatBox.innerHTML = `

<div class="bot-message welcome-card">

    <h2>👋 Welcome to Dev AI</h2>

    <br>

    I can help you with:

    <br><br>

    🤖 Artificial Intelligence
    <br>
    🐍 Python Programming
    <br>
    🌐 Web Development
    <br>
    🧠 Machine Learning
    <br>
    🚀 Technology Concepts

    <br><br>

    💡 Try one of the suggestions below.

</div>

<div class="suggestions">

    <button class="suggestion-btn">
        What is AI?
    </button>

    <button class="suggestion-btn">
        What is Python?
    </button>

    <button class="suggestion-btn">
        What is Flask?
    </button>

    <button class="suggestion-btn">
        What is Machine Learning?
    </button>

</div>

`;
    }
);

/* Voice Recognition */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-US";

    micBtn.addEventListener(
        "click",
        () => {

            recognition.start();

            micBtn.innerHTML = "🎙️";
        }
    );

    recognition.onresult =
        (event) => {

            userInput.value =
                event.results[0][0].transcript;

            micBtn.innerHTML = "🎤";
        };

    recognition.onerror =
        () => {

            micBtn.innerHTML = "🎤";
        };

    recognition.onend =
        () => {

            micBtn.innerHTML = "🎤";
        };
}


/* =========================
   SUGGESTION BUTTONS
========================= */

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("suggestion-btn")) {

        userInput.value = e.target.innerText;

        sendMessage();
    }
});

