class Arrow{
    constructor(x, y,radius, arc, maxArc, ctx){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.arc;
        this.maxArc = maxArc;
        this.originalArc = arc;
        this.ctx = ctx;
    }

    update(dt){
        if (this.arc >= this.maxArc) return null;
        this.arc += dt * 2; 
    }

    reset(){
        this.arc = this.originalArc;
    }

    render(){
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.globalAlpha = 0.4;
        this.ctx.lineWidth = 15;
        this.ctx.arc(this.x, this.y, this.radius, this.originalArc, this.arc)
        this.ctx.strokeStyle = "#f741d3";
        this.ctx.stroke();
        this.ctx.restore();
    }
}