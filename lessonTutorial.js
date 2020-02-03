class LessonTutorial {
    constructor(modalCanvas, modalCtx, canvas, ctx, lesson) {
        this.lesson = lesson;
        this.modalCanvas = modalCanvas;
        this.modalCtx = modalCtx;
        this.canvas = canvas;
        this.ctx = ctx;
        this.language = "cantonese";
        let now = Date.now();
        this.now = now;
        this.lastTime = now;
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.modaltext = new Modaltext(300, 300, 0);
        this.step = "lesson1";
        this.modaltext.step = this.step;
        this.languageButton = new Button([350, 320], 120, 50, 4, 33, "Cantonese", "Japanese", "", true);
        this.shuffleButton = new Button([350, 380], 120, 50, 4, 33, "Off", "Shuffle", "", true);
        this.readyButton = new Button([400, 500], 120, 50, 4, 33, "Start", "Start", "", false);
        this.buttons = {
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
                if (this.step === "lesson1" || this.step === "lesson2") {
                    switch (this.step) {
                        case "lesson1":
                            this.step = "lesson2"
                            break;
                        case "lesson2":
                            this.step = "lesson3"
                            break;
                        default:
                            break;
                    }
                    this.modaltext.step = this.step;
                }
                if (this.readyButton.inside(pos)) {
                    this.readyButton.flipped = !this.readyButton.flipped;
                    this.startLesson();
                } else if (this.languageButton.inside(pos)) {
                    this.languageButton.flipped = !this.languageButton.flipped;
                    this.lesson.language = this.lesson.language === "cantonese" ? "japanese" : "cantonese";
                } else if (this.shuffleButton.inside(pos)) {
                    this.shuffleButton.flipped = !this.shuffleButton.flipped;
                    this.lesson.shuffle = !this.lesson.shuffle;
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
        // this.lesson.gameTime += dt;
        
        Object.keys(this.buttons).forEach(key => {
            this.buttons[key].update(dt)
        })
    };

    renderTutorial(){
        this.modalCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.modalCtx.globalAlpha = 0.9;
        this.modalCtx.fillStyle = "#000000";
        this.modalCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.modaltext.render(this.modalCtx);

        if (this.step === "lesson3"){
            Object.keys(this.buttons).forEach(key => {
                this.buttons[key].render(this.modalCtx);
            })
        }

    };

}