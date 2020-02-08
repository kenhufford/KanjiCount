class Splash{
    constructor(canvas, ctx, modalCanvas, modalCtx){
        this.canvas = canvas;
        this.ctx = ctx;
        this.modalCanvas = modalCanvas; 
        this.modalCtx = modalCtx;
        this.game = new Game("easy", "cantonese", canvas, ctx, modalCanvas, modalCtx, this);
        this.tutorial = new Tutorial(modalCanvas, modalCtx, canvas, ctx, this.game);
        this.game.tutorial = this.tutorial;
        this.lessonTutorial = new LessonTutorial(modalCanvas, modalCtx, canvas, ctx, this);
        this.lesson = new Lesson("cantonese", canvas, ctx, modalCanvas, modalCtx, this.lessonTutorial, this);
        this.lessonTutorial.lesson = this.lesson;
    }

    newGame(){
        this.stopAll();
        this.game = new Game("easy", "cantonese", canvas, ctx, modalCanvas, modalCtx, this);
        this.tutorial = new Tutorial(modalCanvas, modalCtx, canvas, ctx, this.game, this);
        this.game.tutorial = this.tutorial;
        this.switchToModalCanvas();
        this.game.init();
    }

    newLesson(restart){
        this.stopAll();
        this.lessonTutorial = new LessonTutorial(modalCanvas, modalCtx, canvas, ctx, this);
        this.lesson = new Lesson("cantonese", canvas, ctx, modalCanvas, modalCtx, this.lessonTutorial, this);
        this.lessonTutorial.lesson = this.lesson;

        if (restart) {
            this.lessonTutorial.lessonTutorialPhase = "lessonTutorial2";
            this.lessonTutorial.modaltext.step = "lessonTutorial2";
        }
        this.switchToModalCanvas();
        this.lessonTutorial.init();
    }

    stopAll(){
        this.lesson.stopLesson();
        this.lessonTutorial.stopLessonTutorial();
        this.game.stopGame();
        this.tutorial.stopTutorial();
    }

    switchToModalCanvas(){
        canvas.classList.remove('front-canvas');
        canvas.classList.add('back-canvas');
        modalCanvas.classList.remove('back-canvas');
        modalCanvas.classList.add('front-canvas');
    }

    switchToCanvas(){
        canvas.classList.add('front-canvas');
        canvas.classList.remove('back-canvas');
        modalCanvas.classList.add('back-canvas');
        modalCanvas.classList.remove('front-canvas');
    }
}