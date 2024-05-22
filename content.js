console.log("Content script loaded 1");

// Function to observe and click all .qt_read_more elements
function observeAndClickMoreButtons() {
  // Create Intersection Observer to click all .qt_read_more elements in viewport
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.click();
        observer.unobserve(entry.target);
      }
    });
  });

  // Observe all .qt_read_more elements in the document
  let allMore = document.querySelectorAll(".qt_read_more");
  allMore.forEach((more) => observer.observe(more));

  // Observe any new elements that might be added later
  const mutationObserver = new MutationObserver(() => {
    let newMore = document.querySelectorAll(".qt_read_more:not(.observed)");
    newMore.forEach((more) => {
      more.classList.add("observed");
      observer.observe(more);
    });
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

// Call the function to start observing
observeAndClickMoreButtons();

document.addEventListener("click", function (event) {
  console.log(event);
  const target = event.target;
  if (target.classList.contains("section")) {
    displayContent(target);
  }

  if (
    target.classList.contains("Funny") ||
    target.classList.contains("Serious") ||
    target.classList.contains("Helpful") ||
    target.classList.contains("Disagree") ||
    target.classList.contains("Strongly_Agree") ||
    target.classList.contains("Insightful")
  ) {
    console.log(`Button ${target.classList} clicked`);
    console.log(target);

    let a =
      target.parentElement.parentElement.parentElement.parentElement
        .parentElement;
    let question = a.querySelector(".puppeteer_test_question_title").innerText;

    // Clicking on Read more
    let more = a.querySelector(".qt_read_more");
    more?.click();

    let answer = a.querySelector(".puppeteer_test_answer_content").innerText;
    console.log(answer);
    console.log(question);
    let tone = target.textContent;

    let prompt = `You are a Quora writer agent, your job is to read this question: "${question}" and now for answer: "${answer}", write a comment for this answer with a ${tone} tone`;

    postData("https://visitsaudiai.com/api/v1/llm", { prompt: prompt }).then(
      (data) => {
        console.log(data);
        if (data.success) {
          console.log(data.data);
          let commentBox = target.parentElement.querySelector(".section");
          typeTextSlowly(commentBox, data.data);
        }
      }
    );
  }
  console.log(target);
});

function displayContent(target) {
  console.log(target);
  let sectionElement =
    target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
      .parentNode;
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

    const buttonStyle = {
      backgroundColor: "#b92b27",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "5px",
    };

    const button1Style = {
      marginLeft: "70px",
    };
    const button5Style = {
      marginLeft: "70px",
    };

    Object.assign(button1.style, buttonStyle, button1Style);
    Object.assign(button2.style, buttonStyle);
    Object.assign(button3.style, buttonStyle);
    Object.assign(button4.style, buttonStyle);
    Object.assign(button5.style, buttonStyle, button5Style);
    Object.assign(button6.style, buttonStyle);

    sectionElement.insertAdjacentElement("afterend", button6);
    sectionElement.insertAdjacentElement("afterend", button5);
    sectionElement.insertAdjacentElement("afterend", button4);
    sectionElement.insertAdjacentElement("afterend", button3);
    sectionElement.insertAdjacentElement("afterend", button2);
    sectionElement.insertAdjacentElement("afterend", button1);
  }
}

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
