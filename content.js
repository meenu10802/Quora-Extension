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



findQuoraEditorAndAddButtons('');


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


function createButton(text) {
  let button = document.createElement("button");
  button.textContent = text;
  button.classList.add(text); // Add class for identifying the button
  // button.style.backgroundColor = "#b92b27";
  // button.style.backgroundColor = "#8ecdf7";
  button.style.color = "white";
  button.style.border = "none";
  button.style.padding = "10px 20px";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.margin = "5px";
  const hostname = window.location.hostname;
  if (hostname.includes('x.com')) {
    
    button.style.backgroundColor = "#8ecdf7"; // Color for Quora
  } else if (hostname.includes('quora.com')) {
    
    button.style.backgroundColor = "#b92b27"; // Color for Twitter
  } else {
    button.style.backgroundColor = "#cccccc"; // Default color
  }
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


// Function to display buttons in the twiiter editor
function displayButtonsInEditorTwitter() {
  const editor = document.querySelector('div[aria-label="Post text"]');
  if (editor && !editor.parentElement.querySelector(".Funny")) {
    let button1 = createButton("Funny");
    let button2 = createButton("Serious");
    let button3 = createButton("Helpful");
    let button4 = createButton("Disagree");
    let button5 = createButton("Strongly_Agree");
    let button6 = createButton("Insightful");

    button1.addEventListener("click", () => {
      console.log("Funny button clicked");
      insertContentIntoTwitterEditor('Funny')
      // Add your logic here for Funny button
    });

    button2.addEventListener("click", () => {
      console.log("Serious button clicked");
      // Add your logic here for Serious button
      insertContentIntoTwitterEditor('Serious')
    });

    button3.addEventListener("click", () => {
      console.log("Helpful button clicked");
      insertContentIntoTwitterEditor('Helpful')
      // Add your logic here for Helpful button
    });

    button4.addEventListener("click", () => {
      console.log("Disagree button clicked");
      insertContentIntoTwitterEditor('Disagree')
      // Add your logic here for Disagree button
    });

    button5.addEventListener("click", () => {
      console.log("Strongly Agree button clicked");
      insertContentIntoTwitterEditor('Strongly Agree ')
      // Add your logic here for Strongly Agree button
    });

    button6.addEventListener("click", () => {
      console.log("Insightful button clicked");
      insertContentIntoTwitterEditor('Insightful')
      // Add your logic here for Insightful button
    });

    // Append buttons to the quoraEditor container
    editor.parentElement.appendChild(button1);
    editor.parentElement.appendChild(button2);
    editor.parentElement.appendChild(button3);
    editor.parentElement.appendChild(button4);
    editor.parentElement.appendChild(button5);
    editor.parentElement.appendChild(button6);
  }
  
}

function insertContentIntoTwitterEditor(content) {
  // Find the Twitter editor
  let prompt =content;
  postData("https://app.spireflow.io/api/v1/llm", { prompt: prompt }).then(
    (data) => {
      console.log(data);
      if (data.success) {
        console.log(data.data);
        const editor = document.querySelector('div[aria-label="Post text"]');
        // Remove the placeholder div if it exists
        const placeholder = document.querySelector('.public-DraftEditorPlaceholder-inner');
        if (placeholder) {
          placeholder.style.display = 'none';
        }
        postText=data.data;
        const textBlock = `
        <div data-contents="true">
          <div class="" data-block="true" data-editor="editor" data-offset-key="textBlock">
            <div data-offset-key="textBlock" class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr">
              <span data-offset-key="textBlock">
                <span data-text="true">${postText}</span>
              </span>
            </div>
          </div>
        </div>
      `;
      editor.innerHTML = textBlock;
        // editor.innerHTML = data.data;
        addImageToPost(imageUrl);
      
     
        // typeTextSlowly(quoraEditor2, data.data);
      }
    }
  );
  
}



function addImageToQuoraPost(imageUrl) {
  const inputElement = document.querySelector('input[type="file"]'); // Adjust the selector as needed to target the image input element on Quora
  if (inputElement) {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'uploaded-image.png', { type: blob.type });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputElement.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        inputElement.dispatchEvent(event);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
  } else {
    alert('Image upload input element not found.');
  }
}


