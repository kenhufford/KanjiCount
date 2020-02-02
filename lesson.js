class Lesson{
    constructor(language, canvas, ctx){
        this.language = language;
        this.index = 0;
        this.complete = false;
        this.canvas = canvas;
        this.ctx = ctx;
        this.now = Date.now();
        this.lastTime = this.now;
        this.dt = (this.now - this.lastTime )/ 1000;
        this.lessonLoop = this.lessonLoop.bind(this);
        this.mouse = new Mouse (0,0);
        this.number = new Number(this.index, this.language, this.ctx, this.canvas, this.mouse, this);
        this.kirbyLink = document.querySelector("#kirbylink");
        this.lessonsLink = document.querySelector("#lessonlink")
        this.addEventListeners = this.addEventListeners.bind(this);
        this.addEventListeners();
        this.canvas.classList.add('mouse-vis-canvas');
    }

    addEventListeners(){
        this.kirbyLink.addEventListener('click', () => {
            this.complete = true;
        })

        this.lessonsLink.addEventListener('click', () => {
            this.complete = true;
        })

        this.canvas.addEventListener('mousemove', e => {
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
        if (this.number === 10) this.complete = true;
        this.index += 1;
        this.number = new Number(this.index, this.language, this.ctx, this.canvas, this.mouse, this);
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
        if (this.complete) return null;
        this.now = Date.now();
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.lastTime = this.now;
        this.update(this.dt);
        this.render();
        requestAnimFrame(this.lessonLoop);
    }


}