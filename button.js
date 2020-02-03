class Button {
    constructor(pos, width, height, textStartWidth, textStartHeight, text, altText1, altText2, slideable) {
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
        this.slideable = slideable;
    }

    update(dt){
        if (this.slideable){
            if (this.slidePosX >= this.width / 2 && this.flipped) {
                this.slidePosX = this.width / 2
            } else if (this.slidePosX <= 0 & !this.flipped) {
                this.slidePosX = 0;
            } else {
                this.flipped ? this.slidePosX += dt * 75 : this.slidePosX -= dt * 75;
            }
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
        if (this.slideable){
            roundRect(this.pos[0] + this.slidePosX, this.pos[1], this.width / 2, this.height, 20, ctx, "#fcc81f");
        }
        if (this.text === "Hard" || this.altText === "Insane"){
            ctx.font = "bolder 26px Roboto";
        } else {
            ctx.font = "bolder 22px Roboto";
        }
        let words;
        if (this.flipped){
            words = this.altText1;
            ctx.fillStyle = "#000000";
        } else {
            words = this.text;
            ctx.fillStyle = "#000000";
        }
        if (this.slideable) {
            ctx.fillText(words, this.pos[0] + this.textStartWidth, this.pos[1] + this.textStartHeight);
        } else {
            ctx.fillText(words, this.pos[0] + this.textStartWidth+30, this.pos[1] + this.textStartHeight);
        }
    }
}