function onStartQuiz() {
    sessionStorage.clear();

    const shuffleAnswers = document.getElementById("shuffleAnswers").checked;
    const shuffleQuestions = document.getElementById("shuffleQuestions").checked;
    const minutes = document.getElementById("minutes").value - 0;
    const seconds = document.getElementById("seconds").value - 0;

    sessionStorage["shuffleAnswers"] = shuffleAnswers;
    sessionStorage["shuffleQuestions"] = shuffleQuestions;
    sessionStorage["minutes"] = minutes;
    sessionStorage["seconds"] = seconds;

    if (minutes <= 0) {
        alert("Введите корректное время");
        return;
    }

    if (seconds <= 0 && minutes <= 0) {
        alert("Введите корректное время");
        return;
    }

    sessionStorage["testEndsAt"] = new Date().getTime() + Math.min(((60 * 1000 * minutes) + (1000 * seconds)), 1000 * 60 * 60 * 24 - 1000);

    onContinueQuiz();
}

function onContinueQuiz() {
    window.location.replace("quiz.html");
}

const continueButton = document.getElementById("continueQuiz");

addEventListener("click", (event) => {
    if (event.target.id === "startQuiz") onStartQuiz();
    if (event.target.id === "continueQuiz") onContinueQuiz();
})

addEventListener("DOMContentLoaded", () => {
    if (sessionStorage["startTime"] === undefined) {
        continueButton.disabled = true;
    }
})