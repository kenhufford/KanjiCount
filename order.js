class Order{
    constructor(index, character, number, time, pos){
        this.index = index;
        this.character = character;
        this.number = number;
        this.time = time;
        this.pos = pos;
        this.startTime = time;
        this.width = 120;
        this.height = 65;
        this.plateWidth = 120;
        this.plateHeight = 10;
        this.plateDistance = 170;
        this.charsArray = this.character.split("");
        this.collectedChars = [];
        this.sushis = [];
        this.sushiPositions = [[0, 140], [30, 140], [60, 140], [15, 120], [45, 120]]

        for (let i = 0; i < this.charsArray.length; i++){
            this.collectedChars.push("")
        }
    }

    addSushi(sushi){
        let sushiIndex = this.charsArray.indexOf(sushi.character);
        this.collectedChars[sushiIndex] = sushi.character;
        sushi.plate();
        this.sushis.push(sushi);
        sushi.platePos = this.sushiPositions[sushiIndex]
        this.time += 5;
        if (this.time > this.startTime) this.time = this.startTime;
    }

    ready(){
        if (this.collectedChars.slice(0).sort().join("") == this.charsArray.slice(0).sort().join("")){
            return true;
        } else {
            return false;
        }
    }

    update(dt){
        this.time -= dt;
    }

    timeUp(){
        return this.time <= 0 ? true : false;
    }

    within(mousePos){
        if ((mousePos[0] < this.pos[0] + this.plateWidth && mousePos[0] >= this.pos[0]) &&
            (mousePos[1] - 20 < this.pos[1] + this.plateDistance + this.plateHeight && mousePos[1]+100 >= this.pos[1])){
                return true;
            } else {
                return false;
            }
    }

    withinBox(mousePos){
        if ((mousePos[0] < this.pos[0] + this.width && mousePos[0] >= this.pos[0]) &&
            (mousePos[1] < this.pos[1] + this.width && mousePos[1] >= this.pos[1])) {
            return true;
        } else {
            return false;
        }
    }

    render(ctx) {
        roundRect(0, 0, this.width, this.height, 10, ctx, "#ff90f6")
        //render order info
        ctx.beginPath();
        ctx.strokeStyle = "#ff90f6";
        ctx.rect(10, 10, 100, 20)
        ctx.stroke();

        ctx.fillStyle = this.time / this.startTime >= 0.25 ? "#1fbd00" : "red";
        ctx.fillRect(10, 10, (this.time * 100/this.startTime), 20);
        //render order number
        ctx.font = "bolder 24px Roboto";
        ctx.fillStyle = "#000000";
        ctx.fillText(this.number, 50, 55);
        //render plate
        if (this.charsArray.length !== 1){
            ctx.beginPath();
            ctx.fillStyle = "#995201";
            ctx.strokeStyle = "#663700";
            ctx.rect(0, this.plateHeight + this.plateDistance, this.plateWidth, 15)
            ctx.fillRect(0, this.plateHeight + this.plateDistance, this.plateWidth, 15)
            ctx.rect(20, this.plateHeight + this.plateDistance+15, 20, 20)
            ctx.fillRect(20, this.plateHeight + this.plateDistance + 15, 20, 20)
            ctx.rect(80, this.plateHeight + this.plateDistance+15, 20, 20)
            ctx.fillRect(80, this.plateHeight + this.plateDistance + 15, 20, 20)
            ctx.stroke();

            //only a single character
            this.charsArray.forEach((char, i) => {
                ctx.font = "bold 24px Dosis";
                if (this.collectedChars[i] === char) {
                    ctx.fillStyle = "#000000";
                } else {
                    ctx.fillStyle = "#fdd13e";
                }
                ctx.fillText(char, i * 25, 240);
            })
            this.sushis.forEach(sushi => {
                sushi.render(ctx)
            })
        }
    }
}
