console.log('background is running')


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'OCR_RESULT') {
    console.log('Extracted Text:', message.text);
    // You can add more processing or send this to the popup if needed
  }
});