function addImageToPost(imageUrl) {
  const inputElement = document.querySelector('input[data-testid="fileInput"]');
  if (inputElement) {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'uploaded-image.png', { type: blob.type });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputElement.files = dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        inputElement.dispatchEvent(event);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
  } else {
    alert('Image upload input element not found.');
  }
}



function quoraPostwrite(){
  // let prompt = `You are a Quora writer agent, your job is to read this question: "${question}" and now for answer: "${answer}", write a comment for this answer with a ${tone} tone`;
  let prompt ="Hello";
  postData("https://app.spireflow.io/api/v1/llm", { prompt: prompt }).then(
    (data) => {
      console.log(data);
      if (data.success) {
        console.log(data.data);
        const quoraEditor2 = document.querySelector('.q-box.editor_wrapper .doc[contenteditable="true"]');
        quoraEditor2.innerHTML = data.data;

        addImageToQuoraPost(imageUrl);
        // imageUrlToBase64(imageUrl).then(base64Data => {
        //   insertBase64Image(base64Data);
        // }).catch(err => {
        //   console.error('Error converting image URL to base64:', err);
        // });
        // typeTextSlowly(quoraEditor2, data.data);
      }
    }
  );
}

function insertBase64ImageTwitter(base64Image) {
  // Create a new image element
  const img = document.createElement('img');
  img.src = base64Image;

  // Find the Twitter editor
  const editor = document.querySelector('div[aria-label="Post text"]');

  // Remove the placeholder div if it exists
  const placeholder = document.querySelector('.public-DraftEditorPlaceholder-inner');
  if (placeholder) {
    placeholder.style.display = 'none';
  }

  // Insert the image at the caret position in the contenteditable element
  const selection = window.getSelection();
  if (editor && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(img);

    // Move the caret after the inserted image
    range.setStartAfter(img);
    range.setEndAfter(img);
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (editor) {
    // If there's no selection, append the image at the end
    editor.appendChild(img);
  } else {
    console.log('Twitter editor not found.');
  }
}

// Function to insert a base64 image into the Quora editor
function insertBase64Image(base64Image) {
  // Create a new image element
  console.log('Quora editor image section comese.');
  const img = document.createElement('img');
  img.src = base64Image;

  // Find the Quora editor
  const quoraEditor2 = document.querySelector('.q-box.editor_wrapper .doc[contenteditable="true"]'); // Quora editor

  // Insert the image at the caret position in the contenteditable element
  const selection = window.getSelection();
  if (quoraEditor2 && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(img);

    // Move the caret after the inserted image
    range.setStartAfter(img);
    range.setEndAfter(img);
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (quoraEditor2) {
    // If there's no selection, append the image at the end
    quoraEditor2.appendChild(img);
    console.log('Quora editor image section done.');
  } else {
    console.log('Quora editor not found.');
  }
}

// Function to convert image URL to base64
const imageUrlToBase64 = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
};

const vurl="https://unsplash.com/photos/woman-with-dslr-camera-e616t35Vbeg";
// Usage
const imageUrl = 'https://lh3.googleusercontent.com/i7cTyGnCwLIJhT1t2YpLW-zHt8ZKalgQiqfrYnZQl975-ygD_0mOXaYZMzekfKW_ydHRutDbNzeqpWoLkFR4Yx2Z2bgNj2XskKJrfw8';

// Add click event listener to the document
document.addEventListener("click", function (event) {
  
  const quoraTextarea = document.querySelector('.q-text-area.puppeteer_test_selector_input'); // Target the textarea inside the modal
  const quoraEditor2 = document.querySelector('.q-box.editor_wrapper .doc[contenteditable="true"]'); // Quora editor
  const modal = document.querySelector('.ModalContainerInternal___StyledFlex-s8es4q-2'); // Replace with the actual modal class or ID
  // Check if the click is within the modal or the textarea inside the modal
  if (modal && (modal.contains(event.target) || (quoraTextarea && quoraTextarea.contains(event.target)))) {
    displayButtonsInEditor(quoraEditor2);    
  }
  
  const twittereditor = document.querySelector('div[aria-label="Post text"]');
  
  if((twittereditor && twittereditor.contains(event.target))){
    displayButtonsInEditorTwitter()
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
