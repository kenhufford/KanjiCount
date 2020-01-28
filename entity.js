
class EntitySprite {
    constructor(pos, sprite, url, spriteFunc) {
        this.pos = pos;
        this.sprite = sprite;
        this.url = url;
        this.defaultSprite = spriteFunc;
        this.degrees = 0;
    }

}

class Sushi{
    constructor(id, pos, url, character) {
        this.id = id;
        this.pos = pos;
        this.url = url;
        this.character = character;
        this.grabbed = false;
        this.dropped = false;
        this.flying = false;
        this.vector = [0,0];
    }

    update(dt, speed, mousePos){
        if(this.dropped){
            this.pos[1] += speed * dt * 10;
        } else if (this.grabbed){
            this.pos[0] = mousePos[0] - 35;
            this.pos[1] = mousePos[1] - 30;
        } else if (this.flying){
            this.degrees += 10;
            this.pos[0] -= speed * dt * 10 * this.vector[0];
            this.pos[1] -= speed * dt * 10 * this.vector[1];
        } else {
            if (this.pos[0] > 110) {
                this.pos[0] -= speed * dt * 10;
            } else {
                this.pos[1] += speed * dt * 10;
            }
        }
    }

    findNormalizedVector(pos1, pos2){
        
        let xVector = pos1[0] - pos2[0];
        let yVector = pos1[1] - pos2[1];
        let distance = Math.sqrt(Math.pow(xVector, 2) + Math.pow(yVector, 2))
        let normalVector = [(xVector / distance * 1.0), (yVector / distance * 1.0)]
        return normalVector;
    }

    
    render(ctx){
        ctx.save();
        ctx.font = "20px Arial";
        ctx.fillText(this.character, 25, 0);
        ctx.rotate(Math.PI *  this.degrees / 180 )
        ctx.drawImage(resources.get(this.url), 0, 5)
        ctx.restore();
    }
    
    offConveyor(){
        if (this.grabbed) return false;
        if (this.dropped){
            return (this.pos[1] > 450) ? true : false;
        }
        return (this.pos[0] < 111 && this.pos[1] > 450) ? true : false;
    }
    
    nearby(kirbyPos, prox) {
        let img = resources.get(this.url);
        let posX = this.pos[0];
        let posY = this.pos[1];

        if (posX < kirbyPos[0] + img.width + prox && posX + prox > kirbyPos[0] &&
            posY < kirbyPos[1] + img.height + prox && posY + prox > kirbyPos[1]) {
            this.grabbed = !this.grabbed;
            return true
        }
        return false
    }

    clickInside(pos){
        let img = resources.get(this.url);
        let clickPosX = pos[0];
        let clickPosY = pos[1];
        
        if (clickPosX < this.pos[0] + img.width && clickPosX > this.pos[0] &&
            clickPosY < this.pos[1] + img.height && clickPosY > this.pos[1]){
                this.grabbed = !this.grabbed;
                return true
            }
        return false
    }

}