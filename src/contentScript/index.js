console.info('contentScript is running');
import html2canvas from 'html2canvas';
import Tesseract from 'tesseract.js';
import showdown from 'showdown';
import DOMPurify from 'dompurify';


const converter = new showdown.Converter();


let isSelecting = false;
let startPoint = { x: 0, y: 0 };
let selectionBox = { x: 0, y: 0, width: 0, height: 0 };
let selectionElement = null;


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'START_OCR') {
        console.log("starting OCR selection");
        handleStartSelection();
    }
});

const handleStartSelection = () => {
    isSelecting = true;
    selectionBox = { x: 0, y: 0, width: 0, height: 0 };

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.cursor = 'crosshair';
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
    const overlay = document.querySelector('div[style*="cursor: crosshair"]');
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
        const response = await fetch('http://127.0.0.1:5000/generate_answer', {
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
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.padding = '10px';
    container.style.backgroundColor = '#fff';
    container.style.border = '1px solid #ccc';
    container.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
    container.style.zIndex = '10000';
    container.style.maxWidth = '400px';
    container.style.overflowY = 'auto';

    const markdownToHTML = converter.makeHtml(answer);

    // Sanitize the generated HTML using DOMPurify to prevent XSS
    const sanitizedHTML = DOMPurify.sanitize(markdownToHTML);

    container.innerHTML = `Answer: ${sanitizedHTML}`;

    document.body.appendChild(container);

    setTimeout(() => {
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }, 10000);
};