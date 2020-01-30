
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

class Sushi{
    constructor(id, pos, url, character, number) {
        this.id = id;
        this.pos = pos;
        this.platePos = [];
        this.url = url;
        this.number = number;
        this.character = character;
        this.vector = [0,0];
        this.degrees = 1;
        this.speed = 10;
        this.grabbed = false;
        this.dropped = false;
        this.flying = false;
        this.plated = false;
        this.hit = false;
    }

    plate(){
        this.grabbed = false;
        this.dropped = false;
        this.flying = false;
        this.plated = true;
        this.hit = false; 
        this.vector = [0, 0];
    }

    update(dt, speed, mousePos){
        if(this.dropped){
            this.pos[1] += speed * dt * this.speed * 2;
        } else if (this.grabbed){
            this.pos[0] = mousePos[0] - 35;
            this.pos[1] = mousePos[1] - 30;
        } else if (this.flying){
            this.degrees +=  dt * 4;
            this.pos[0] -= speed * dt * this.speed * this.degrees * this.vector[0];
            this.pos[1] -= speed * dt * this.speed * this.degrees * this.vector[1];
        } else {
            if (this.pos[0] > 110 && this.pos[1]<460) {
                this.pos[0] -= speed * dt * this.speed;
            } else if (this.pos[1] > 460 && this.pos[0] < 680){
                this.pos[0] += speed * dt * this.speed;
            } else {
                this.pos[1] += speed * dt * this.speed * 2;
            }
        }
    }


    findNormalizedVector(pos1, pos2){
        let destPos = [...pos2]
        destPos[1] += 30;
        let xVector = pos1[0] - destPos[0];
        let yVector = pos1[1] - destPos[1];
        let distance = Math.sqrt(Math.pow(xVector, 2) + Math.pow(yVector, 2))
        let normalVector = [(xVector / distance * 1.0), (yVector / distance * 1.0)]
        return normalVector;
    }

    render(ctx){
        let img = resources.get(this.url);
        if (this.flying){
            ctx.save();
            ctx.translate(img.width/2, img.height/2);
            ctx.rotate(Math.PI * this.degrees)
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            ctx.restore();
        } else if (this.plated) {
            ctx.drawImage(img, this.platePos[0], this.platePos[1])
        } else {
            ctx.font = "20px Arial";
            ctx.fillText(this.character, 25, 0);
            ctx.drawImage(img, 0, 5)
        }
    }
    
    offConveyor(){
        if (this.grabbed) return false;
        if (this.dropped){
            return (this.pos[1] > 550) ? true : false;
        }
        return (this.pos[0] > 650 && this.pos[1] > 550) ? true : false;
    }
    
    nearby(kirbyPos, prox) {
        let img = resources.get(this.url);
        let posX = this.pos[0];
        let posY = this.pos[1];

        if (posX < kirbyPos[0] + img.width + prox && posX + prox > kirbyPos[0] &&
            posY < kirbyPos[1] + img.height + prox && posY + prox > kirbyPos[1]) {
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

    match(orders){;
        let result = -1;
        orders.forEach((order, i )=> {
            if (order.character === this.character && result === -1){
                result = i;
            }
        })
        return result;
    }

}