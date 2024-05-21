/*global chrome*/
//import axios from 'axios';
console.log("Background script loaded");

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
  if (message.action === 'buttonClicked') {
    let tone = message.tone;
    let content = message.content;
    let question = message.question;
    let prompt = `Question: ${question}\nContent: ${content}`; 

// let payload = {
//   prompt: prompt
// };

//axios.post("https://visitsaudiai.com/api/v1/llm", 
// payload, {
//   headers: {
//     "Content-Type": "application/json"
//   }
// })
// .then(response => {
//   console.log("API Response:", response.data);
//   let apiResponse = response.data;
//   console.log("Stored API Response:", apiResponse);

//   if (apiResponse.success) {
//     const responseDataElement = document.getElementById('responseData');
//     // Clear existing content
//     responseDataElement.textContent = '';
//     // Start the typing animation
//     animateTyping(apiResponse.data, responseDataElement);
//   } else {
//     console.error("API request failed:", apiResponse.message);
//   }
// })
// .catch(error => {
//   console.error("Error:", error);
// });

    console.log(`Button clicked with tone: ${tone}`);
    console.log(`Question: ${question}`);
    console.log(`Answer: ${content}`);
    
  }
});