class Button {
    constructor(pos, width, height, textStartWidth, textStartHeight, text, altText1, altText2, slideable, flipPositionMax) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.text = text;
        this.altText1 = altText1;
        this.altText2 = altText2;
        this.textStartWidth = textStartWidth;
        this.textStartHeight = textStartHeight;
        this.flipPositionMax = flipPositionMax;
        this.slidePosX = 0;
        this.flipPosition = 1;
        this.slideable = slideable;
    }

    update(dt){
        if (this.slideable){
            if (this.flipPositionMax === 2){
                if (this.slidePosX >= this.width / 2 && this.flipPosition===2) {
                    this.slidePosX = this.width / 2
                } else if (this.slidePosX <= 0 & this.flipPosition===1) {
                    this.slidePosX = 0;
                } else if (this.slidePosX >= this.width/2 & this.flipPosition===1) {
                    this.slidePosX = 0
                } else {
                    this.slidePosX += dt * 75
                }
            } else if (this.flipPositionMax === 3){
                if (this.slidePosX >= this.width / 3 && this.flipPosition === 2) {
                    this.slidePosX = this.width / 3
                } else if (this.slidePosX >= this.width * 2/ 3 && this.flipPosition === 3) {
                    this.slidePosX = this.width * 2 / 3
                } else if (this.slidePosX >= 0 & this.flipPosition === 1) {
                    this.slidePosX = 0;
                } else {
                    this.slidePosX += dt * 75
                }
            } 
        }
    }

    slide(){
        if (this.slideable){
            this.flipPosition+= 1;
            if (this.flipPosition > this.flipPositionMax) this.flipPosition = 1;
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
        let color = this.flipPosition % 2 === 0 ? "#c411ff": "#fcbdc5"
        roundRect(this.pos[0], this.pos[1], this.width, this.height, 20, ctx, color);
        if (this.slideable){
            if (this.flipPositionMax === 2){
                roundRect(this.pos[0] + this.slidePosX, this.pos[1], this.width / 2, this.height, 20, ctx, "#fcc81f");
            } else if (this.flipPositionMax === 3){
                roundRect(this.pos[0] + this.slidePosX, this.pos[1], this.width / 3, this.height, 20, ctx, "#fcc81f");
            }
        }
        if (this.text === "Hard" || this.altText === "Insane"){
            ctx.font = "bolder 26px Roboto";
        } else {
            ctx.font = "bolder 22px Roboto";
        }
        let words;
        ctx.fillStyle = "#000000";
        if (this.flipPosition === 1){
            words = this.text;
        } else if (this.flipPosition === 2){
            words = this.altText1;
        } else if (this.flipPosition === 3){
            words = this.altText2;
        }

        if (this.slideable) {
            ctx.fillText(words, this.pos[0] + this.textStartWidth, this.pos[1] + this.textStartHeight);
        } else {
            ctx.fillText(words, this.pos[0] + this.textStartWidth+30, this.pos[1] + this.textStartHeight);
        }
    }
}