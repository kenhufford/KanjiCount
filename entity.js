
class EntitySprite {
    constructor(pos, sprite) {
        this.pos = pos;
        this.sprite = sprite;
        
    }
}

class EntityStatic{
    constructor(pos, url, character) {
        this.pos = pos;
        this.url = url;
        this.character = character;
        this.leeway = 10;
        this.grabbed = false;
    }

    update(dt, speed, mousePos){
        if (!this.grabbed){
            if (this.pos[0] > 110) {
                this.pos[0] -= speed * dt * 10;
            } else {
                this.pos[1] += speed * dt * 10;
            }
        } else {
            this.pos[0] = mousePos[0];
            this.pos[1] = mousePos[1];
        }
    }

    render(ctx){
        ctx.font = "20px Arial";
        ctx.fillText(this.character, 25, 0);
        ctx.drawImage(resources.get(this.url), 0, 5)
    }

    offConveyor(){
        return (this.pos[0] < 111 && this.pos[1] > 450) ? true : false;
    }

    clickInside(pos){
        let img = resources.get(this.url);
        let clickPosX = pos[0];
        let clickPosY = pos[1];
        if (clickPosX < this.pos[0] + img.width + this.leeway && clickPosX > this.pos[0] - this.leeway &&
            clickPosY < this.pos[1] + img.height + this.leeway && clickPosY > this.pos[1] - this.leeway) 
            return true
        return false
    }
}