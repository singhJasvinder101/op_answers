import React, { useState, useEffect } from 'react';
import './Popup.css';
import { Moon, Sun } from 'lucide-react';

export const Popup = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get('darkMode', (data) => {
      if (data.darkMode !== undefined) {
        setDarkMode(data.darkMode);
      }
    });
  }, []);

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
    chrome.storage.sync.set({ darkMode });
  }, [darkMode]);

  const handleStartOCR = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        console.log("starting ", tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, { action: "START_OCR" });
      }
    });
  };

  useEffect(() => {
    const messageListener = (message) => {
      if (message.action === 'OCR_PROGRESS') {
        setOcrProgress(message.progress * 100);
      } else if (message.action === 'OCR_RESULT') {
        setOcrResult(message.text);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  useEffect(() => {
    const closeTimeout = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        window.close();
      }, 300);
    }, 30000);

    return () => clearTimeout(closeTimeout);
  }, []);

  return (
    <div className={`popup-container ${darkMode ? 'dark-mode' : ''} ${isClosing ? 'closing' : ''}`}>
      <header className="popup-header">
        <h1>Homework AI</h1>
        {/* <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button> */}
      </header>
      <main className="popup-content">
        <button className="start-ocr-button" onClick={handleStartOCR}>
          Let's Go !!
        </button>
        {ocrProgress > 0 && ocrProgress < 100 && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${ocrProgress}%` }}
              role="progressbar"
              aria-valuenow={ocrProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Popup;