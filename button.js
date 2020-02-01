class Button {
    constructor(pos, width, height, textStartWidth, textStartHeight, text, altText1, altText2) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.text = text;
        this.altText1 = altText1;
        this.altText2 = altText2;
        this.textStartWidth = textStartWidth;
        this.textStartHeight = textStartHeight;
        this.slidePosX = 0;
        this.flipped = false;
    }

    update(dt){
        if (this.slidePosX >= this.width / 2 && this.flipped){
            this.slidePosX = this.width / 2
        } else if (this.slidePosX <= 0 & !this.flipped) {
            this.slidePosX = 0;
        } else {
            debugger
            this.flipped ? this.slidePosX += dt * 75 : this.slidePosX -= dt * 75;
        }
    }


    inside(inputPos) {
        let posX = this.pos[0];
        let posY = this.pos[1];

        if (posX + this.width > inputPos[0] && posX < inputPos[0] &&
            posY + this.height > inputPos[1]  && posY < inputPos[1]) {
            return true
        }
        return false
    }

    render(ctx){
        let color = this.flipped ? "#fcbdc5" : "#c411ff"
        roundRect(this.pos[0], this.pos[1], this.width, this.height, 20, ctx, color);
        roundRect(this.pos[0] + this.slidePosX, this.pos[1], this.width / 2, this.height, 20, ctx, "#fcc81f");
        ctx.font = "bolder 22px Roboto";
        ctx.fillStyle = "#000000";
        let words = this.flipped ? this.altText1 : this.text;
        ctx.fillText(words, this.pos[0]+ this.textStartWidth, this.pos[1]+ this.textStartHeight);
    }
}