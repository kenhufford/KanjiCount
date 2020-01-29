
class Sprite {
    constructor(url, pos, size, speed, frames, dir, once, sound) {
        this.url = url; //url of image
        this.pos = pos; //x and y coordinate in image
        this.size = size; //size of sprite (one frame)
        this.speed = typeof speed === 'number' ? speed : 0; //frames/sec for animation
        this.frames = frames; //array of frame index
        this.dir = dir || 'horizontal'; //vert or horizontal frames
        this.once = once; //true to run once, otherwise false
        this._index = 0; //what index we are on 
        this.sound = sound;
    }

    update(dt) {
        this._index += this.speed * dt;
    }

    render(ctx) {
        let frame;

        if (this.speed > 0) {
            let max = this.frames.length;
            let idx = Math.floor(this._index);
            frame = this.frames[idx % max];

            if (this.once && idx >= max) {
                this.done = true;
                return this.done;
            }
        }
        else {
            frame = 0;
        }

        let x = this.pos[0];
        let y = this.pos[1];

        if (this.dir == 'vertical') {
            y += frame * this.size[1];
        }
        else {
            x += frame * this.size[0];
        }
        
        ctx.drawImage(resources.get(this.url),
            x, y,
            this.size[0], this.size[1],
            0, 0,
            this.size[0], this.size[1]);
    }
}