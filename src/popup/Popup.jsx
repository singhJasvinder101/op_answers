import React from 'react';
import './Popup.css';

export const Popup = () => {
  const handleStartOCR = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        console.log("starting ", tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, { action: "START_OCR" });
      }
    });
  };

  return (
    <div>
      <h1>Start OCR</h1>
      <button onClick={handleStartOCR}>Select Area</button>
    </div>
  );
};

export default Popup;