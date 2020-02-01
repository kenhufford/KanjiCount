class Score {
    constructor(startScore, pos, endScore, entity) {
        this.score = startScore;
        this.pos = pos;
        this.endScore = endScore;
        this.gameEnd = false;
        this.entity = entity;
    }

    update(change){
        if (this.gameEnd) return null
        this.score += change;
        this.entity.sprite.frames = [this.endScore-this.score]
        if (this.score < 0) this.score = 0;
        if (this.score >= this.endScore) this.score = this.endScore;
        console.log(this.score)
    }

    reset(score){
        this.score = score;
        this.entity.sprite.frames = [this.endScore-this.score];
    }
}
