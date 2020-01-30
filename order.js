class Order{
    constructor(index, character, number, time, pos){
        this.index = index;
        this.character = character;
        this.number = number;
        this.time = time;
        this.pos = pos;
        this.startTime = time;
        this.width = 120;
        this.height = 60;
        this.plateWidth = 120;
        this.plateHeight = 10;
        this.plateDistance = 150;
        this.charsArray = this.character.split("");
        this.collectedChars = [];
        this.sushis = [];
        this.sushiPositions = [[0, 120], [30, 120], [60, 120], [15, 100], [45, 100]]
    }

    addSushi(sushi){
        this.collectedChars.push(sushi.character);
        sushi.plate();
        this.sushis.push(sushi);

        sushi.platePos = this.sushiPositions[this.charsArray.indexOf(sushi.character)]
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


    render(ctx) {
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height)
        ctx.stroke();
        //render order info
        ctx.beginPath();
        ctx.rect(10, 10, 100, 20)
        ctx.stroke();
        ctx.fillStyle = "#000000";
        ctx.fillRect(10, 10, (this.time * 100/this.startTime), 20);
        //render order number
        ctx.font = "20px Arial";
        ctx.fillText(this.number, 55, 50);
        //render plate
        if (this.charsArray.length !== 1){
            ctx.beginPath();
            ctx.rect(0, this.plateHeight + this.plateDistance, this.plateWidth, 10)
            ctx.stroke();

            //only a single character
            if (this.collectedChars.length >= 0) { 
                this.charsArray.forEach((char, i) => {
                    ctx.font = "20px Arial";
                    if (this.collectedChars[i] === char) {
                        ctx.fillStyle = "#000000";
                    } else {
                        ctx.fillStyle = "#fdd13e";
                    }
                    ctx.fillText(char, i * 25, 250);
                })
                this.sushis.forEach(sushi => {
                    sushi.render(ctx)
                })
            }
        }
    }
}
