class Score {
    constructor(startScore, pos, endScore) {
        this.score = startScore;
        this.pos = pos;
        this.endScore = endScore;
    }

    update(change){
        this.score += change;
        if (this.score < 0) this.score = 0;
        if (this.score >= endScore) this.score = endScore;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.rect(0, 0, 220, 60)
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(10, 10, 200, 20)
        ctx.stroke();
        let fillColor = "#000000";
        let text = `${10-this.score} more to go!`
        switch (true) {
            case this.score<2:
                fillColor = '#E8350F';
                text = `${10 - this.score} more to go!`
                break;
            case this.score>=2 && this.score<4:
                fillColor = '#E8E10F';
                text = `Kirby's still hungry!`
                break;
            case this.score>=4 && this.score<6:
                fillColor = '#36E80F';
                text = `He's filling up!`
                break;
            case this.score>=6 && this.score<8:
                fillColor = '#0FC7E8';
                text = `Only room for ice cream!`
                break;
            default:
                fillColor = '#E80FE8';
                text = `Victory!!!`
                break;
        }
        ctx.fillStyle = fillColor;
        ctx.fillRect(10, 10, this.score * 18 + 20, 20);

        ctx.fillStyle = "#000000";
        ctx.font = "20px Arial";
        ctx.fillText(text, 10, 50);
    }
}
