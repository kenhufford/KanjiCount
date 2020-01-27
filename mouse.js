class Mouse{
    constructor(closed, x, y,openImg, closedImg){
        this.x = x;
        this.y = y;
        this.closed = closed;
        this.openImg = openImg;
        this.closedImg = closedImg;
    }

    update(x, y){
        this.x = x;
        this.y = y;
    }

    render(ctx) {
        let cursor = this.closed ? this.closedImg : this.openImg;
        ctx.drawImage(resources.get(cursor), this.x, this.y)
    }
}