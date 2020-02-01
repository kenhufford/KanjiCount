class Circle{
    constructor(radius, x, y, ctx, content){
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.ctx = ctx;
        this.content = content;
        this.immovable = false;
        this.pingRadius = radius+6;
        this.maxRadius = 90;
        this.pinged = false;
        this.grabbed = false;
        this.answer = false;
    }

    update(dt, pos){
        if (!this.pinged) return null;
        if (this.grabbed){
            this.x = pos[0];
            this.y = pos[1];
        } else {
            this.pingRadius += dt * 30;
            if (this.pingRadius >= this.maxRadius) {
                this.pingRadius = this.radius;
                this.pinged = false;
            };
        }

    }

    inside(pos){
        return Math.pow((pos[0] - this.x), 2) + Math.pow((pos[1] - this.y), 2) < Math.pow(this.radius, 2)
    }

    ping(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.pingRadius, 0, 2 * Math.PI)
        if (this.pingRadius <= this.radius + 5) {
            this.ctx.strokeStyle = "#ff90f6";
        } else {
            this.ctx.strokeStyle = "#fe85f4";
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    render(){
        let gradient = this.ctx.createRadialGradient(this.x, this.y, this.radius/2, this.x, this.y, this.radius);
        gradient.addColorStop(0, '#fd69f1');
        gradient.addColorStop(1, '#ca41f7');
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        this.ctx.strokeStyle = "#ff90f6";
        this.ctx.closePath();
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.stroke();

        this.ping()
        this.ctx.font = "bold 32px Dosis";
        this.ctx.fillStyle = "#FFFFFF";
        this.content.forEach((word, i) => {
            if (this.content.length === 2){
                if (i === 0) this.ctx.fillText(word, this.x - 15, this.y - 15);
                if (i === 1) {
                    let adjust = this.content[i].length;
                    this.ctx.fillText(word, this.x - adjust * 6.5, this.y + 25);
                }
            } else {
                if (word.length > 1){
                    let adjust = this.content[i].length;
                    this.ctx.fillText(word, this.x - adjust * 5.5, this.y + 10);
                } else {
                    this.ctx.fillText(word, this.x-15, this.y+8);
                }
            }  
        })
    }
}