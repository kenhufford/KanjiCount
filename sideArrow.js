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
        if (this.x + this.width > inputPos[0] && this.x < inputPos[0] &&
            this.y + this.height > inputPos[1] && this.y < inputPos[1]) {
            return true
        }
        return false
    }

    render(ctx){
       
        let top = [this.x + this.width, this.y];
        let mid = [this.x, this.y + this.height / 2];
        let bottom = [this.x + this.width, this.y + this.height];
        if (this.face === "right"){
            top = [this.x, this.y];
            mid = [this.x + this.width, this.y + this.height / 2];
            bottom = [this.x, this.y + this.height];
        }
        
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(top[0], top[1]);
        ctx.lineTo(mid[0], mid[1]);
        ctx.lineTo(bottom[0], bottom[1]);
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}