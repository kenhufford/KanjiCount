class Tutorial{
    constructor(modalCanvas, modalCtx, canvas, ctx, game){
        
        this.game = game;
        this.modalCanvas = modalCanvas;
        this.modalCtx = modalCtx;
        this.canvas = canvas;
        this.ctx = ctx;
        this.difficulty = "medium";
        this.language = "cantonese";

        let now = Date.now();
        this.now = now;
        this.lastTime = now;
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.step = 0;
        this.change = false;
        this.tutorialToggle = true;

        this.spotlight = new Spotlight(this.game.kirby.pos[0] + this.game.kirby.sprite.size[0] / 2, this.game.kirby.pos[1] + this.game.kirby.sprite.size[1] / 2, 80)
        this.modaltext = new Modaltext(300, 300, 0);
        this.languageButton = new Button([100, 100], 120, 50, 4, 33, "Cantonese", "Japanese", "", true);
        this.difficultyButton = new Button([100, 200], 120, 50, 4, 33, "Easy", "Medium", "", true);
        this.tutorialButton = new Button([100, 300], 120, 50, 4, 33, "Tutorial", "None", "", true);
        this.tutorialMusicButton = new Button([100, 400], 120, 50, 4, 33, "Off", "On", "", true);
        this.readyButton = new Button([400, 500], 120, 50, 4, 33, "Start", "Start", "", false);
        this.buttons = {
            languageButton: this.languageButton,
            difficultyButton: this.difficultyButton,
            tutorialButton: this.tutorialButton,
            readyButton: this.readyButton,
            tutorialMusicButton: this.tutorialMusicButton
        }
        this.addEventListeners();

        this.loop = this.loop.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.startGame = this.startGame.bind(this);

        this.kirbyLink = document.querySelector("#kirbylink");
        this.lessonsLink = document.querySelector("#lessonlink")
    }

    getMousePosition(e) {
        let rect = this.modalCanvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        return [x, y]
    }

    startNewGame(){
        this.canvas.classList.add('front-canvas');
        this.canvas.classList.remove('back-canvas');
        this.modalCanvas.classList.add('back-canvas');
        this.modalCanvas.classList.remove('front-canvas');
        this.game = new Game("medium", "cantonese", this.canvas,this.ctx, this.modalCanvas, this.modalCtx, this);
        this.step = 7;
        this.game.start();
    }

    startGame(){
        this.canvas.classList.add('front-canvas');
        this.canvas.classList.remove('back-canvas');
        this.modalCanvas.classList.add('back-canvas');
        this.modalCanvas.classList.remove('front-canvas');
        let now = Date.now();
        this.game.lastTime = now;
        this.game.ingameMusicButton.flipped = this.tutorialMusicButton.flipped;
        this.game.difficulty = this.difficulty;
        this.game.gamePhase = "game";
        this.game.gameLoop();
    }

    addEventListeners(){
        this.modalCanvas.onmousemove = (e) => {
            if (this.game.gamePhase !== "tutorial") return null;
            let modalPos = this.getMousePosition(e);
            this.game.mouse.update(modalPos[0], modalPos[1])
        }

        this.modalCanvas.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.game.gamePhase !== "tutorial") return null
            this.game.mouse.closed = !this.game.mouse.closed;
            let pos = this.getMousePosition(e);

            if (this.step === "end" && this.readyButton.inside(pos)) {
                this.readyButton.flipped = !this.readyButton.flipped;
                setTimeout(this.startNewGame, 1000);
            }

            if (this.step === 0) {
                if (this.readyButton.inside(pos)) {
                    this.readyButton.flipped = !this.readyButton.flipped;
                    setTimeout(() => {
                        if (!this.tutorialToggle) {
                            this.startGame();
                        } else {
                            this.step += 1;
                            this.change = true;
                        }
                    }, 1000)
                } else if (this.tutorialButton.inside(pos)) {
                    this.tutorialButton.flipped = !this.tutorialButton.flipped;
                    this.tutorialToggle = !this.tutorialToggle;
                } else if (this.difficultyButton.inside(pos)) {
                    this.difficultyButton.flipped = !this.difficultyButton.flipped;
                    this.difficulty = this.difficulty === "medium" ? "easy" : "medium";
                } else if (this.languageButton.inside(pos)) {
                    this.languageButton.flipped = !this.languageButton.flipped;
                    this.language = this.language === "cantonese" ? "japanese" : "cantonese";
                } else if (this.tutorialMusicButton.inside(pos)) {
                    this.tutorialMusicButton.flipped = !this.tutorialMusicButton.flipped;
                    this.game.music.play();
                }
            } if (this.step === 6) {
                this.startGame();
            } else if (this.step !== "end" && this.step !== 0) {
                this.step += 1;
                this.change = true;
            }
        })
    }

    loop(){
        if (this.step > 6 || this.game.gamePhase === "lessons") return null;
        this.now = Date.now();
        this.dt = (this.now - this.lastTime) / 1000.0;
        this.lastTime = this.now;
        if (this.change) {
            switch (this.step) {
                case 1:
                    this.spotlight.x = this.game.kirby.pos[0] + this.game.kirby.sprite.size[0] / 2;
                    this.spotlight.y = this.game.kirby.pos[1] + this.game.kirby.sprite.size[1] / 2;
                    this.spotlight.radius = 1;
                    this.spotlight.maxRadius = 80;
                    this.modaltext.step = this.step;
                    break;
                case 2:
                    this.spotlight.x = this.game.sushis[1].pos[0] + 30;
                    this.spotlight.y = this.game.sushis[1].pos[1] + 30;
                    this.spotlight.radius = 1;
                    this.spotlight.maxRadius = 80;
                    this.modaltext.step = this.step;;
                    break;
                case 3:
                    this.spotlight.x = this.game.orders[0].pos[0] + this.game.orders[0].width / 2;
                    this.spotlight.y = this.game.orders[0].pos[1] + this.game.orders[0].height / 2;
                    this.spotlight.radius = 1;
                    this.spotlight.maxRadius = 80;
                    this.modaltext.step = this.step;;
                    break;
                case 4:
                    this.spotlight.x = this.game.kirby.pos[0] + this.game.kirby.sprite.size[0] / 2 + 60;
                    this.spotlight.y = this.game.kirby.pos[1] + this.game.kirby.sprite.size[1] / 2;
                    this.spotlight.radius = 1;
                    this.spotlight.maxRadius = 110;
                    this.game.kirby.sprite = kirbyOpeningSprite();
                    this.game.wind.sprite = windSprite()
                    this.game.wind.sprite.sound();
                    setTimeout(() => {
                        this.game.wind.sprite = windSprite();
                        this.game.kirby.sprite = kirbyOpeningSprite();
                        this.game.wind.sprite.sound();
                    }, 1000);
                    setTimeout(() => {
                        this.game.wind.sprite = windSprite();
                        this.game.kirby.sprite = kirbyOpeningSprite();
                        this.game.wind.sprite.sound();
                    }, 2000);
                    this.modaltext.step = this.step;
                    break;
                case 5:
                    this.spotlight.x = this.game.orders[0].pos[0] + this.game.orders[0].width / 2;
                    this.spotlight.y = this.game.orders[1].pos[1] + 20 + this.game.orders[0].plateDistance;
                    this.spotlight.radius = 1;
                    this.spotlight.maxRadius = 80;
                    this.modaltext.step = this.step;
                    break;
                case 6:
                    this.spotlight.x = this.game.hearts.pos[0] + 80
                    this.spotlight.y = this.game.hearts.pos[1] + 25;
                    this.spotlight.radius = 1;
                    this.spotlight.maxRadius = 80;
                    this.modaltext.step = this.step;
                    break;
                case "end":
                    this.spotlight.x = this.game.kirby.pos[0] + this.game.kirby.sprite.size[0] / 2;
                    this.spotlight.y = this.game.kirby.pos[1] + this.game.kirby.sprite.size[1] / 2;
                    this.spotlight.radius = 1;
                    this.spotlight.maxRadius = 80;
                    this.modaltext.step = this.game.score.score > 0  ? "win" : "lose";
                    this.game.kirby.sprite = this.game.score.score > 0 ? kirbyWinSprite() : kirbyLoseSprite();
                    this.readyButton.flipped = false;
                    setTimeout(this.game.kirby.sprite.sound, 1000)
                    break;
            }
            this.change = false;
        }
        this.updateTutorial(this.dt);
        this.renderTutorial(this.dt);
        requestAnimFrame(this.loop);
    }


    updateTutorial(dt){
        this.game.gameTime += dt;
        this.game.updateSprites(dt)
        this.spotlight.update(dt)
        Object.keys(this.buttons).forEach(key => {
            this.buttons[key].update(dt)
        })
    };

    renderTutorial(){
        this.modalCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.game.mouse.render(this.modalCtx);
        this.modalCtx.globalAlpha = 0.9;
        this.modalCtx.fillStyle = "#000000";
        this.modalCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.game.render()
        if (this.step !== 0) this.spotlight.render(this.modalCtx, this.modalCanvas);
            this.modaltext.render(this.modalCtx);
        if (this.step === 0) {
            Object.keys(this.buttons).forEach(key => {
                this.buttons[key].render(this.modalCtx);
            })
        }
        if (this.step === "end") {
            this.readyButton.render(this.modalCtx);
        }
    };

}