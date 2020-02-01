class Number{
    constructor(number, language, ctx, canvas, mouse){
        this.number = number;
        this.ctx = ctx;
        this.canvas = canvas;
        this.step = 0;
        this.character = convertToKanji(convertNumberToArray(number));
        this.randomNums;
        this.randomChars;
        this.mouse = mouse;
        this.circleSelected = null;

        if (language === "cantonese") {
            this.pronunciation = cantonesePronunciation[this.number];
        } else if (language === "japanese"){
            this.pronunciation = japanesePronunciation[this.number];
        }
        this.circles = []
        this.positions = {
            "vertical": 
            [[this.canvas.width / 2, this.canvas.height / 2 - 150],
            [this.canvas.width / 2, this.canvas.height / 2 + 150]],
            "horizontal": 
            [[this.canvas.width / 2, this.canvas.height / 2],
            [this.canvas.width / 2 - 250, this.canvas.height / 2],
            [this.canvas.width / 2 + 250, this.canvas.height / 2]],
            "triangle": 
            [[this.canvas.width / 2, this.canvas.height / 2],
            [this.canvas.width / 2, this.canvas.height / 2 - 200],
            [this.canvas.width / 2 -200, this.canvas.height / 2 + 150],
            [this.canvas.width / 2 + 200, this.canvas.height / 2 + 150]],
        }
        this.generateRandomNum();
        this.set = {
            0: {
                orientation: "vertical",
                0: [this.number],
                1: [this.character, this.pronunciation]
            },
            1: {
                orientation: "horizontal",
                0: [this.number],
                1: [this.character],
                2: [this.randomChars[0]]
            },
            2: {
                orientation: "triangle",
                0: [this.pronunciation],
                1: [this.character],
                2: [this.randomChars[1]],
                3: [this.randomChars[2]],
            }
        }
        this.generateCircles(this.step);

    }

    generateRandomNum(){
        let nums = Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1));
        let randomNums = [];
        nums.map(num => {
            if (num !== this.number) randomNums.push(num)
        })
        this.randomNums = randomNums
        this.randomChars = this.randomNums.map(num => {
                                return convertToKanji([num])
                        })
    }

    generateCircles(setNum){
        let orientation = this.set[setNum].orientation;
        if (orientation === "vertical"){
            for (let i = 0; i < 2; i++) {
                let position = this.positions[orientation][i];
                let circle = new Circle(70, position[0], position[1], this.ctx, this.set[setNum][i]);
                if (i===0) circle.immovable = true;
                if (i===1) circle.answer = true;
                this.circles.push(circle);
            }
        } else if (orientation === "horizontal"){
            for (let i = 0; i < 3; i++) {
                let position = this.positions[orientation][i];
                let circle = new Circle(70, position[0], position[1], this.ctx, this.set[setNum][i])
                if (i === 0) circle.immovable = true;
                if (i === 1) circle.answer = true;
                this.circles.push(circle);
            }
        } else if (orientation === "triangle"){
            for (let i = 0; i < 4; i++) {
                let position = this.positions[orientation][i];
                let circle = new Circle(70, position[0], position[1], this.ctx, this.set[setNum][i])
                if (i===0) circle.immovable = true;
                if (i===1) circle.answer = true;
                this.circles.push(circle);
            }
        }
    }

    nextStep(){
        this.circles = [];
        this.step += 1;
        this.generateCircles(this.step);
    }

    answer(){
        if(this.circleSelected.answer){
            alert("correct!");
            this.nextStep();
        } else {
            alert('incorrect!');
        }
    }

    update(dt){
        this.circles.forEach( (circle) => {
            circle.update(dt, [this.mouse.x, this.mouse.y]);
        })
    }

    render(){
        this.circles.forEach((circle) => {
            circle.render(dt);
        })
        // this.ctx.beginPath();
        // this.ctx.arc(this.x+20, this.y-140, this.topRadius, 0, 2 * Math.PI)
        // this.ctx.strokeStyle = "#fa7af0";
        // this.ctx.closePath();
        // this.ctx.stroke();

        // this.ctx.font = "bold 32px Dosis";
        // this.ctx.fillStyle = "#FFFFFF";

        
        // this.ctx.fillText(this.character, this.x, this.y-150);

        // this.ctx.fillText(this.pronunciation, this.x-10, this.y-100);

        // this.ctx.fillText(this.number, this.x, this.y + 100);
    }
}