// 0 => server not initial
// 1 => server connection established
// 2 => request receive
// 3 =>  proccessing request
// 4 => request is finish and response is ready
// 200 => response is Ok
// Select Elements

let countSpan = document.querySelector(".count span");
let bullets = document.querySelectorAll(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizAria = document.querySelector(".quiz-aria");
let answersArea = document.querySelector(".answers-aria");
let submit = document.querySelector(".submit-button");
let results = document.querySelector(".results");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      //Create Bullets + Set Questions Count
      createBullets(qCount);
      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);
      // Submit Button
      submit.onclick = () => {
        // Get Right Answer
        let rightAnswer = questionsObject[currentIndex].right_answer;
        // Increase Index
        currentIndex++;
        // Check Answers
        checkAnswer(rightAnswer, qCount);
        //Remove Previous Question
        quizAria.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], qCount);
        // Handle Bullets Classes
        handleBullets();
        // Show Results
        showResults(qCount);
        
      };
    }
  };

  myRequest.open("GET", "html-questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;
  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");
    // Check If It First Span
    if (i === 0) {
      theBullet.className = "on";
    }

    //Append Bullet To Main bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let QuestionTitle = document.createElement("h2");
    // Create Question Text
    let questionText = document.createTextNode(obj.title);
    // Append Text To H2
    QuestionTitle.appendChild(questionText);
    // append H2 To The Quiz Area
    quizAria.appendChild(QuestionTitle);
    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");
      // Add Class To Main Div
      mainDiv.className = "answer";
      // Create Radio Input
      let radioInput = document.createElement("input");
      // Add Type + Name + Id + Data Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }
      // Create Label
      let theLabel = document.createElement("label");
      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;
      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      // Add The Text To Label
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer = "";
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  // console.log(` the right answer is :  ${rAnswer}`);
  // console.log(` the choosen answer is :  ${theChoosenAnswer}`);
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    // console.log(`The right answers is : ${rightAnswers}`)
    // console.log(" Good Answer ")
  } else {
    // console.log(" Bad Answer ")
  }
}
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span ");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    console.log("Questions Is Finished");
    quizAria.remove();
    answersArea.remove();
    submit.remove();
    bulletsSpanContainer.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `the right answers is ${rightAnswers} from ${count}`;
    } else if (rightAnswers === count) {
      theResults = `the right answers is ${rightAnswers} from ${count}`;
    } else {
      theResults = `the right answers is ${rightAnswers} from ${count}`;
    }
    results.innerHTML = theResults;
  }
}
