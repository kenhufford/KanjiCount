class Lesson{
    constructor(language, canvas, ctx, modalCanvas, modalCtx, lessonTutorial, splash){
        this.splash = splash;
        this.language = language;
        this.index = 0;
        this.finalIndex = 13;
        this.indices = Array.from(Array(this.finalIndex+1).keys())
        this.shuffle = false;
        this.lessonPhase = "options";
        this.numbers = {
            0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7,
            8: 8, 9: 9, 10: 10, 11: 100, 12: 1000, 13: 10000
        }
        this.canvas = canvas;
        this.ctx = ctx;
        this.modalCanvas = modalCanvas;
        this.modalCtx = modalCtx;
        this.now = Date.now();
        this.lastTime = this.now;
        this.dt = (this.now - this.lastTime )/ 1000;
        this.lessonLoop = this.lessonLoop.bind(this);
        this.mouse = new Mouse (0,0);
        this.number;
        this.lessonTutorial = lessonTutorial;
        this.leftSideArrow = new SideArrow(50,275, "left", this.ctx);    
        this.rightSideArrow = new SideArrow(830, 275, "right", this.ctx);
        this.background = new Entity([0, 0], backgroundSprite(), backgroundSpriteURL, backgroundSprite);
        this.kirbyLink = document.querySelector("#kirbylink");
        this.lessonsLink = document.querySelector("#lessonlink")
        this.addEventListeners = this.addEventListeners.bind(this);
        this.canvas.classList.add('mouse-vis-canvas');
        this.mouseMoveEvents = this.mouseMoveEvents.bind(this);
        this.mouseClickEvents = this.mouseClickEvents.bind(this);
    }

    mouseMoveEvents(e){
        e.preventDefault();
        let pos = this.getMousePosition(e);
        this.mouse.update(pos[0], pos[1]);
        
        this.number.circles.forEach(circle => {
            if (circle.inside(pos)) {
                circle.pinged = true;
            }
        })
    }

    mouseClickEvents(e){
        e.preventDefault();
        let pos = this.getMousePosition(e);
        
        if (this.number.circleSelected) {
            let circle = this.number.circleSelected;
            if (this.number.circles[0].inside(pos)) {
                this.number.answer();
            }
            circle.grabbed = false;
            circle.x = circle.originalX;
            circle.y = circle.originalY;
            this.number.circleSelected = null;
        } else if (this.leftSideArrow.inside(pos)) {
            this.prevNum();
        } else if (this.rightSideArrow.inside(pos)) {
            this.nextNum();
        } else {
            this.number.circles.forEach(circle => {
                if (circle.inside(pos) && !circle.grabbed && !circle.immovable) {
                    circle.grabbed = true;
                    this.number.circleSelected = circle;
                }
            })
        } 
    }

    addEventListeners(){
        this.canvas.addEventListener('mousemove', this.mouseMoveEvents);
        this.canvas.addEventListener('click', this.mouseClickEvents)
    }

    getMousePosition(e) {
        let rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        return [x, y]
    }

    nextNum(){
        if (this.index === this.finalIndex) {
            this.stopLesson();
            this.splash.newLesson(true);
        } else {
            this.index += 1;
            let number = this.numbers[this.indices[this.index]];
            this.number = new Number(number, this.language, this.ctx, this.canvas, this.mouse, this);
        }
    }

    prevNum(){
        if (this.index === 0) {
            this.lessonPhase = "options";
            this.canvas.classList.remove('front-canvas');
            this.canvas.classList.add('back-canvas');
            this.modalCanvas.classList.remove('back-canvas');
            this.modalCanvas.classList.add('front-canvas');
        } else {
            this.index -= 1;
            let number = this.numbers[this.indices[this.index]];
            this.number = new Number(number, this.language, this.ctx, this.canvas, this.mouse, this);
        }
    }

    init(){
        if (this.shuffle) this.indices.sort((a, b) => (0.5 - Math.random() * 1));
        let number = this.numbers[this.indices[this.index]];
        this.number = new Number(number, this.language, this.ctx, this.canvas, this.mouse, this);
        this.lessonPhase = "lesson";
        this.addEventListeners();
        this.lessonLoop();
    }

    update(dt){
        this.number.update(dt)
    }

    render(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.background.pos[0], this.background.pos[1]);
        this.background.sprite.render(this.ctx);
        this.ctx.restore();

        this.number.render()

        if (this.lessonPhase === "lesson") {
            this.leftSideArrow.render(this.ctx);
            this.rightSideArrow.render(this.ctx);
        }
    }

    lessonLoop(){
        if (this.lessonPhase === "complete") return null;
        if (this.lessonPhase === "lesson"){
            this.now = Date.now();
            this.dt = (this.now - this.lastTime) / 1000.0;
            this.lastTime = this.now;
            this.update(this.dt);
            this.render();
            requestAnimFrame(this.lessonLoop);
        }
    }

    stopLesson(){
        this.canvas.removeEventListener('click', this.mouseClickEvents);
        this.canvas.removeEventListener('mousemove', this.mouseMoveEvents);
        this.lessonPhase = "complete";
        return;
    }
}