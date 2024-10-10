console.log('background is running')


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'OCR_RESULT') {
    console.log('Extracted Text:', message.text);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'OCR_STARTED') {
    chrome.action.setBadgeBackgroundColor({ color: '#FFD700' }); 
    chrome.action.setBadgeText({ text: '.' }); 
  } else if (message.action === 'OCR_PROGRESS') {
    chrome.action.setBadgeBackgroundColor({ color: '#FFD700' }); 
    chrome.action.setBadgeText({ text: `${Math.round(message.progress * 100)}%` });
  } else if (message.action === 'OCR_RESULT') {
    chrome.action.setBadgeBackgroundColor({ color: '#00FF00' });
    chrome.action.setBadgeText({ text: '.' });
  } else if (message.action === 'OCR_ERROR') {
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' }); 
    chrome.action.setBadgeText({ text: 'ERR' });
  }
});
