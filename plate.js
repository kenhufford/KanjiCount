class Plate{
    constructor(x, y, chars){
        this.x = x;
        this.y = y;
        this.targetChars = targetChars;
        this.width = 100;
        this.height = 20;
        this.currentChars = [];
    }

    render(){
        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height)
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(0, 0, this.width, this.height)
        ctx.stroke();
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, this.width, this.height)

        ctx.font = "20px Arial";
        ctx.fillText(this.number, this.width+ 10, this.height);
    }
}