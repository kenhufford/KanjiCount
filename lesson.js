class Lesson{
    constructor(language, canvas, ctx, modalCanvas, modalCtx){
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
        this.lessonTutorial = new LessonTutorial(this.modalCanvas, this.modalCtx, this.canvas, this.ctx, this);
        this.kirbyLink = document.querySelector("#kirbylink");
        this.lessonsLink = document.querySelector("#lessonlink")
        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();
        this.canvas.classList.add('mouse-vis-canvas');
    }

    addEventListeners(){
        this.kirbyLink.addEventListener('click', () => {
            this.lessonPhase = "complete";
        })

        this.lessonsLink.addEventListener('click', () => {
            this.lessonPhase = "complete";
        })

        this.canvas.addEventListener('mousemove', e => {
            if (this.lessonPhase !== "lesson") return null;
            e.preventDefault(); 
            let pos = this.getMousePosition(e);
            this.mouse.update(pos[0], pos[1])
            this.number.circles.forEach(circle =>{
                if (circle.inside(pos)){
                    circle.pinged = true;
                } 
            })
        })

        this.canvas.addEventListener('click', (e) =>{
            if (this.lessonPhase !== "lesson") return null;
            e.preventDefault();
            let pos = this.getMousePosition(e);
            if (this.number.circleSelected){
                let circle = this.number.circleSelected;
                if (this.number.circles[0].inside(pos)){
                    this.number.answer();
                }
                circle.grabbed = false;
                circle.x = circle.originalX;
                circle.y = circle.originalY;
                this.number.circleSelected = null;
            } else {
                this.number.circles.forEach(circle => {
                    if (circle.inside(pos) && !circle.grabbed && !circle.immovable) {
                        circle.grabbed = true;
                        this.number.circleSelected = circle;
                    }
                })
            }
        })
    }

    getMousePosition(e) {
        let rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        return [x, y]
    }

    nextNum(){
        if (this.index === this.finalIndex) {
            this.lessonPhase = "options";
            this.canvas.classList.remove('front-canvas');
            this.canvas.classList.add('back-canvas');
            this.modalCanvas.classList.remove('back-canvas');
            this.modalCanvas.classList.add('front-canvas');
        } else {
            this.index += 1;
            let number = this.numbers[this.indices[this.index]];
            this.number = new Number(number, this.language, this.ctx, this.canvas, this.mouse, this);
        }
    }

    init(){
        if (this.shuffle) this.indices.sort((a, b) => (0.5 - Math.random() * 1));
        let number = this.numbers[this.indices[this.index]];
        this.number = new Number(number, this.language, this.ctx, this.canvas, this.mouse, this);
        this.lessonPhase = "lesson"
        this.lessonLoop();
    }

    update(dt){
        this.number.update(dt)
    }

    render(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = "#ff90f6";
        roundRect(0, 0, this.canvas.width, this.canvas.height, 10, this.ctx, "#ff90f6")
        ctx.stroke();
        this.number.render()
    }

    lessonLoop(){
        if (this.lessonPhase === "complete") return null;
        if (this.lessonPhase === "options") {
            this.canvas.classList.remove('front-canvas');
            this.canvas.classList.add('back-canvas');
            this.modalCanvas.classList.remove('back-canvas');
            this.modalCanvas.classList.add('front-canvas');
            this.lessonTutorial.loop();
        }
        if (this.lessonPhase === "lesson"){
            this.now = Date.now();
            this.dt = (this.now - this.lastTime) / 1000.0;
            this.lastTime = this.now;
            this.update(this.dt);
            this.render();
            requestAnimFrame(this.lessonLoop);
        }
    }
}