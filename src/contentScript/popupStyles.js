const popupStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

:root {
  --primary-color: #6c5ce7;
  --secondary-color: #a29bfe;
  --background-color: #ffffff;
  --text-color: #2d3436;
  --border-color: #dfe6e9;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --hover-color: #f0f0f0;
}

.dark-mode {
  --primary-color: #a29bfe;
  --secondary-color: #6c5ce7;
  --background-color: #2d3436;
  --text-color: #dfe6e9;
  --border-color: #636e72;
  --shadow-color: rgba(255, 255, 255, 0.1);
  --hover-color: #34495e;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(20px); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.cross-icon {
    cursor: pointer;
    float: right;
    font-size: 16px;
    margin-top: -5px;
    margin-right: 15px;
}

.answer-heading{
  display: flex;
  justify-content: space-between;
}

.level{
  background-color: #6c5ce7;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  margin-bottom: 12px;
}

#popup-container {
  animation: fadeIn 0.5s ease-out;
  background-color: var(--background-color) !important;
  box-shadow: 0 10px 20px var(--shadow-color) !important;
  border-radius: 20px !important;
  overflow: hidden !important;
  padding: 24px !important;
  z-index: 10000000000 !important;
  width: 300px !important;
  color: black !important;
  max-height: 350px !important;
  overflow-y: scroll !important;
}

#popup-container::-webkit-scrollbar {
  width: 5px;
}

#popup-container::-webkit-scrollbar-thumb {
  background: linear-gradient(transparent, #6754f5);
  border-radius: 6px;
}

#popup-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(transparent, #5b45fa);
}


#popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

#popup-header h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  color: var(--primary-color);
  text-shadow: 2px 2px 4px var(--shadow-color);
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease, transform 0.2s ease;
  color: var(--text-color);
}

.theme-toggle:hover {
  background-color: var(--hover-color);
  transform: scale(1.1);
}

#popup-content {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

#input-container {
  display: flex;
  gap: 12px;
}

#inp {
  flex-grow: 1;
  padding: 10px 8px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 16px;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}


.bubble_homeworkai {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 3px solid #6c5ce7;
    border-radius: 50%;
    background-color: transparent;
    z-index: 1000;
}

#inp:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--secondary-color);
}

#icon-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 5px 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

#icon-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
}

#icon-button:active {
  transform: translateY(0);
}

#icon-button.submitting {
  animation: pulse 1s infinite;
}

.button-container {
  display: flex;
  justify-content: center;
}

.start-ocr-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 16px;
  width: 100% !important;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
}

.start-ocr-button:hover {
  background-color: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px var(--shadow-color);
}

.start-ocr-button:active {
  transform: translateY(0);
}

.start-ocr-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.start-ocr-button.scanning {
  animation: pulse 1s infinite;
}

.progress-bar-container {
  background-color: var(--border-color);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
}

.progress-bar {
  background-color: var(--primary-color);
  height: 100%;
  transition: width 0.3s ease;
}


#popup-container.closing {
  animation: fadeOut 0.5s ease-in forwards;
}

.spin {
  animation: spin 1s linear infinite;
}

`

export default popupStyles;