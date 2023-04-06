export const QuestionType = {
    Radio: 0,
    Checkbox: 1,
    Text: 2,
    Select: 3,

    getName: (type) => {
        return Object.getOwnPropertyNames(QuestionType)[type];
    }
};
export class QuestionBuilder {
    constructor(type, description = "", title = "") {
        this.title = title;
        this.description = description;
        this.type = type;
        this.answers = [];
    }

    addAnswer = (title, isCorrect = false) => {
        if (this.type === QuestionType.Text && this.answers.length > 0)
            throw "Text answers uses only one answer field.";

        this.answers.push({
            id: this.answers.length,
            correct: isCorrect,
            title: title
        });

        return this;
    }

    build = () => {
        return {
            title: this.title,
            description: this.description,
            type: this.type,
            answers: this.answers
        };
    }
}

export class Quiz {
    constructor(questions, finishTime, shuffleQuestions = false, shuffleAnswers = false) {
        this.questions = questions;
        this.lastQuestion = 0;
        this.currentQuestion = 0;
        this.currentAnswers = [];
        this.savedAnswers = [];
        this.finishTime = finishTime;
        this.shuffleQuestions = shuffleQuestions;
        this.shuffleAnswers = shuffleAnswers;
        this._rnd = new PRNG(finishTime % 1000000);
    }

    start() {
        if (this.shuffleQuestions) this.questions = this._shuffleQuestions();
        if (this.shuffleAnswers) this._shuffleAnswers();

        this._loadAnswersFromSession();
        this._loadElements();
        this._startTimer();
        this._loadSettings();
        this._renderProgressBar();
        this._renderQuestion(this.currentQuestion);
        this._updateProgressBarSelected();

        console.log(this.questions);
    }

    finish(forced = false) {
        if (!forced) {
            if (!confirm("Вы действительно хотите завершить тестирование?"))
                return;
        }

        this._saveAnswers();
        this.timer.stop(false);


        sessionStorage.clear();
        sessionStorage["savedAnswers"] = JSON.stringify(this.savedAnswers);
        sessionStorage["questions"] = JSON.stringify(this.questions)

        window.location.replace("results.html");
    }

    nextQuestion() {
        this._saveAnswers();
        this.lastQuestion = this.currentQuestion;
        this._updateProgressBarStatus(this.currentQuestion)
        this._renderQuestion(++this.currentQuestion);
        this._updateProgressBarSelected();
    }

    previousQuestion() {
        this._saveAnswers();
        this.lastQuestion = this.currentQuestion;
        this._updateProgressBarStatus(this.currentQuestion)
        this._renderQuestion(--this.currentQuestion);
        this._updateProgressBarSelected();
    }

    progressButton(id) {
        this._saveAnswers();
        this.lastQuestion = this.currentQuestion;
        this._updateProgressBarStatus(this.currentQuestion)
        this.currentQuestion = id;
        this._renderQuestion(id);
        this._updateProgressBarSelected();
    }

    answerSelected(id, target) {
        switch (target.type) {
            case "checkbox": {
                if (target.checked) {
                    this.currentAnswers.push(id);
                }
                else this.currentAnswers.splice(this.currentAnswers.indexOf(id, 1));
                break;
            }
            case "radio": {
                if (target.checked) {
                    target.setAttribute("checked", true)
                    this.currentAnswers = [];
                    this.currentAnswers.push(id);
                }
                break;
            }
        }
    }

    _shuffleArray(array) {
        let copy = [...array];
        for (let i = 0; i < copy.length; i++) {
            let j = this._rnd.nextInBounds(i, copy.length);
            let  t = copy[i];
            copy[i] = copy[j];
            copy[j] = t;
        }
        return copy;
    }

    _shuffleQuestions() {
        return this._shuffleArray(this.questions);
    }

    _shuffleAnswers() {
        this.questions.forEach((question) => {
            question.answers = this._shuffleArray(question.answers);
        });
    }
    _startTimer() {
        this.timer = new Timer(this.finishTime, () =>{
            this._onTimerTick();
        }, () => {
            this.finish(true);
        });
        this.timer.start();
    }

