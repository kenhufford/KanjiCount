class Entity {
    constructor(pos, sprite, url, spriteFunc) {
        this.pos = pos;
        this.sprite = sprite;
        this.url = url;
        this.defaultSprite = spriteFunc;
    }

    nearby(inputPos) {
        let posX = this.pos[0];
        let posY = this.pos[1];

        if (posX < inputPos[0] + 50 && posX + 250 > inputPos[0] &&
            posY < inputPos[1] + 50 && posY + 100 > inputPos[1]) {
            return true
        }
        return false
    }
}
