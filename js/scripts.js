import {Quiz} from "./quiz.js";
import {questionsList} from "./questions.js";

export var quiz;

export function unloadQuiz() {
    if (sessionStorage.length <= 1) {
        window.location.replace("index.html");
    }
    quiz = new Quiz(questionsList,
        sessionStorage["testEndsAt"] - 0,
        sessionStorage["shuffleQuestions"] === "true",
        sessionStorage["shuffleAnswers"] === "true");
    quiz.start();
}

export function clickHandler(event) {
    if (event.target.id === "") return;

    const elementId = event.target.id.match("[a-zA-Z]*")[0];
    const choice = Array.from(event.target.id.matchAll("[0-9]*")).filter(match => {
        return match[0] !== "";
    })[0];

    const choiceId = choice === undefined ? 0 : choice[0] - 0;

    console.log(elementId);
    console.log(choiceId);

    if (!quiz.eventHandlers[elementId]) {
        return;
    }

    quiz.eventHandlers[elementId](choiceId, event.target);
}

window.addEventListener("DOMContentLoaded", unloadQuiz);

window.addEventListener("click", clickHandler);