    _onTimerTick() {
        this.el.time.text.textContent = `Осталось времени: ${this.timer.hoursLeft > 9 ? this.timer.hoursLeft : "0" + this.timer.hoursLeft
        }:${this.timer.minutesLeft > 9 ? this.timer.minutesLeft : "0" + this.timer.minutesLeft
        }:${this.timer.secondsLeft > 9 ? this.timer.secondsLeft : "0" + this.timer.secondsLeft}`;
    }

    _loadAnswersFromSession() {
        for (let i = 0; i < this.questions.length; i++) {
            if (sessionStorage[i + ""] && (sessionStorage[i + ""] + "").length > 0) {
                console.log(sessionStorage[i + ""])
                this.savedAnswers[i] = sessionStorage[i + ""];
            }
        }
        console.log(this.savedAnswers);
    }

    _loadElements() {
        this.el = {
            buttons: {
                next: document.getElementById("next"),
                finish: document.getElementById("finish"),
                previous: document.getElementById("previous")
            },
            progress: {
                container: document.getElementById("progress")
            },
            text: {
                title: document.getElementById("question-title"),
                description: document.getElementById("question-description")
            },
            answers: document.getElementById("answers"),
            time: {
                container: document.getElementById("time"),
                text: document.getElementById("time-left")
            }
        }

        this.eventHandlers = {
            "next": () => {
                this.nextQuestion();
            },
            "previous": () => {
                this.previousQuestion();
            },
            "finish": () => {
                this.finish();
            },
            "choice": (id, target) => {
                this.answerSelected(id, target);
            },
            "progressButton": (id) => {
                this.progressButton(id);
            }
        };
    }

    _loadSettings() {
        // if (sessionStorage["startTime"] === undefined || sessionStorage["shuffled"])
        //     return;
        // const shuffleArray = (array) => {
        //     for (let i = 1; i < array.length; i++) {
        //         let j = getRandomInt(i + 1);
        //
        //         let t = array[i];
        //         array[i] = array[j];
        //         array[j] = t;
        //     }
        // };
        // const getRandomInt = (max) => {
        //     return Math.floor(Math.random() * max);
        // };
        //
        // if (sessionStorage["shuffleQuestions"]) {
        //     let copy = [...this.questions];
        //     shuffleArray(copy);
        //     this.questions = copy;
        // }
        //
        // if (sessionStorage["shuffleAnswers"]) {
        //     let copy = [...this.questions];
        //
        //     copy.forEach((value) => {
        //         shuffleArray(value.answers);
        //     });
        //
        //     this.questions = copy;
        // }
        //
        // sessionStorage["shuffled"] = true;
    }

    _saveAnswers() {
        if (this.questions[this.currentQuestion].type === QuestionType.Text) {
            let textChoice = document.getElementById("choice0")
            if (textChoice.value !== "")
                this.currentAnswers = [textChoice.value.toLowerCase().trimEnd().trimStart()];
            else this.currentAnswers = [];
        }
        if (this.questions[this.currentQuestion].type === QuestionType.Select) {
            let selectChoice = document.getElementById("select");
            let current = selectChoice.options[selectChoice.selectedIndex].id;
            if (current !== "")
                this.currentAnswers = [current.replace("choice", "") - 0];
            else this.currentAnswers = [];
        }

        this.savedAnswers[this.currentQuestion] = this.currentAnswers;
        sessionStorage[this.currentQuestion] = this.currentAnswers;

        this.currentAnswers = [];
        sessionStorage["currentAnswers"] = [];

        console.log("Saved answers:")
        console.log(this.savedAnswers);
        console.log("===");
    }

