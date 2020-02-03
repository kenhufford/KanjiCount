class SideArrow{
    constructor(x, y, face, ctx){
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 50;
        this.face = face;
        this.ctx = ctx;
    }

    inside(inputPos) {
        if (posX + this.width > inputPos[0] && posX < inputPos[0] &&
            posY + this.height > inputPos[1] && posY < inputPos[1]) {
            return true
        }
        return false
    }

    render(){
        let top = [this.x + this.width, this.y];
        let mid = [this.x, this.y + this.height / 2];
        let bottom = [this.x + this.width, this.y + this.height];
        if (this.face === "right"){
            top = [this.x, this.y];
            mid = [this.x + this.width, this.y + this.height / 2];
            bottom = [this.x, this.y + this.height];
        }
        this.ctx.strokeStyle = 'black';
        this.ctx.beginPath();
        this.ctx.moveTo(top[0], top[1]);
        this.ctx.lineTo(mid[0], mid[1]);
        this.ctx.lineTo(bottom[0], bottom[1]);
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }
}