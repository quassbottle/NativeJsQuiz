import {clickHandler, quiz, unloadQuiz} from "./scripts.js";
import {QuestionType} from "./quiz.js";

window.removeEventListener("DOMContentLoaded", unloadQuiz);
window.removeEventListener("click", clickHandler);

window.addEventListener("DOMContentLoaded", pageLoaded);
window.addEventListener("click", (event) => {
    if (event.target.id === "returnToMenu") {
        onReturnToMenu();
    }
});

function pageLoaded() {
    loadResults();
}

function addAnswer(isCorrect, ...args) {
    let table = document.getElementById("results-table").getElementsByTagName("tbody")[0];
    let row = table.insertRow();
    row.classList.add(isCorrect ? "correctAnswer" : "wrongAnswer");

    let values = [...args];
    values.forEach((value) => {
        row.insertCell().appendChild(document.createTextNode(value));
    });
}

function onReturnToMenu() {
    window.location.replace("index.html");
}

function loadResults() {
    // let guessedAnswers = savedAnswers.filter((value, index) => {
    //     if (value === undefined || value.length === 0) return false;
    //
    //     let sortedKeys = questions[index].answers.sort().filter((src) => {
    //         return src.correct
    //     });
    //
    //     if (questions[index].type === QuestionType.Text) {
    //         return sortedKeys[0] === undefined ? false : sortedKeys[0].title === value[0];
    //     }
    //
    //     let sortedAnswers = typeof value === "string" ?
    //         value.split(',').map((value) => {
    //             return value - 0;
    //         }).sort()
    //         : value.sort();
    //
    //     let answer = sortedKeys.map((src) => {
    //         return src.id
    //     }).sort();
    //
    //     return sortedAnswers.toString() === answer.toString();
    // });

    let savedAnswers;
    let questions;

    try {
        savedAnswers = JSON.parse(sessionStorage["savedAnswers"]);
        questions = JSON.parse(sessionStorage["questions"]);
    }
    catch (ex) {
        onReturnToMenu();
    }

    let points = 0;
    questions.forEach((question, index) => {
        const correctAnswersString = question.answers.filter((val) => {
            return val.correct;
        }).map((val) => {
            return val.title
        }).join(', ');

        let userAnswersString = "";
        if (savedAnswers[index] !== null && savedAnswers !== undefined) {
            if (question.type !== QuestionType.Text) {
                userAnswersString = question.answers.filter((val) => {
                    return index >= savedAnswers.length ? false : savedAnswers[index].includes(val.id);
                }).map((val) => {
                    return val.title;
                }).join(', ');
            }
            else userAnswersString = savedAnswers[index] === undefined ? "" : savedAnswers[index];
        }
        let isCorrect = checkAnswer(savedAnswers[index], question);
        if (isCorrect) points++;
        addAnswer(isCorrect, index + 1, userAnswersString, correctAnswersString);
    });

    document.getElementById("points").innerHTML = `Вы набрали ${points} ${points === 1 ? "балл" :
        points < 5 && points > 1 ? "балла" : "баллов"} из
         ${questions.length}.${points === questions.length ? " Поздравляем!" : ""}`;

    sessionStorage.clear();
}

function checkAnswer(value, question) {
    if (value === null || value === undefined || value.length === 0) return false;

    let sortedKeys = question.answers.sort().filter((src) => {
        return src.correct
    });

    if (question.type === QuestionType.Text) {
        return sortedKeys[0] === undefined ? false : sortedKeys[0].title === value[0];
    }

    let sortedAnswers = typeof value === "string" ?
        value.split(',').map((value) => {
            return value - 0;
        }).sort()
        : value.sort();

    let answer = sortedKeys.map((src) => {
        return src.id
    }).sort();

    return sortedAnswers.toString() === answer.toString();
}