    _renderAnswers(question) {
        if (question.type === QuestionType.Select) {
            return `
                <select id="select">
                    ${question.answers.map((val) => {
                return `<option id="choice${val.id}">${val.title}</option>`;
            })};
                </select>
                `;
        }
        return question.answers.map((answer, index) => {
            let answersNotEmpty = this.savedAnswers[this.currentQuestion] !== undefined &&
                this.savedAnswers[this.currentQuestion].length > 0;
            return `
            <label>
                <input type="${QuestionType.getName(question.type).toLowerCase()}" id="choice${answer.id}"
                 name="${question.type === QuestionType.Radio ? "radio" : "answer" + index }"
                ${answersNotEmpty ? (question.type === QuestionType.Text ? `value=${this.savedAnswers[this.currentQuestion]}`
                : this.savedAnswers[this.currentQuestion].includes(index) ? "checked" : "") : ""} />
                    ${question.type === QuestionType.Text ? "" : answer.title}
            </label>
            `
        })
    }

    _renderQuestion(questionId) {
        this.currentAnswers = this.savedAnswers[questionId] === undefined ? [] : this.savedAnswers[questionId];

        this.el.buttons.previous.disabled = questionId === 0;
        this.el.buttons.next.disabled = questionId === this.questions.length - 1;

        this.el.text.title.textContent = `Вопрос #${this.currentQuestion + 1} ${this.questions[this.currentQuestion].title === undefined ||

        this.questions[this.currentQuestion].title === "" ? "" : " - " + this.questions[this.currentQuestion].title}`;
        this.el.text.description.textContent = this.questions[this.currentQuestion].description;

        let test = this._renderAnswers(this.questions[this.currentQuestion]);
        this.el.answers.innerHTML = typeof test === "string" ? test : test.join("");
    }

    _renderProgressBar() {
        this.el.progress.container.innerHTML = this.questions.map((value, index) => {
            return `
            <button id="progressButton${index}" class="progressBar ${sessionStorage[index + ""] !== undefined &&
            (sessionStorage[index + ""] + "").length > 0 ? "answered" : ""}">${index + 1}</button>
            `
        }).join("");
    }

    _updateProgressBarStatus(questionIndex) {
        if (this.savedAnswers[this.currentQuestion] === undefined) return;

        const progressButton = document.getElementById("progressButton" + questionIndex);

        this._updateProgressBarSelected();

        if (this.savedAnswers[this.currentQuestion].length > 0) {
            progressButton.classList.add("answered");
            progressButton.classList.remove("clicked");
        }
        else {
            progressButton.classList.remove("answered");
            progressButton.classList.add("clicked");
        }
    }

    _updateProgressBarSelected() {
        const progressButton = document.getElementById("progressButton" + this.currentQuestion);
        const lastProgressButton = document.getElementById("progressButton" + this.lastQuestion);
        lastProgressButton.classList.remove("selected");
        progressButton.classList.add("selected");
    }
}

class Timer {
    timer;
    hoursLeft;
    minutesLeft;
    secondsLeft;
    constructor(finishTimeMillis, onTick, onFinish, interval = 1000) {
        this.finishTimeMillis = finishTimeMillis - 0;
        this.onTick = onTick;
        this.onFinish = onFinish;
        this.interval = interval;
        this.isRunning = false;
    }

    start() {
        this.isRunning = true;
        this.timer = setInterval(() => {
            this.now = new Date().getTime();
            this.distance = new Date((this.finishTimeMillis - 0)) - this.now;

            this.hoursLeft = Math.floor((this.distance % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
            this.minutesLeft = Math.floor((this.distance % (1000 * 60 * 60))/(1000 * 60));
            this.secondsLeft = Math.floor((this.distance % (1000 * 60))/(1000));

            if (this.distance <= 0) {
                this.stop();
                return;
            }
            this.onTick();
        }, this.interval);
    }

    stop(callFinish = true) {
        if (this.timer === undefined) return;
        clearInterval(this.timer);
        this.isRunning = false;
        if (callFinish) this.onFinish();
    }
}

class PRNG {
    _state;
    constructor(seed = new Date().getTime()) {
        this.seed = seed;
        this._state = seed;
    }

    next() {
        this._state ^= this._state << 13;
        this._state ^= this._state >> 17;
        this._state ^= this._state << 5;
        this._state = Math.abs(this._state);
        return this._state;
    }

    nextToTop(topBound) {
        return this.nextInBounds(0, topBound);
    }

    nextInBounds(lowerBound, topBound) {
        return (this.next() % (topBound - lowerBound)) + lowerBound;
    }
}
