console.log("Content script loaded 1");
console.log("Content script loaded sjhubahm");


// Listen for messages from the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'findQuoraEditor') {
    const response = message.response;
    findQuoraEditorAndAddButtons(response);
  }
  else if (message.action === 'insertTextIntoLinkedInShareBox') {
    const response = message.response;
   
    insertTextIntoLinkedInShareBox(response);
  }
});





const findQuoraEditorAndAddButtons = (response) => {
  const quoraEditor = document.querySelector('.q-box.editor_wrapper .doc[contenteditable="true"]');
  if (quoraEditor) {
    console.log('Quora editor found:', quoraEditor);
    // Append buttons inside the Quora editor
    displayButtonsInEditor();
    // Insert response into Quora editor
    quoraEditor.innerHTML = response;
    console.log('Inserted response into Quora editor:', response);
  } else {
    console.log('Quora editor not found. Retrying...');
    setTimeout(() => findQuoraEditorAndAddButtons(response), 1000); // Retry after 1 second
  }
};




const insertTextIntoLinkedInShareBox = (text) => {
  console.log('Attempting to find LinkedIn Share Box...');
  const shareBox = document.querySelector('.share-box .editor-container .ql-editor[role="textbox"]');
  
  if (shareBox) {
    console.log('LinkedIn Share Box found:', shareBox);
    shareBox.innerText = text;
    console.log('Inserted text into LinkedIn Share Box:', text);
  } else {
    console.log('LinkedIn Share Box not found. Retrying...');
    setTimeout(() => insertTextIntoLinkedInShareBox(text), 1000); // Retry after 1 second
  }
};


function observeAndClickMoreButtons() {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.click();
        observer.unobserve(entry.target);
      }
    });
  });

  let allMore = document.querySelectorAll(".qt_read_more");
  allMore.forEach((more) => observer.observe(more));

  const mutationObserver = new MutationObserver(() => {
    let newMore = document.querySelectorAll(".qt_read_more:not(.observed)");
    newMore.forEach((more) => {
      more.classList.add("observed");
      observer.observe(more);
    });
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

observeAndClickMoreButtons();


// Select the Quora editor
// Function to create buttons



function createButton(text) {
  let button = document.createElement("button");
  button.textContent = text;
  button.classList.add(text); // Add class for identifying the button
  button.style.backgroundColor = "#b92b27";
  button.style.color = "white";
  button.style.border = "none";
  button.style.padding = "10px 20px";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.margin = "5px";
  return button;
}

// Function to display buttons in the Quora editor
function displayButtonsInEditor() {
  const quoraEditor2 = document.querySelector('.q-box.editor_wrapper .doc[contenteditable="true"]');
  if (quoraEditor2 && !quoraEditor2.parentElement.querySelector(".Funny")) {
    let button1 = createButton("Funny");
    let button2 = createButton("Serious");
    let button3 = createButton("Helpful");
    let button4 = createButton("Disagree");
    let button5 = createButton("Strongly_Agree");
    let button6 = createButton("Insightful");

    button1.addEventListener("click", () => {
      console.log("Funny button clicked");
      quoraPostwrite()
      // Add your logic here for Funny button
    });

    button2.addEventListener("click", () => {
      console.log("Serious button clicked");
      // Add your logic here for Serious button
      quoraPostwrite()
    });

    button3.addEventListener("click", () => {
      console.log("Helpful button clicked");
      quoraPostwrite()
      // Add your logic here for Helpful button
    });

    button4.addEventListener("click", () => {
      console.log("Disagree button clicked");
      quoraPostwrite()
      // Add your logic here for Disagree button
    });

    button5.addEventListener("click", () => {
      console.log("Strongly Agree button clicked");
      quoraPostwrite()
      // Add your logic here for Strongly Agree button
    });

    button6.addEventListener("click", () => {
      console.log("Insightful button clicked");
      quoraPostwrite()
      // Add your logic here for Insightful button
    });

    // Append buttons to the quoraEditor container
    quoraEditor2.parentElement.appendChild(button1);
    quoraEditor2.parentElement.appendChild(button2);
    quoraEditor2.parentElement.appendChild(button3);
    quoraEditor2.parentElement.appendChild(button4);
    quoraEditor2.parentElement.appendChild(button5);
    quoraEditor2.parentElement.appendChild(button6);
  }
}

function quoraPostwrite()
{
  // let prompt = `You are a Quora writer agent, your job is to read this question: "${question}" and now for answer: "${answer}", write a comment for this answer with a ${tone} tone`;
  let prompt ="Hello";
  postData("https://app.spireflow.io/api/v1/llm", { prompt: prompt }).then(
    (data) => {
      console.log(data);
      if (data.success) {
        console.log(data.data);
        const quoraEditor2 = document.querySelector('.q-box.editor_wrapper .doc[contenteditable="true"]');
 
        typeTextSlowly(quoraEditor2, data.data);
      }
    }
  );
}

// Insert the base64 image into the editor


// Function to insert a base64 image into the editor
function insertBase64Image(base64Image) {
  // Create a new image element
  const img = document.createElement('img');
  img.src = base64Image;

  // Insert the image at the caret position in the contenteditable element
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(img);

    // Move the caret after the inserted image
    range.setStartAfter(img);
    range.setEndAfter(img);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    // If there's no selection, append the image at the end
    quoraEditor2.appendChild(img);
  }
}
// Add click event listener to the document
document.addEventListener("click", function (event) {


  const quoraTextarea = document.querySelector('.q-text-area.puppeteer_test_selector_input'); // Target the textarea inside the modal
  const quoraEditor2 = document.querySelector('.q-box.editor_wrapper .doc[contenteditable="true"]'); // Quora editor

  // Check if the click is within the modal or the textarea inside the modal
  if (modal && (modal.contains(event.target) || (quoraTextarea && quoraTextarea.contains(event.target)))) {
    displayButtonsInEditor(quoraEditor2);
  }
  
  
});

async function typeTextSlowly(element, text, speed = 20) {
  element.textContent = "";
  for (let char of text) {
    element.textContent += char;
    await new Promise((resolve) => setTimeout(resolve, speed));
  }
}

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
}

function displayContent(target) {
  let sectionElement =
    target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      .parentNode;
  if (sectionElement && !sectionElement.parentElement.querySelector(".Funny")) {
    let button1 = createButton("Funny");
    let button2 = createButton("Serious");
    let button3 = createButton("Helpful");
    let button4 = createButton("Disagree");
    let button5 = createButton("Strongly Agree");
    let button6 = createButton("Insightful");

    sectionElement.insertAdjacentElement("afterend", button6);
    sectionElement.insertAdjacentElement("afterend", button5);
    sectionElement.insertAdjacentElement("afterend", button4);
    sectionElement.insertAdjacentElement("afterend", button3);
    sectionElement.insertAdjacentElement("afterend", button2);
    sectionElement.insertAdjacentElement("afterend", button1);
  }
}
