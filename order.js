class Order{
    constructor(character, number, time, pos){
        this.character = character;
        this.number = number;
        this.time = time;
        this.pos = pos;
        this.startTime = time;
        this.width = 120;
        this.height = 60;
    }

    update(dt){
        this.time -= dt;
    }

    timeUp(){
        return this.time <= 0 ? true : false;
    }

    within(mousePos){
        if ((mousePos[0] < this.pos[0] + this.width && mousePos[0] >= this.pos[0]) &&
            (mousePos[1] < this.pos[1] + this.height && mousePos[1] >= this.pos[1])){
                return true;
            } else {
                return false;
            }
    }


    render(ctx) {
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height)
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(10, 10, 100, 20)
        ctx.stroke();
        ctx.fillStyle = "#000000";
        ctx.fillRect(10, 10, (this.time * 100/this.startTime), 20);

        ctx.font = "20px Arial";
        ctx.fillText(this.number, 55, 50);
    }
}
