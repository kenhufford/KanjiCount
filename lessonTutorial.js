class LessonTutorial {
    constructor(modalCanvas, modalCtx, canvas, ctx, lesson) {
        this.lesson = lesson;
        this.modalCanvas = modalCanvas;
        this.modalCtx = modalCtx;
        this.canvas = canvas;
        this.ctx = ctx;
        let now = Date.now();
        this.now = now;
        this.lastTime = now;
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.modaltext = new Modaltext(300, 300, 0);
        this.step = "lesson1";
        this.modaltext.step = this.step;
        this.languageButton = new Button([330, 320], 120, 50, 4, 33, "Cantonese", "Japanese", "Mandarin", true, 3);
        this.shuffleButton = new Button([330, 380], 120, 50, 4, 33, "Off", "Shuffle", "", true, 2);
        this.readyButton = new Button([390, 500], 120, 50, 4, 33, "Start", "Start", "", false, 1);
        this.kanjiKountButton = new Button([470, 500], 120, 50, 4, 33, "Play", "Play", "", false, 1);
        this.studySessionButton = new Button([270, 500], 120, 50, 4, 33, "Study", "Study", "", false, 1);
        this.lesson2buttons = {
            kanjiKountButton: this.kanjiKountButton,
            shuffleBstudySessionButtonutton: this.studySessionButton,
        }
        this.lesson3buttons = {
            languageButton: this.languageButton,
            shuffleButton: this.shuffleButton,
            readyButton: this.readyButton,
        }
        this.addEventListeners();

        this.loop = this.loop.bind(this);
        this.startNewLesson = this.startNewLesson.bind(this);
        this.startLesson = this.startLesson.bind(this);
        this.kirbyLink = document.querySelector("#kirbylink");
        this.lessonsLink = document.querySelector("#lessonlink")
    }

    getMousePosition(e) {
        let rect = this.modalCanvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        return [x, y]
    }

    startNewLesson() {
        this.canvas.classList.add('front-canvas');
        this.canvas.classList.remove('back-canvas');
        this.modalCanvas.classList.add('back-canvas');
        this.modalCanvas.classList.remove('front-canvas');
        this.lesson.lessonPhase == "complete";
        this.lesson = new Lesson("cantonese", canvas, ctx, modalCanvas, modalCtx);
        this.lesson.init();
    }

    startLesson() {
        this.canvas.classList.add('front-canvas');
        this.canvas.classList.remove('back-canvas');
        this.modalCanvas.classList.add('back-canvas');
        this.modalCanvas.classList.remove('front-canvas');
        let now = Date.now();
        this.lesson.lastTime = now;
        this.lesson.init();
    }

    addEventListeners() {
        this.modalCanvas.onmousemove = (e) => {
            if (this.lesson.lessonPhase !== "option") return null;
            let modalPos = this.getMousePosition(e);
            this.lesson.mouse.update(modalPos[0], modalPos[1])
        }

        this.modalCanvas.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.lesson.lessonPhase !== "options") return null
            this.lesson.mouse.closed = !this.lesson.mouse.closed;
            let pos = this.getMousePosition(e);

            if (this.lesson.lessonPhase === "options" ) {
                if (this.step === "lesson1") {
                    this.step = "lesson2";
                    this.modaltext.step = this.step;
                } else {
                    if (this.kanjiKountButton.inside(pos)) {
                        this.lesson.lessonPhase = "complete";
                        let game = new Game("easy", "cantonese", canvas, ctx, modalCanvas, modalCtx);
                        game.start();
                    } else if (this.studySessionButton.inside(pos)) {
                        this.step = "lesson3";
                        this.modaltext.step = this.step;
                    } else if (this.readyButton.inside(pos)) {
                        this.readyButton.slide();
                        this.startLesson();
                    } else if (this.languageButton.inside(pos)) {
                        this.languageButton.slide();
                        if (this.languageButton.flipPosition === 1) {
                            this.lesson.language = "cantonese";
                        } else if (this.languageButton.flipPosition === 2) {
                            this.lesson.language = "japanese";
                        } else if (this.languageButton.flipPosition === 3) {
                            this.lesson.language = "mandarin";
                        }
                    } else if (this.shuffleButton.inside(pos)) {
                        this.shuffleButton.slide();
                        this.lesson.shuffle = !this.lesson.shuffle;
                    } 
                }
            }
        })
    }

    loop() {
        if (this.lesson.lessonPhase === "lessons") return null;
        this.now = Date.now();
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.lastTime = this.now;
        this.updateTutorial(this.dt);
        this.renderTutorial(this.dt);
        requestAnimFrame(this.loop);
    }


    updateTutorial(dt) {
        Object.keys(this.lesson2buttons).forEach(key => {
            this.lesson2buttons[key].update(dt)
        })
        Object.keys(this.lesson3buttons).forEach(key => {
            this.lesson3buttons[key].update(dt)
        })
    };

    renderTutorial(){
        this.modalCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.modalCtx.globalAlpha = 0.9;
        this.modalCtx.fillStyle = "#000000";
        this.modalCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.modaltext.render(this.modalCtx);

        if (this.step === "lesson2"){
            Object.keys(this.lesson2buttons).forEach(key => {
                this.lesson2buttons[key].render(this.modalCtx);
            })
        }

        if (this.step === "lesson3"){
            Object.keys(this.lesson3buttons).forEach(key => {
                this.lesson3buttons[key].render(this.modalCtx);
            })
        }

    };

}