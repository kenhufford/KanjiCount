class LessonTutorial {
    constructor(modalCanvas, modalCtx, canvas, ctx, splash) {
        this.splash = splash;
        this.lesson;
        this.mouse;
        this.modalCanvas = modalCanvas;
        this.modalCtx = modalCtx;
        this.canvas = canvas;
        this.ctx = ctx;
        let now = Date.now();
        this.now = now;
        this.lastTime = now;
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.modaltext = new Modaltext(300, 300, 0);
        this.lessonTutorialPhase = "lessonTutorial1";
        this.modaltext.step = this.lessonTutorialPhase;
        this.languageButton = new Button([330, 320], 120, 50, 4, 33, "Cantonese", "Japanese", "Mandarin", true, 3);
        this.shuffleButton = new Button([330, 380], 120, 50, 4, 33, "Off", "Shuffle", "", true, 2);
        this.readyButton = new Button([390, 500], 120, 50, 4, 33, "Start", "Start", "", false, 1);
        this.kanjiKountButton = new Button([470, 500], 180, 50, 0, 33, "Play Kirby Kount", "Play", "", false, 1);
        this.studySessionButton = new Button([270, 500], 180, 50, 9, 33, "Study Session", "Study", "", false, 1);
        this.background = new Entity([0, 0], backgroundSprite(), backgroundSpriteURL, backgroundSprite);
        this.lesson1buttons = {
            kanjiKountButton: this.kanjiKountButton,
            shuffleBstudySessionButtonutton: this.studySessionButton,
        };
        this.lesson2buttons = {
            languageButton: this.languageButton,
            shuffleButton: this.shuffleButton,
            readyButton: this.readyButton,
        };

        this.loop = this.loop.bind(this);
        this.startLesson = this.startLesson.bind(this);
        this.mouseMoveEvents = this.mouseMoveEvents.bind(this);
        this.mouseClickEvents = this.mouseClickEvents.bind(this);
        this.kirbyLink = document.querySelector("#kirbylink");
        this.lessonsLink = document.querySelector("#lessonlink")
        
    }

    getMousePosition(e) {
        let rect = this.modalCanvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        return [x, y]
    }

    startLesson() {
        this.splash.switchToCanvas();
        let now = Date.now();
        this.lesson.lastTime = now;
        this.stopLessonTutorial();
        this.lesson.init();
    }

    mouseMoveEvents(e){
        
        let modalPos = this.getMousePosition(e);
        this.mouse.update(modalPos[0], modalPos[1])
    }

    mouseClickEvents(e){
        e.preventDefault();
        
        this.mouse.closed = !this.mouse.closed;
        let pos = this.getMousePosition(e);
        if (this.lesson.lessonPhase === "options") {
            if (this.lessonTutorialPhase === "lessonTutorial1") {
                if (this.kanjiKountButton.inside(pos)) {
                    this.lesson.lessonPhase = "complete";
                    this.splash.newGame();
                } else if (this.studySessionButton.inside(pos)) {
                    this.lessonTutorialPhase = "lessonTutorial2";
                    this.modaltext.step = this.lessonTutorialPhase;
                }
            } else if (this.lessonTutorialPhase === "lessonTutorial2") {
                if (this.readyButton.inside(pos)) {
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
    }

    addEventListeners() {
        this.modalCanvas.addEventListener('click', this.mouseMoveEvents);
        this.modalCanvas.addEventListener('click', this.mouseClickEvents)
    }

    init(){
        this.mouse = this.lesson.mouse;
        this.addEventListeners();
        this.loop();
    }

    loop() {
        if (this.lessonTutorialPhase === "stopLessonTutorial") return null;
        this.now = Date.now();
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.lastTime = this.now;
        this.updateTutorial(this.dt);
        this.renderTutorial(this.dt);
        requestAnimFrame(this.loop);
    }


    updateTutorial(dt) {
        Object.keys(this.lesson1buttons).forEach(key => {
            this.lesson1buttons[key].update(dt)
        })
        Object.keys(this.lesson2buttons).forEach(key => {
            this.lesson2buttons[key].update(dt)
        })
    };

    renderTutorial(){
        this.modalCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.modalCtx.globalAlpha = 1.0;
        this.modalCtx.save();
        this.modalCtx.translate(this.background.pos[0], this.background.pos[1]);
        this.background.sprite.render(this.modalCtx);
        this.modalCtx.restore();

        this.modaltext.render(this.modalCtx);

        if (this.lessonTutorialPhase === "lessonTutorial1"){
            Object.keys(this.lesson1buttons).forEach(key => {
                this.lesson1buttons[key].render(this.modalCtx);
            })
        }

        if (this.lessonTutorialPhase === "lessonTutorial2"){
            
            Object.keys(this.lesson2buttons).forEach(key => {
                this.lesson2buttons[key].render(this.modalCtx);
            })
        }
    };

    stopLessonTutorial(){
        this.modalCanvas.removeEventListener('click', this.mouseMoveEvents);
        this.modalCanvas.removeEventListener('click', this.mouseClickEvents);
        this.lessonPhase = "stopLessonTutorial";
    }

}