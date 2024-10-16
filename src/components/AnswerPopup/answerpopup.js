const app = document.getElementById('popup-container');
const apiUri = 'http://127.0.0.1:5000/generate_answer';
import './index.css'

let darkMode = false;
let isScanning = false;
let isSubmitting = false;
let ocrProgress = 0;
let ocrResult = '';



const createElement = (tag, className, content = '') => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
};
const render = () => {
    if (!app) return;
    console.log("Rendering popup...");
    console.log(app);
    app.innerHTML = '';

    const header = createElement('header', 'popup-header', '<h1>Homework AI</h1>');
    const main = createElement('main', 'popup-content');

    // Input container
    const inputContainer = createElement('div', 'input-container');
    const input = createElement('input', '', '');
    input.placeholder = 'Enter your question';
    input.addEventListener('input', (e) => {
        question = e.target.value;
    });

    const submitButton = createElement('button', 'icon-button', 'Submit');
    submitButton.disabled = isSubmitting;
    submitButton.addEventListener('click', handleSubmitQuestion);
    inputContainer.appendChild(input);
    inputContainer.appendChild(submitButton);

    // Start OCR button
    const ocrButton = createElement('button', 'start-ocr-button', 'Scan');
    ocrButton.disabled = isScanning;
    ocrButton.addEventListener('click', handleStartOCR);

    main.appendChild(header);
    main.appendChild(inputContainer);
    main.appendChild(ocrButton);

    // Progress Bar
    const progressBarContainer = createElement('div', 'progress-bar-container');
    const progressBar = createElement('div', 'progress-bar');
    progressBar.style.width = `${ocrProgress}%`;
    progressBarContainer.appendChild(progressBar);
    main.appendChild(progressBarContainer);

    // OCR Result
    if (ocrResult) {
        const resultDiv = createElement('div', 'ocr-result', `<h2>Scanned Text:</h2><p>${ocrResult}</p>`);
        main.appendChild(resultDiv);
    }

    app.appendChild(main);
};

const handleStartOCR = () => {
    isScanning = true;
    ocrProgress = 0;
    chrome.tabs.query({ active: true }, (tabs) => {
        if (tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "START_OCR" });
        }
    });
};

const handleSubmitQuestion = async () => {
    isSubmitting = true;
    render();

    try {
        const response = await fetch(apiUri, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question }),
        });

        const data = await response.json();
        ocrResult = data.answer || 'No answer found.';
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "SHOW_ANSWER", answer: ocrResult });
            }
        });
    } catch (error) {
        console.error("Error submitting question:", error);
    } finally {
        isSubmitting = false;
        render();
    }
};

// Initial render
render();
console.log(app)
console.log("hello")
