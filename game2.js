class Game{
    constructor(difficulty, language, canvas, ctx, modalCanvas, modalCtx){
        //constructed
        this.difficulty = difficulty;
        this.language = language;
        this.canvas = canvas;
        this.ctx = ctx;
        this.modalCanvas = modalCanvas;
        this.modalCtx = modalCtx;
        this.tutorial;

        //bind
        this.gameLoop = this.gameLoop.bind(this);

        //should remain same
        this.gameModes = {
            "easy": {
                sushiShelf: Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1)),
                orderTime: 25,
                orderCooldown: 10,
                startScore: 2
            },
            "medium": {
                sushiShelf: Array.from(Array(11).keys()).concat([10, 10]).sort((a, b) => (0.5 - Math.random() * 1)),
                orderTime: 25,
                orderCooldown: 10,
                startScore: 2,
            },
            "hard": {
                sushiShelf: Array.from(Array(11).keys()).concat([10, 10, 10, 100, 100, 100]).sort((a, b) => (0.5 - Math.random() * 1)),
                orderTime: 25,
                orderCooldown: 10,
                startScore: 2
            }
        }

        //start game variables
        this.gamePhase = "tutorial";
        this.orderIndex = 0;
        this.sushiIndex = 0;
        this.sushiId = 1;
        this.gameTime = 0;
        this.endGameScore = 10;
        this.windCooldown = 1;
        let now = Date.now();
        this.now = now;
        this.lastTime = now;
        this.dt = (this.now - this.lastTime )/ 1000.0;
        this.orderCooldown = this.gameModes[this.difficulty].orderCooldown;
        this.orderTime = this.gameModes[this.difficulty].orderTime;

        //containers
        this.sushis = {};
        this.answers = {};
        this.orders = [];
        this.orderPositions = [];
        this.sushiShelf = this.gameModes[this.difficulty].sushiShelf;

        //game objects
        this.mouse = new Mouse(false, 0, 0, mouseImages[0], mouseImages[1]);
        this.hearts = new Entity([10, 10], heartsSprite(), heartsSpriteURL, heartsSprite);
        this.score = new Score(this.gameModes[difficulty].startScore, [10, 10], this.endGameScore, this.hearts);
        this.kirby = new Entity([50, 200], kirbyIdleSprite(), kirbySpriteURL, kirbyIdleSprite)
        this.conveyor = new Entity([150, 350], conveyorSprite, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
        this.conveyor2 = new Entity([110, 500], conveyorSprite2, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
        this.chef = new Entity([750, 310], chefSprite(), kirbySpriteURL, chefSprite)
        this.wind = new Entity([90, 110], noWindSprite(), kirbySpriteURL, noWindSprite)
        this.norin = new Entity([0, 0], norinSprite(), norinSpriteURL, norinSprite);
        this.music = new Music(gameSoundFiles["kirbysong"]);
        this.ingameMusicButton = new Button([760, 530], 120, 50, 4, 33, "Off", "On", "", true);
        this.orderNumEasy = Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1));
        this.orderNumMed = Array.from(Array(100).keys()).sort((a, b) => (0.5 - Math.random() * 1));
        this.orderNumHard = Array.from(Array(1000).keys()).sort((a, b) => (0.5 - Math.random() * 1));
        this.orderPositions = [];
        this.attackSprites = [
            { sprite: kirbyAttackDown, vector: [0, -1], sound: (() => playSound('attackdown')) },
            { sprite: kirbyAttackUp, vector: [0, 1], sound: (() => playSound('attackup')) },
            { sprite: kirbyAttackFwd, vector: "find", sound: (() => playSound('attackfwd')) }
        ];
        this.entities = {
            kirby: this.kirby, conveyor: this.conveyor, 
            conveyor2: this.conveyor2, chef: this.chef, 
            wind: this.wind, hearts: this.hearts
        };

        for (let i = 0; i < 4; i++) {
            this.orderPositions.push([i * 140 + 400, 10])
        }

        this.kirbyLink = document.querySelector("#kirbylink");
        this.lessonsLink = document.querySelector("#lessonlink")
    }

    addEventListeners(){
        this.lessonsLink.addEventListener('click', () => {
           this.gamePhase = "lessons";
        })

        this.kirbyLink.addEventListener('click', () => {
           this.gamePhase = "lessons";
        })

        this.canvas.onmousemove = (e) => {
            if (this.gamePhase === "tutorial") return null;
            let pos = this.getMousePosition(e);
            if (this.mouse.closed && this.windCooldown < 0 && this.kirby.nearby(pos)) {
                this.kirby.sprite = kirbyOpeningSprite();
                this.wind.sprite = windSprite();
                this.wind.sprite.sound();
                this.windCooldown = 1;
            }
            this.mouse.update(pos[0], pos[1])
        }

        this.canvas.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.gamePhase === "tutorial") return null
            let pos = this.getMousePosition(e);
            this.mouse.closed = !this.mouse.closed;
            Object.keys(this.sushis).forEach((id) => {
                if (this.mouse.closed && this.sushis[id].clickInside(pos)) {//grabbed sushi with chops
                    playSound('pickupsushi')
                    this.sushis[id].grabbed = true;
                    this.sushis[id].dropped = false;
                } else if (!this.mouse.closed && this.sushis[id].clickInside(pos)) {
                    if (this.sushis[id].nearby(this.kirby.pos, 100)) {
                        this.feedKirby(this.sushis[id]);
                    } else {
                        this.sushis[id].grabbed = false;
                        this.sushis[id].dropped = true;
                    }
                }
            });
            this.orders.forEach(order => {
                if (order.withinBox(pos)) {
                    if (this.soundCooldown < 0) {
                        playNumberSound(order.number, this.language)
                        this.soundCooldown = 3;
                    }
                }
            })
            if (this.ingameMusicButton.inside(pos)) {
                this.ingameMusicButton.flipped = !this.ingameMusicButton.flipped;
                this.music.play();
            }
        })
    }

    getMousePosition(e){
        let rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        return [x, y]
    }

    start(){
        this.addEventListeners();
        let now = Date.now();
        this.now = now;
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.lastTime = now;
        this.generateOrder(0);
        this.generateOrder(1);
        let sushi = this.generateSushi();
        this.sushis[sushi.id] = sushi;
        this.sushiCooldown = 2.5;
        this.update(this.dt);
        this.render();
        this.tutorial = new Tutorial(modalCanvas, modalCtx, canvas, ctx, this);
        this.canvas.classList.remove('front-canvas');
        this.canvas.classList.add('back-canvas');
        this.modalCanvas.classList.remove('back-canvas');
        this.modalCanvas.classList.add('front-canvas');
        this.tutorial.loop();
    }

    generateOrder(index){
        if (this.orders.length >= 3) return null
        this.shiftOrders();
        let randNum = this.generateRandomNumber("order");
        // while (randNum < 11 && index === 0) {
        //     randNum = this.generateRandomNumber("order");
        // }
        let characters = convertToKanji(convertNumberToArray(randNum));
        let order = new Order(
            index,
            characters,
            randNum,
            this.orderTime,
            this.orderPositions[index]
        );
        this.orders.push(order);
        if (index > 1) playNumberSound(randNum, this.language)
    }

    shiftOrders(){
        this.orders.forEach((order, i) => {
            order.pos = this.orderPositions[i];
            order.index = i;
        });
    }

    generateRandomNumber(type){
        if (type === "sushi") {
            if (this.sushiIndex === this.sushiShelf.length - 1) {
                this.sushiShelf.sort((a, b) => (0.5 - Math.random() * 1));
                this.sushiIndex = 0;
            }
            this.sushiIndex += 1;
            return this.sushiShelf[this.sushiIndex];
        } else {
            if (this.orderIndex === this.orderNumEasy.length - 1) {
                this.orderNumEasy.sort((a, b) => (0.5 - Math.random() * 1));
                this.orderIndex = 0;
            }
            this.orderIndex += 1;
            if (this.difficulty === "easy") {
                return this.orderNumEasy[this.orderIndex];
            } else if (this.difficulty === "medium") {
                return this.orderIndex % 2 === 0 ? this.orderNumEasy[this.orderIndex] : this.orderNumMed[this.orderIndex];
            } else if (this.difficulty === "hard") {
                return this.orderIndex % 2 === 0 ? this.orderNumMed[this.orderIndex] : this.orderNumHard[this.orderIndex];
            }
        }
    }

    generateSushi(){
        let startPos = [700, 320];
        if (this.gamePhase==="ending") {
            startPos = [...this.kirby.pos];
            startPos[0] += 30;
        }
        let randSushiUrl = sushiUrls[Math.floor(Math.random() * sushiUrls.length)];
        let randSushiNum = this.generateRandomNumber("sushi");
        let randSushiChar = convertToKanji(convertNumberToArray(randSushiNum));
        let sushi = new Sushi(this.sushiId, startPos, randSushiUrl, randSushiChar, randSushiNum) //700, 370 start, 130 end
        this.sushiId++;
        console.log(sushi)
        return sushi
    }

    feedKirby(sushi){
        this.kirbySucks();
        sushi.vector = sushi.findNormalizedVector(sushi.pos, this.kirby.pos)
        sushi.flying = true;
        sushi.grabbed = false;
        sushi.dropped = false;
    }

    kirbySucks(){
        this.kirby.sprite = kirbyOpeningSprite();
        this.wind.sprite = windSprite();
        this.wind.sprite.sound();
    }

    kirbyEats(sushi){
        let kirbyMood = "sad";
        if (!sushi.plated && this.gamePhase !== "ending") {
            this.orders.forEach(order => {
                if (order.charsArray.length === 1 && order.charsArray[0] === sushi.character) {
                    this.completeOrder(order, true);
                    kirbyMood = "happy";
                }
            })
        } else {
            kirbyMood = "happy";
        }
        if (kirbyMood === "happy") {
            this.kirby.sprite = kirbyHappySprite();
            this.kirby.sprite.sound();
            delete this.sushis[sushi.id];
        } else if (this.gamePhase === "ending") {
            kirbySucks();
            kirbyHappySprite().sound();
            delete this.sushis[sushi.id];
            setTimeout(() => {
                this.kirby.sprite = kirbyHappySprite();
            }, 1500)
        } else {
            this.score.update(-1);
            sushi.hit = true;
            sushi.flying = true;
            sushi.grabbed = false;
            sushi.dropped = false;
            sushi.plated = false;
            let attack = this.attackSprites[randomIndex(this.attackSprites)]
            if (attack.vector === "find") {
                sushi.vector = sushi.findNormalizedVector(this.kirby.pos, this.chef.pos)
            } else {
                sushi.vector = attack.vector;
            }
            this.kirby.sprite = attack.sprite();
            this.kirby.sprite.sound();
        }
    }

    completeOrder(order, success){
        if (success) {
            if (order.charsArray.length !== 1) {
                this.score.update(1);
                order.sushis.forEach(sushi => {
                    this.sushis[sushi.id] = sushi;
                    this.feedKirby(sushi)
                })
            } else {
                this.score.update(1);
            }
        } else if (!success) {
            this.score.update(-1);
            this.kirby.sprite = kirbySadSprite();
            this.kirby.sprite.sound();
        }
        this.orders.splice(order.index, 1);
        this.shiftOrders();
    }

    render(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#fdd13e');
        gradient.addColorStop(1 / 2, '#fdd13e');
        gradient.addColorStop(2 / 2, '#fdd13e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderSprite(this.norin);
        this.ingameMusicButton.render(this.ctx)
        this.orders.forEach(order => {
            this.renderStatic(order);
        })

        Object.keys(this.entities).forEach(key => {
            this.renderSprite(this.entities[key]);
        })

        Object.keys(this.sushis).forEach((id) => {
            this.renderStatic(this.sushis[id]);
        })

        this.mouse.render(this.ctx);
    }

    renderSprite(entity){
        this.ctx.save();
        this.ctx.translate(entity.pos[0], entity.pos[1]);

        if (entity.sprite.render(this.ctx)) {
            let sprite = entity.defaultSprite();
            entity.sprite = sprite;
        };
        this.ctx.restore();
    }

    renderStatic(entity){
        this.ctx.save();
        this.ctx.translate(entity.pos[0], entity.pos[1]);
        entity.render(this.ctx);
        this.ctx.restore();
    }

    update(dt){
        if ((this.score.score === 0 
            || this.score.score === this.endGameScore) 
            && this.gamePhase !== "ending") this.endGame();
        this.gameTime += dt;
        this.updateCooldowns(dt);
        this.updateEntities(dt);
        this.ingameMusicButton.update(dt);
    };

    updateEntities(dt){
        this.updateOrders(dt);
        this.updateSprites(dt);
        this.updateSushis(dt);
    }

    updateCooldowns(dt){
        this.orderCooldown -= dt;
        this.sushiCooldown -= dt;
        this.soundCooldown -= dt;
        this.windCooldown -= dt;
    }

    updateOrders(dt){
        if (this.orderCooldown < 0) {
            this.orderCooldown = 5;
            this.generateOrder(this.orders.length);
        }
        this.orders.forEach(order => {
            order.update(dt)
            if (order.timeUp()) {
                this.completeOrder(order, false);
            } else if (order.ready()) {
                setTimeout(this.completeOrder(order, true), 2000)
            }
        })
    }

    updateSprites(dt){
        Object.keys(this.entities).forEach(key => {
            this.entities[key].sprite.update(dt);
        })
    }

    updateSushis(dt){
        this.sushiCooldown -= dt;
        if (this.sushiCooldown < 0) {
            this.sushiCooldown = 2.5;
            let sushi = this.generateSushi()
            this.sushis[sushi.id] = sushi;
        }

        Object.keys(this.sushis).forEach((id) => {
            let sushi = this.sushis[id];
            sushi.update(dt, 8, [this.mouse.x, this.mouse.y])
            if (sushi.flying) {
                if (sushi.nearby(this.kirby.pos, 30)) {
                    if (!sushi.hit) {
                        this.kirbyEats(sushi);
                    } else if (this.gamePhase == "ending") {
                        if (this.score.score < this.endGameScore) {
                            sushi.hit = true;
                            sushi.flying = true;
                            sushi.vector = sushi.findNormalizedVector(sushi.pos, this.chef.pos)
                        } else {
                            this.kirbyEats(sushi);
                        }
                    }
                } else if (sushi.nearby(this.chef.pos, 30)) {
                    sushi.dropped = true;
                    sushi.flying = false;
                    this.chef.sprite = chefHurtSprite();
                }
            } else if (sushi.offConveyor()) {
                delete this.sushis[sushi.id];
            } else if (sushi.grabbed) {
                this.orders.forEach(order => {
                    if (order.within(sushi.pos)
                        && order.charsArray.includes(sushi.character)
                        && order.charsArray.length !== 1) {
                        order.addSushi(sushi);
                        delete this.sushis[sushi.id]
                    }
                })
            }
        })
    }

    gameLoop(){
        if (this.gamePhase === "tutorial" || this.gamePhase === "lessons") return null;
        console.log("game looping")
        this.now = Date.now();
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.lastTime = this.now;
        this.update(this.dt);
        this.render();
        requestAnimFrame(this.gameLoop);
    };


    endGame(){
        this.score.gameEnd = true;
        if (this.score.score === 0 && this.gamePhase !== "ending") {
            this.gamePhase = "ending";
            this.kirby.sprite = kirbyCombo();
            this.kirby.sprite.sound();
            let spit = setInterval(() => {
                let sushi = this.generateSushi(true);
                sushi.grabbed = false;
                sushi.dropped = false;
                sushi.plated = false;
                sushi.hit = true;
                sushi.flying = true;
                sushi.speed = 20;
                this.sushis[sushi.id] = sushi;
            }, 300);
            spit;
            setTimeout(() => {
                clearInterval(spit);
                this.switchToGameOver();
            }, 2000)
        } else if (this.gamePhase !== "ending") {
            this.gamePhase = "ending";
            this.kirbySucks();
            Object.keys(this.sushis).forEach(id => {
                let sushi = this.sushis[id];
                sushi.grabbed = false;
                sushi.dropped = false;
                sushi.plated = false;
                sushi.hit = false;
                sushi.flying = true;
                sushi.vector = sushi.findNormalizedVector(sushi.pos, this.kirby.pos)
            })
            setTimeout(() => {
                this.switchToGameOver();
            }, 2000)
        }
    }

    switchToGameOver(){
        this.tutorial.step = "end";
        this.tutorial.change = true;
        this.canvas.classList.remove('front-canvas');
        this.canvas.classList.add('back-canvas');
        this.modalCanvas.classList.remove('back-canvas');
        this.modalCanvas.classList.add('front-canvas');
        this.gamePhase = "tutorial";
        this.tutorial.loop();

        // tutorial = true;
        // step = "end";
        // change = true;
    }
}