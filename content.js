/*global chrome*/
console.log("Content script loaded 1");
document.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains('section')) {
    displayContent(target);
    // chrome.runtime.sendMessage({ action: 'answerBoxClicked' , target: target} );
    //chrome.runtime.sendMessage({ action: 'answerBoxClicked', question: question, content:content });
  }
  if (target.classList.contains('Funny') ||  //classlist instead of text.Content
    target.classList.contains('Serious') ||
    target.classList.contains('Helpful') ||
    target.classList.contains('Disagree') ||
    target.classList.contains('Strongly_Agree') ||
    target.classList.contains('Insightful')) {
    console.log(`Button ${target.classList} clicked`);
    console.log(target)
    let a = target.parentElement.parentElement.parentElement.parentElement.parentElement
    // let a=<button style="background-color: rgb(185, 43, 39); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px 5px 5px 70px;">Funny</button>
    // let a = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    let question = a.querySelector(".puppeteer_test_question_title").innerText;
    let more = a.querySelector(".qt_read_more");
    more?.click();

    setTimeout(function () {
      const element = target.parentElement;
      const offset = 45;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 500);

    let answer = a.querySelector(".puppeteer_test_answer_content").innerText;
    // console.log("Sending message to background script...");
    console.log(answer);
    console.log(question);
    let tone = target.textContent;

    let prompt = `You are a Quora writer agent, your job is to read this question: "${question}" and now for answer: "${answer}", write a comment for this answer with a ${tone} tone`;
    // let prompt = `Question: ${question}\nContent: ${answer}\nTone: ${tone}`;

    postData("https://visitsaudiai.com/api/v1/llm", { prompt: prompt }).then((data) => {
      console.log(data); // JSON data parsed by `data.json()` call
      if (data.success) {
        console.log(data.data);
        // target.parentElement.querySelector(".section").textContent = data.data;
        let commentBox = target.parentElement.querySelector(".section");
        commentBox.textContent = "";
        for (let i of data.data) {
          commentBox.textContent += i;
        }
      }
    });
    // chrome.runtime.sendMessage({ action: 'buttonClicked', tone: target.textContent, question: question, content: content });
  }
  console.log(target)
});

function displayContent(target) {
  console.log(target);
  let sectionElement = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  // let sectionElement = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
  if (sectionElement && !sectionElement.parentElement.querySelector(".Funny")) {
    let button1 = document.createElement("button");
    let button2 = document.createElement("button");
    let button3 = document.createElement("button");
    let button4 = document.createElement("button");
    let button5 = document.createElement("button");
    let button6 = document.createElement("button");

    button1.textContent = "Funny";
    button2.textContent = "Serious";
    button3.textContent = "Helpful";
    button4.textContent = "Disagree";
    button5.textContent = "Strongly Agree";
    button6.textContent = "Insightful";

    button1.classList.add("Funny");
    button2.classList.add("Serious");
    button3.classList.add("Helpful");
    button4.classList.add("Disagree");
    button5.classList.add("Strongly_Agree");
    button6.classList.add("Insightful");

    const buttons = [button1, button2, button3, button4, button5, button6];
    const tones = ["Funny", "Serious", "Helpful", "Disagree", "Strongly Agree", "Insightful"];

    // Apply common styles to buttons
    const buttonStyle = {
      backgroundColor: "#b92b27", // Quora's logo color
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "5px" // Add margin for spacing between buttons
    };

    // Apply specific margin to button1 and button6 to shift them to the right
    const button1Style = {
      marginLeft: "70px" // Adjust this value as needed to shift button1 to the right
    };
    const button5Style = {
      marginLeft: "70px" // Adjust this value as needed to shift button6 to the right
    };

    Object.assign(button1.style, buttonStyle, button1Style);
    Object.assign(button2.style, buttonStyle);
    Object.assign(button3.style, buttonStyle);
    Object.assign(button4.style, buttonStyle);
    Object.assign(button5.style, buttonStyle, button5Style);
    Object.assign(button6.style, buttonStyle);

    sectionElement.insertAdjacentElement('afterend', button6);
    sectionElement.insertAdjacentElement('afterend', button5);
    sectionElement.insertAdjacentElement('afterend', button4);
    sectionElement.insertAdjacentElement('afterend', button3);
    sectionElement.insertAdjacentElement('afterend', button2);
    sectionElement.insertAdjacentElement('afterend', button1);
  }
}

// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}