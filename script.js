let score = 0;
let life = 3;
let correctAnswer = 0;
let countdown;
let timeLeft = 5;
let highScore = localStorage.getItem("highscore") || 0;

let QuestionEl = document.querySelector("#question");
let AnswerEl = document.querySelector("#answer");
let scoreEl = document.querySelector("#scr");
let lifeEl = document.querySelector("#life");
let timeEl = document.querySelector("#time");
let statusEl = document.querySelector("#status");
let highScoreEl = document.querySelector("#highscore");

highScoreEl.innerText = highScore;

// Let Sound

let DeathSound = new Audio("assets/death-bong.mp3");
let CorrectSound = new Audio("assets/correct.mp3");
let WrongSound = new Audio("assets/wrong.mp3");
let AlarmSound = new Audio("assets/alarm.mp3");

// Logic function

function startTimer() {
  clearInterval(countdown);
  timeLeft = 5;
  timeEl.innerText = timeLeft;

  countdown = setInterval(() => {
    timeLeft--;
    timeEl.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      loselife("⏰ Time is Up!", true);
    }
  }, 1000);
}

function loselife(reason = "Wrong Answer!", fromTimer = false) {
  life--;
  lifeEl.innerText = life;

  statusEl.innerText = reason;
  statusEl.style.color = "red";

  if (life <= 0) {
    clearInterval(countdown);
    QuestionEl.innerText = `Game Over. Score = ${score}`;
    statusEl.innerText = '💀You Died';
    AnswerEl.disabled = false;
    AnswerEl.type = "button";
    AnswerEl.value = "Do You want play again?";
    AnswerEl.style.cursor = "pointer";
    DeathSound.play();

    if (score > highScore) {
      localStorage.setItem("highscore", score);
      highScoreEl.innerText = score;
    }

    AnswerEl.onclick = function () {
      location.reload();
    };
  } else {
    if (fromTimer) {
      AlarmSound.currentTime = 0;
      AlarmSound.play();
    } else {
      WrongSound.currentTime = 0;
      WrongSound.play();
    }

    setTimeout(() => {
      statusEl.innerText = "";
      generatorQuestion();
    }, 1000);
  }
}

function generatorQuestion() {
  let num1 = Math.floor(Math.random() * 9) + 1;
  let num2 = Math.floor(Math.random() * 9) + 1;
  let ops = ["+", "-", "*", "/"];
  let operator = ops[Math.floor(Math.random() * ops.length)];

  if (operator === "/") {
    num1 = num1 * num2;
  }

  switch (operator) {
    case "+":
      correctAnswer = num1 + num2;
      break;
    case "-":
      correctAnswer = num1 - num2;
      break;
    case "*":
      correctAnswer = num1 * num2;
      break;
    case "/":
      correctAnswer = num1 / num2;
      break;
  }

  QuestionEl.innerText = `${num1} ${operator} ${num2} = ?`;

  AnswerEl.type = "number";
  AnswerEl.value = "";
  AnswerEl.disabled = false;
  AnswerEl.style.cursor = "text";
  AnswerEl.onclick = null;
  startTimer();
}

AnswerEl.addEventListener("keyup", function (e) {
  if (e.key === "Enter" && life > 0 && AnswerEl.type === "number") {
    const userAnswer = parseFloat(AnswerEl.value);

    if (userAnswer === correctAnswer) {
      score++;
      scoreEl.innerText = score;
      statusEl.innerText = "✅ Correct!";
      statusEl.style.color = "green";
      CorrectSound.play();
      generatorQuestion();
    } else {
      clearInterval(countdown);
      loselife("❌ Wrong Answer!");
    }
  }
});

generatorQuestion();
