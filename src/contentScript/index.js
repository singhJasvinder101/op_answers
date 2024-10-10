console.info('contentScript is running');
import html2canvas from 'html2canvas';
import Tesseract from 'tesseract.js';
import showdown from 'showdown';
import DOMPurify from 'dompurify';
import './content.css'

const converter = new showdown.Converter();


let isSelecting = false;
let startPoint = { x: 0, y: 0 };
let selectionBox = { x: 0, y: 0, width: 0, height: 0 };
let selectionElement = null;


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'START_OCR') {
        console.log("starting OCR selection");
        handleStartSelection();
    } else if (message.action === 'SHOW_ANSWER') {
        const { answer } = message;
        displayAnswerContainer(answer);
    }
});

const handleStartSelection = () => {
    isSelecting = true;
    selectionBox = { x: 0, y: 0, width: 0, height: 0 };

    const overlay = document.createElement('div');
    overlay.className = 'ocr-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.cursor = 'pointer';
    console.log(chrome.runtime.getURL('img/pointer.png'));
    console.log("url('img/pointer.png') 0 0, crosshair");
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    selectionElement = document.createElement('div');
    selectionElement.style.position = 'fixed';
    selectionElement.style.border = '2px dashed white';
    selectionElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    selectionElement.style.pointerEvents = 'none';
    selectionElement.style.zIndex = '10000';
    document.body.appendChild(selectionElement);

    overlay.addEventListener('mousedown', handleMouseDown);
    overlay.addEventListener('mousemove', handleMouseMove);
    overlay.addEventListener('mouseup', handleMouseUp);
};

const handleMouseDown = (e) => {
    if (!isSelecting) return;
    const { clientX, clientY } = e;
    startPoint = { x: clientX, y: clientY };
    selectionBox = { x: clientX, y: clientY, width: 0, height: 0 };
    updateSelectionElement();
};

const handleMouseMove = (e) => {
    if (!isSelecting || e.buttons !== 1) return;
    const { clientX, clientY } = e;

    selectionBox = {
        x: Math.min(startPoint.x, clientX),
        y: Math.min(startPoint.y, clientY),
        width: Math.abs(clientX - startPoint.x),
        height: Math.abs(clientY - startPoint.y),
    };
    updateSelectionElement();
};

const updateSelectionElement = () => {
    if (selectionElement) {
        selectionElement.style.left = `${selectionBox.x}px`;
        selectionElement.style.top = `${selectionBox.y}px`;
        selectionElement.style.width = `${selectionBox.width}px`;
        selectionElement.style.height = `${selectionBox.height}px`;
    }
};

const handleMouseUp = async () => {
    if (!isSelecting) return;
    isSelecting = false;

    // Remove overlay and selection element
    const overlay = document.querySelector('div[style*="cursor: pointer"]');
    if (overlay) {
        overlay.removeEventListener('mousedown', handleMouseDown);
        overlay.removeEventListener('mousemove', handleMouseMove);
        overlay.removeEventListener('mouseup', handleMouseUp);
        document.body.removeChild(overlay);
    }
    if (selectionElement) {
        document.body.removeChild(selectionElement);
        selectionElement = null;
    }

    try {
        chrome.runtime.sendMessage({ action: 'OCR_STARTED' });

        const canvas = await html2canvas(document.body, {
            x: selectionBox.x,
            y: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
        });

        const { data: { text } } = await Tesseract.recognize(canvas.toDataURL(), 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    chrome.runtime.sendMessage({ action: 'OCR_PROGRESS', progress: m.progress });
                }
            }
        });

        chrome.runtime.sendMessage({ action: 'OCR_RESULT', text });
        const response = await fetch('https://op-answers.vercel.app/generate_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: text }),
        });

        const data = await response.json();
        const answer = data.answer || 'No answer found.';

        console.log(answer)
        displayAnswerContainer(answer);

    } catch (error) {
        console.error('Error during OCR:', error);
        chrome.runtime.sendMessage({ action: 'OCR_ERROR', error: error.message });
    }
};

// Function to display the answer in a container on the page
const displayAnswerContainer = (answer) => {
    const container = document.createElement('div');
    container.className = 'answer-container';

    const content = document.createElement('div');
    content.className = 'answer-content';

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close');

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';
    copyButton.setAttribute('aria-label', 'Copy to clipboard');

    const copyTooltip = document.createElement('div');
    copyTooltip.className = 'copy-tooltip';
    copyTooltip.textContent = 'Copied!';

    const markdownToHTML = converter.makeHtml(answer);
    const sanitizedHTML = DOMPurify.sanitize(markdownToHTML);

    // Create floating bubbles
    for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'floating-bubble';
        bubble.style.width = `${Math.random() * 20 + 10}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;
        bubble.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(bubble);
    }

    content.innerHTML = sanitizedHTML;

    container.appendChild(closeButton);
    container.appendChild(copyButton);
    container.appendChild(copyTooltip);
    container.appendChild(content);

    document.body.appendChild(container);

    // Typewriter effect
    const text = content.textContent;
    content.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            content.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
        }
    };
    typeWriter();

    closeButton.addEventListener('click', () => {
        container.classList.add('closing');
        setTimeout(() => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }, 500);
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
            copyTooltip.classList.add('visible');
            setTimeout(() => {
                copyTooltip.classList.remove('visible');
            }, 2000);
        });
    });

    setTimeout(() => {
        if (document.body.contains(container)) {
            container.classList.add('closing');
            setTimeout(() => {
                if (document.body.contains(container)) {
                    document.body.removeChild(container);
                }
            }, 500);
        }
    }, 10000);
};