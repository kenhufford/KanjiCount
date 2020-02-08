class Number{
    constructor(number, language, ctx, canvas, mouse, lesson){
        this.number = number;
        this.ctx = ctx;
        this.canvas = canvas;
        this.step = 0;
        this.character = convertToKanji(convertNumberToArray(number));
        this.language = language
        this.randomNums;
        this.randomChars;
        this.randomPronuciation;
        this.mouse = mouse;
        this.lesson = lesson;
        this.circleSelected = null;
        this.transition = false;
        this.tutorialCooldown = 0;
        this.nextStep = this.nextStep.bind(this);
        this.arrow = new Arrow(this.canvas.width/2, this.canvas.height/2, 150, 0.7 * Math.PI, 1.3 * Math.PI, ctx);

        if (language === "cantonese") {
            this.pronunciation = cantonesePronunciation[this.number];
        } else if (language === "japanese"){
            this.pronunciation = japanesePronunciation[this.number]
        } else if (language === "mandarin"){
            this.pronunciation = mandarinPronunciation[this.number];
        }
        this.circles = []
        this.solutionPositions = {
            "vertical":
                [this.canvas.width / 2, this.canvas.height / 2 - 150],
            "horizontal":
                [this.canvas.width / 2, this.canvas.height / 2],
            "triangle":
                [this.canvas.width / 2, this.canvas.height / 2],
            "square":
                [this.canvas.width / 2, this.canvas.height / 2]
        }
        this.positions = {
            "vertical": 
            [[this.canvas.width / 2, this.canvas.height / 2 + 150]],
            "horizontal": 
            [[this.canvas.width / 2 - 250, this.canvas.height / 2],
            [this.canvas.width / 2 + 250, this.canvas.height / 2]],
            "triangle": 
            [[this.canvas.width / 2, this.canvas.height / 2 - 200],
            [this.canvas.width / 2 -200, this.canvas.height / 2 + 150],
            [this.canvas.width / 2 + 200, this.canvas.height / 2 + 150]],
            "square": 
            [[this.canvas.width / 2 - 200, this.canvas.height / 2 - 200],
            [this.canvas.width / 2 - 200, this.canvas.height / 2 + 200],
            [this.canvas.width / 2 + 200, this.canvas.height / 2 - 200],
            [this.canvas.width / 2 + 200, this.canvas.height / 2 + 200]],
        }

        this.generateRandomNum();

        this.set = {
            0: {
                orientation: "vertical",
                "solution": [this.number],
                0: [this.character, this.pronunciation]
            },
            1: {
                orientation: "horizontal",
                "solution": [this.number],
                0: [this.character],
                1: [this.randomChars[0]]
            },
            2: {
                orientation: "triangle",
                "solution": [this.pronunciation],
                0: [this.character],
                1: [this.randomChars[1]],
                2: [this.randomChars[2]],
            },
            3: {
                orientation: "square",
                "solution": [this.pronunciation],
                0: [this.character],
                1: [this.randomChars[3]],
                2: [this.randomChars[4]],
                3: [this.randomChars[5]],
            },
            4: {
                orientation: "square",
                "solution": [this.character],
                0: [this.pronunciation],
                1: [this.randomPronuciation[6]],
                2: [this.randomPronuciation[7]],
                3: [this.randomPronuciation[8]],
            }
        }

        this.randomizePositions();
        this.generateCircles(this.step);
    }

    generateRandomNum(){
        let nums = Array.from(Array(11).keys()).concat(100, 1000, 10000).sort((a, b) => (0.5 - Math.random() * 1));
        let randomNums = [];
        nums.map(num => {
            if (num !== this.number) randomNums.push(num)
        })
        this.randomNums = randomNums;
        this.randomChars = this.randomNums.map(num => {
                                return convertToKanji([num])
                        })
        this.randomPronuciation = this.randomNums.map(num => {
                                return cantonesePronunciation[num];
                        })
    }

    randomizePositions(){
        let positions = Object.assign({}, this.positions);
        Object.keys(positions).forEach( key => {
            positions[key] = positions[key].sort((a, b) => (0.5 - Math.random() * 1))
        });
        this.positions = positions;
        console.log(this.positions);
    }

    generateCircles(setNum){
        let orientation = this.set[setNum].orientation;
        let solutionCircle = 
            new Circle(80,
            this.solutionPositions[orientation][0],
            this.solutionPositions[orientation][1],
            this.ctx,
            this.set[setNum]["solution"])
        solutionCircle.immovable = true;
        this.circles.push(solutionCircle);
        
        if (orientation === "vertical"){
            let position = this.positions[orientation][0];
            let circle = new Circle(80, position[0], position[1], this.ctx, this.set[setNum][0]);
            circle.answer = true;
            this.circles.push(circle);
        } else if (orientation === "horizontal"){
            for (let i = 0; i < 2; i++) {
                let position = this.positions[orientation][i];
                let circle = new Circle(70, position[0], position[1], this.ctx, this.set[setNum][i])
                if (i === 0) circle.answer = true;
                this.circles.push(circle);
            }
        } else if (orientation === "triangle"){
            for (let i = 0; i < 3; i++) {
                let position = this.positions[orientation][i];
                let circle = new Circle(70, position[0], position[1], this.ctx, this.set[setNum][i])
                if (i===0) circle.answer = true;
                this.circles.push(circle);
            }
        } else if (orientation === "square"){
            for (let i = 0; i < 4; i++) {
                let position = this.positions[orientation][i];
                let circle = new Circle(70, position[0], position[1], this.ctx, this.set[setNum][i])
                if (i===0) circle.answer = true;
                this.circles.push(circle);
            }
        }
    }

    nextStep(){
        if (this.step === 4){
            this.lesson.nextNum();
        } else {
            this.circles = [];
            this.step += 1;
            this.generateCircles(this.step);
            this.transition = false;
        }
    }

    answer(){
        if(this.circleSelected.answer){
            playNumberSound(this.number, this.language);
            this.transition = true;
            this.circles[0].transition = true;
            setTimeout(this.nextStep, 2000)
            
        } else {
            this.circleSelected.shaking = true;
            let lastCircle = this.circleSelected;
            setTimeout(() => lastCircle.shaking = false, 500);
        }
    }

    update(dt){
        this.circles.forEach( (circle) => {
            circle.update(dt, [this.mouse.x, this.mouse.y]);
        })
        if (this.number === 0 && this.step === 0) {
            this.tutorialCooldown -= dt;
            if (this.tutorialCooldown <= 0){
                this.arrow.reset();
                this.circles[1].pinged = true;
                setTimeout((() => this.circles[0].pinged = true), 900)
                this.tutorialCooldown = 4;
            } 
            this.arrow.update(dt);
        }
    }

    render(){
        if (this.number === 0 && this.step === 0) {
            this.arrow.render()
        }
        if (!this.transition){
            for (let i = 0; i < this.circles.length; i++) {
                this.circles[i].render();
            }
        } else {
            for (let i = this.circles.length-1; i >=0; i--) {
                this.circles[i].render();
            }
        }

    }
}