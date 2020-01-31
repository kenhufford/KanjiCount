class Spotlight{
    constructor(x, y, maxRadius){
        this.x = x;
        this.y = y;
        this.radius = 1;
        this.maxRadius = maxRadius;
    }

    update(dt){
        if (this.radius > this.maxRadius) return null
        this.radius += dt * 100;
    }

    render(ctx, canvas){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.closePath();
        ctx.stroke();
        ctx.save();
        ctx.clip();
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.restore();
    }

    findNormalizedVector(pos) {
        let destPos = [...pos]
        let xVector = this.x- destPos[0];
        let yVector = this.y - destPos[1];
        let distance = Math.sqrt(Math.pow(xVector, 2) + Math.pow(yVector, 2));
        this.vector =[(xVector / distance * 1.0), (yVector / distance * 1.0)];
    }
}