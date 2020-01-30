class Score {
    constructor(startScore, pos, endScore) {
        this.score = startScore;
        this.pos = pos;
        this.endScore = endScore;
        this.gameEnd = false;
    }

    update(change){
        if (this.gameEnd) return null
        this.score += change;
        if (this.score < 0) this.score = 0;
        if (this.score >= this.endScore) this.score = this.endScore;
        console.log(this.score)
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
                text = `${10 - this.score} more to go!`
                break;
            case this.score>=2 && this.score<4:
                text = `Kirby's still hungry!`
                break;
            case this.score>=4 && this.score<6:
                text = `He's filling up!`
                break;
            case this.score>=6 && this.score<8:
                text = `Only room for ice cream!`
                break;
            default:
                text = `Victory!!!`
                break;
        }
        let gradient = ctx.createLinearGradient(10, 10, 200, 20);
        gradient.addColorStop(0, '#93f7e1');
        gradient.addColorStop(1 / 3, '#93caf7');
        gradient.addColorStop(2 / 3, '#b693f7');
        gradient.addColorStop(3 / 3, '#d827f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(10, 10, (this.time * 100 / this.startTime), 20);

        ctx.fillRect(10, 10, this.score * 18 + 20, 20);

        ctx.fillStyle = "#000000";
        ctx.font = "20px Arial";
        ctx.fillText(text, 10, 50);
    }
}
