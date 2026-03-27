const questions = [
    {
        question: "Which of the following is not typically considered a Scripting Language?",
        options: ["Python", "JavaScript", "C++", "Ruby"],
        correct: 2
    },
    {
        question: "What does DOM stand for in JavaScript?",
        options: [
            "Document Object Model", 
            "Data Object Mechanism", 
            "Document Oriented Model", 
            "Digital Object Matrix"
        ],
        correct: 0
    },
    {
        question: "Which keyword is used to declare a block-scoped variable in JavaScript?",
        options: ["var", "let", "function", "global"],
        correct: 1
    },
    {
        question: "Which Python data structure is an ordered and mutable collection?",
        options: ["Tuple", "List", "Set", "Dictionary"],
        correct: 1
    },
    {
        question: "What symbol is used for comments in Bash scripting?",
        options: ["//", "/*", "#", "--"],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;

const startScreen = document.getElementById("start-screen");
const progressContainer = document.getElementById("progress-container");
const startBtn = document.getElementById("start-btn");

const nameInput = document.getElementById("name");
const rollnoInput = document.getElementById("rollno");
const branchInput = document.getElementById("branch");

const resName = document.getElementById("res-name");
const resRollno = document.getElementById("res-rollno");
const resBranch = document.getElementById("res-branch");

const quizSection = document.getElementById("quiz");
const resultsSection = document.getElementById("results");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const restartBtn = document.getElementById("restart-btn");

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    
    quizSection.classList.remove("hidden");
    quizSection.classList.add("active");
    resultsSection.classList.remove("active");
    resultsSection.classList.add("hidden");
    
    loadQuestion();
}

function loadQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionEl.innerText = currentQuestion.question;
    
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressEl.style.width = `${progressPercent}%`;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.addEventListener("click", () => selectAnswer(index, button));
        optionsEl.appendChild(button);
    });
}

function resetState() {
    nextBtn.classList.add("hidden");
    feedbackEl.innerText = "";
    optionsEl.innerHTML = "";
}

function selectAnswer(selectedIndex, selectedButton) {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuestion.correct;
    
    const allButtons = optionsEl.querySelectorAll(".option-btn");
    
    allButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === currentQuestion.correct) {
            btn.classList.add("correct");
        } else if (idx === selectedIndex && !isCorrect) {
            btn.classList.add("wrong");
        }
    });

    if (isCorrect) {
        score++;
        feedbackEl.innerText = "Correct! 🎉";
        feedbackEl.style.color = "#48bb78";
    } else {
        feedbackEl.innerText = "Incorrect! ❌";
        feedbackEl.style.color = "#f56565";
    }

    nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
});

function endQuiz() {
    quizSection.classList.remove("active");
    quizSection.classList.add("hidden");
    resultsSection.classList.remove("hidden");
    resultsSection.classList.add("active");
    
    scoreEl.innerText = score;
    totalEl.innerText = questions.length;
    progressEl.style.width = "100%";
}

startBtn.addEventListener("click", () => {
    if (!nameInput.value.trim() || !rollnoInput.value.trim() || !branchInput.value.trim()) {
        alert("Please fill out all details.");
        return;
    }
    
    resName.innerText = nameInput.value;
    resRollno.innerText = rollnoInput.value;
    resBranch.innerText = branchInput.value;
    
    startScreen.classList.remove("active");
    startScreen.classList.add("hidden");
    progressContainer.classList.remove("hidden");
    
    initQuiz();
});

restartBtn.addEventListener("click", initQuiz);
