let canvas = document.querySelector("#game-canvas");
let ctx = canvas.getContext("2d");
let modalCanvas = document.querySelector("#modal-canvas");
let modalCtx = modalCanvas.getContext("2d");

let resources = new Resources();
let requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
let kanjiArray = Object.values(kanji);

//game variables

let gameModes = {
    easy: {
        sushiShelf: Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1)),
        orderTime: 25,
        orderCooldown: 10,
        startScore: 3
    },
    medium: {
        sushiShelf: Array.from(Array(11).keys()).concat([10, 10]).sort((a, b) => (0.5 - Math.random() * 1)),
        orderTime: 25,
        orderCooldown: 10,
        startScore: 2,
    },
    hard: {
        sushiShelf: Array.from(Array(11).keys()).concat([10, 10, 10, 100, 100, 100]).sort((a, b) => (0.5 - Math.random() * 1)),
        orderTime: 25,
        orderCooldown: 10,
        startScore: 1
    }
}
let tutorial = true;
let isGameOver = false;
let isGameEnding = false;
let isGameStart = false;
let mode = "medium";
let ordNumIndex = 0;
let sushiNumIndex = 0;
let sushiID = 1;
let gameTime = 0;
let sushis = {};
let answers = {};
let orders = [];
let orderPositions = [];
let sushiCooldown = 2.5;
let soundCooldown = 3;
let endGameScore = 10;
let windCooldown = 1;
let sushiShelf;

let language = 'cantonese';
let lastTime = Date.now();
let now = Date.now();
let dt = (now - lastTime) / 1000.0;
let tutorialToggle = true;

let orderCooldown = gameModes[mode].orderCooldown;
let orderTime = gameModes[mode].orderTime;
let orderNumEasy = Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1));
let orderNumMed = Array.from(Array(100).keys()).sort((a, b) => (0.5 - Math.random() * 1));
let orderNumHard = Array.from(Array(1000).keys()).sort((a, b) => (0.5 - Math.random() * 1));

//sprite and entity setup
let conveyorSprite = new Sprite("https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png", [0, 0], [605, 60], 4, [0, 1, 2, 3], 'vertical', false);
let conveyorSprite2 = new Sprite("https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png", [0, 0], [605, 60], 4, [3, 2, 1, 0], 'vertical', false);
let kirbySpriteURL = 'https://i.imgur.com/L41WBdc.png';
let heartsSpriteURL = 'https://i.imgur.com/yHVGEZl.png';
let norinSpriteURL = "https://i.imgur.com/K6KU5Rs.png";
let kirbyOpeningSprite = () => new Sprite(kirbySpriteURL, [0, 0], [75, 75], 10, [0, 1, 1, 2, 2, 3, 3, 4, 4], "horizontal", true);
let kirbyClosingSprite = () => new Sprite(kirbySpriteURL, [150, 0], [75, 75], 10, [0, 1, 2], "horizontal", true)
let kirbyIdleSprite = () => new Sprite(kirbySpriteURL, [0, 75], [75, 75], 10, Array.from(Array(34).keys()), "horizontal", false)
let kirbySadSprite = () => new Sprite(kirbySpriteURL, [0, 150], [75, 75], 10, [0, 1, 2], "horizontal", true, () => playSound('disappointed'))
let kirbyHappySprite = () => new Sprite(kirbySpriteURL, [0, 225], [75, 75], 10, [0, 1, 2,3], "horizontal", true, () => playSound('haumph'))
let kirbyWinSprite = () => new Sprite(kirbySpriteURL, [0, 2025], [75, 75], 10, Array.from(Array(13).keys()), "horizontal", false, () => playSound('hi'))
let kirbyLoseSprite = () => new Sprite(kirbySpriteURL, [0, 1950], [75, 75], 10, Array.from(Array(14).keys()), "horizontal", false, () => playSound('wahhh'))
let kirbyAttackFwd = () => new Sprite(kirbySpriteURL, [0, 600], [150, 75], 20, [0, 1, 2, 3], "horizontal", true, () => playSound('attackfwd'))
let kirbyAttackDown = () => new Sprite(kirbySpriteURL, [0, 900], [150, 150], 20, [0, 1, 2, 3, 4, 5], "horizontal", true, () => playSound('attackdown'))
let kirbyAttackUp = () => new Sprite(kirbySpriteURL, [0, 1050], [150, 150], 20, [0, 1, 2, 3, 4], "horizontal", true, () => playSound('attackup'))
let kirbyCombo = () => new Sprite(kirbySpriteURL, [0, 1800], [150, 150], 15, Array.from(Array(26).keys()), "horizontal", true, () => {
    playSound('attackfwd');
    setTimeout(() => playSound('attackdown'), 400);
    setTimeout(() => playSound('attackfwd'), 800);
    setTimeout(() => playSound('attackdown'), 1200);
    setTimeout(() => playSound('attackup'), 1600);
})
let chefSprite = () => new Sprite(kirbySpriteURL, [0, 525], [150, 75], 3.2, [0, 1, 2, 3], "horizontal", false)
let chefHurtSprite = () => new Sprite(kirbySpriteURL, [0, 750], [105, 105], 12, Array.from(Array(8).keys()), "horizontal", true)
let windSprite = () => new Sprite(kirbySpriteURL, [0, 1200], [225, 225], 25, Array.from(Array(11).keys()), "horizontal", true, () => playSound('suck'));
let noWindSprite = () => new Sprite(kirbySpriteURL, [0, 0], [0, 0], 0, Array.from(Array(1).keys()), "horizontal", false);
let heartsSprite = () => new Sprite(heartsSpriteURL, [0, 0], [250, 50], 1, [10 - gameModes[mode].startScore], "vertical", false);
let norinSprite = () => new Sprite(norinSpriteURL, [100, 0], [900, 190], 1, [0], "vertical", false);
let conveyor = new Entity([150, 350], conveyorSprite, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
let conveyor2 = new Entity([110, 500], conveyorSprite2, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
let kirby = new Entity([50, 200], kirbyIdleSprite(), kirbySpriteURL, kirbyIdleSprite)
let chef = new Entity([750, 310], chefSprite(), kirbySpriteURL, chefSprite)
let wind = new Entity([90, 110], noWindSprite(), kirbySpriteURL, noWindSprite)
let hearts = new Entity([10, 10], heartsSprite(), heartsSpriteURL, heartsSprite);
let score = new Score(gameModes[mode].startScore, [10,10], endGameScore, hearts)
let mouse = new Mouse(false, 0, 0, mouseImages[0], mouseImages[1])
let spotlight = new Spotlight(kirby.pos[0] + kirby.sprite.size[0] / 2, kirby.pos[1] + kirby.sprite.size[1] / 2, 80)
let languageButton = new Button([100, 100], 120, 50, 4, 33, "Cantonese", "Japanese");
let difficultyButton = new Button([100, 200], 120, 50, 4, 33, "Easy", "Medium");
let tutorialButton = new Button([100, 300], 120, 50, 4, 33, "Tutorial", "None");
let tutorialMusicButton = new Button([100, 400], 120, 50, 4, 33, "Music Off", "Music On");
let ingameMusicButton = new Button([760, 530], 120, 50, 4, 33, "Music Off", "Music On");
let readyButton = new Button([100, 500], 120, 50, 4, 33, "Not Yet", "Ready");
let norin = new Entity([0,0], norinSprite(), norinSpriteURL, norinSprite);
let music = new Music(gameSoundFiles["kirbysong"]);

let attackSprites = [
    { sprite: kirbyAttackDown, vector: [0, -1], sound: (() => playSound('attackdown')) }, 
    { sprite: kirbyAttackUp, vector: [0, 1], sound: (() => playSound('attackup')) }, 
    { sprite: kirbyAttackFwd, vector: "find", sound: (() => playSound('attackfwd'))}
];
let entities = {
    kirby, conveyor, conveyor2, chef, wind, hearts
};

let buttons = {
    languageButton, difficultyButton,  tutorialButton, readyButton, tutorialMusicButton
}

let resetGame = () => {
    debugger
    step = 0;
    modaltext.step = step;
    tutorial = true;
    isGameOver = false;
    isGameEnding = false;
    isGameStart = false;
    score.score = gameModes[mode].startScore;
    ordNumIndex = 0;
    sushiNumIndex = 0;
    sushiID = 1;
    gameTime = 0;
    sushis = {};
    answers = {};
    orders = [];
    orderPositions = [];
    sushiShelf;
    endGameScore = 10;
    kirby.sprite = kirbyIdleSprite();
    tutorialToggle = true;
    Object.keys(buttons).forEach(key=> buttons[key].flipped = false);
    orderNumEasy = Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1));
    orderNumMed = Array.from(Array(100).keys()).sort((a, b) => (0.5 - Math.random() * 1));
    orderNumHard = Array.from(Array(1000).keys()).sort((a, b) => (0.5 - Math.random() * 1));
    init();
}

let init = () => {
    now = Date.now();
    dt = (now - lastTime) / 1000.0;
    lastTime = now;
    generateOrderPositions(4, 140, 10)
    generateOrder(0);
    generateOrder(1);
    sushiCooldown = 2.5;
    let sushi = generateSushi()
    sushis[sushi.id] = sushi;
    update(dt);
    render();
    if (tutorial){
        canvas.classList.remove('front-canvas');
        canvas.classList.add('back-canvas');
        modalCanvas.classList.remove('back-canvas');
        modalCanvas.classList.add('front-canvas');
        tutorialLoop()
    } else {
        orderCooldown = gameModes[mode].orderCooldown;
        orderTime = gameModes[mode].orderTime;
        gameLoop();
    }
}

resources.loadSelector(images);
resources.onReady(init);

modalCanvas.addEventListener('click', (e) =>{
    e.preventDefault();
    if (!tutorial) return null
    mouse.closed = !mouse.closed;
    let pos = getMousePosition(e);
    
    if (step === "end" && readyButton.inside(pos)) {
        readyButton.flipped = !readyButton.flipped;
        setTimeout(resetGame, 1000);
    }

    if (step === 0){
        if (readyButton.inside(pos)){
            readyButton.flipped = !readyButton.flipped;
            setTimeout(()=>{
                if (!tutorialToggle){
                    tutorial = false;
                    isGameStart = true;
                    canvas.classList.add('front-canvas');
                    canvas.classList.remove('back-canvas');
                    modalCanvas.classList.add('back-canvas');
                    modalCanvas.classList.remove('front-canvas');
                } else {
                    step += 1;
                    change = true;
                }
            }, 1000)
        } else if (tutorialButton.inside(pos)){
            tutorialButton.flipped = !tutorialButton.flipped;
            tutorialToggle = !tutorialToggle;
        } else if (difficultyButton.inside(pos)){
            difficultyButton.flipped = !difficultyButton.flipped;
            mode = mode === "medium" ? "easy" : "medium";
        } else if (languageButton.inside(pos)){
            languageButton.flipped = !languageButton.flipped;
            language = language === "cantonese" ? "japanese" : "cantonese";
            debugger
        } else if (tutorialMusicButton.inside(pos)){
            tutorialMusicButton.flipped = !tutorialMusicButton.flipped;
            music.play();
        }
    } else{
        step += 1;
        change = true;
    }
    if (step > 6){
        tutorial = false;
        isGameStart = true;
        canvas.classList.add('front-canvas');
        canvas.classList.remove('back-canvas');
        modalCanvas.classList.add('back-canvas');
        modalCanvas.classList.remove('front-canvas');
    }
})

canvas.addEventListener('click', (e) => {
    e.preventDefault();
    if (tutorial) return null
    let pos = getMousePosition(e);
    mouse.closed = !mouse.closed;
    Object.keys(sushis).forEach((id) => {
        if (mouse.closed && sushis[id].clickInside(pos)) {//grabbed sushi with chops
            playSound('pickupsushi')
            sushis[id].grabbed = true;
            sushis[id].dropped = false;
        } else if (!mouse.closed && sushis[id].clickInside(pos)){
            if (sushis[id].nearby(kirby.pos, 100)){
                feedKirby(sushis[id]);
            } else {
                sushis[id].grabbed = false;
                sushis[id].dropped = true;    
            }
        }
    });
    orders.forEach (order => {
        if (order.withinBox(pos)) {
            if (soundCooldown < 0) {
                playNumberSound(order.number, language)
                soundCooldown = 3;
            }
            
        }
    })
    if (ingameMusicButton.inside(pos)){
        ingameMusicButton.flipped = !ingameMusicButton.flipped;
        music.play();
    }
})


//helper functions
let randomIndex = (array) => Math.floor(Math.random() * array.length)

let generateRandomNumber = (type) => {
    if (type === "sushi"){
        sushiShelf= gameModes[mode].sushiShelf;
        if (sushiNumIndex === sushiShelf.length-1) {
            sushiShelf.sort((a, b) => (0.5 - Math.random() * 1));
            sushiNumIndex = 0;
        }
        sushiNumIndex += 1;
        return sushiShelf[sushiNumIndex];
      
    } else {
        if (ordNumIndex === orderNumEasy.length-1){
            orderNumEasy.sort((a, b) => (0.5 - Math.random() * 1));
            ordNumIndex = 0;
        }
        
        ordNumIndex += 1;
        if (mode==="easy"){
            return orderNumEasy[ordNumIndex];
        } else if (mode==="medium"){
            return ordNumIndex % 2 === 0 ? orderNumEasy[ordNumIndex] : orderNumMed[ordNumIndex];
        } else if (mode === "hard") {
            return ordNumIndex % 2 === 0 ? orderNumMed[ordNumIndex] : orderNumHard[ordNumIndex];
        }
    }
}

let generateOrderPositions = (numPos, x, y) =>{
    for (let i = 0; i < numPos; i++){
        orderPositions.push([i*x + 400, y])
    }
}

let getMousePosition = (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    return [x, y]
}

canvas.onmousemove = (e) => {
    if (tutorial) return null
    let pos = getMousePosition(e);
    if (mouse.closed && windCooldown < 0 && kirby.nearby(pos)) {
        kirby.sprite = kirbyOpeningSprite();
        wind.sprite = windSprite();
        wind.sprite.sound();
        windCooldown = 1;
    }
    mouse.update(pos[0], pos[1])
}

modalCanvas.onmousemove = (e) => {
    if (!tutorial) return null
    let modalPos = getMousePosition(e);
    mouse.update(modalPos[0], modalPos[1])
}




//game helper functions

let generateOrder = (index) => {
    if (orders.length >= 3) return null
    shiftOrders();
    let randNum = generateRandomNumber("order");
    while (randNum < 11 && index === 0){
        randNum = generateRandomNumber("order");
    }
    let characters = convertToKanji(convertNumberToArray(randNum));
    let order = new Order(
        index,
        characters,
        randNum,
        orderTime,
        orderPositions[index]
    );
    
    orders.push(order);
    playNumberSound(randNum, language)
}

let shiftOrders = () => {
    orders.forEach((order, i) => {
        order.pos = orderPositions[i];
        order.index = i;
    });
}

let generateSushi = (end) => {
    let startPos = [700, 320];
    if (end) {
        startPos = [...kirby.pos];
        startPos[0] += 30;
    }
    let randSushiUrl = sushiUrls[Math.floor(Math.random() * sushiUrls.length)];
    let randSushiNum = generateRandomNumber("sushi");
    let randSushiChar = convertToKanji(convertNumberToArray(randSushiNum));
    let sushi = new Sushi(sushiID, startPos, randSushiUrl, randSushiChar, randSushiNum) //700, 370 start, 130 end
    sushiID++;
    return sushi
}

let feedKirby = (sushi) => {
    wind.sprite = windSprite();
    wind.sprite.sound();
    kirby.sprite = kirbyOpeningSprite();
    sushi.vector = sushi.findNormalizedVector(sushi.pos, kirby.pos)
    sushi.flying = true;
    sushi.grabbed = false;
    sushi.dropped = false;
}

let kirbySucks = () => {
    kirby.sprite = kirbyOpeningSprite();
    wind.sprite = windSprite();
    wind.sprite.sound();
}

let kirbyEats = (sushi) => {
    let kirbyMood = "sad";
    if (!sushi.plated && !isGameEnding){
        orders.forEach(order => {
            if (order.charsArray.length === 1 && order.charsArray[0] === sushi.character){
                completeOrder(order, true);
                kirbyMood = "happy"
            }
        })
    } else {
        kirbyMood = "happy";
    }
    if (kirbyMood === "happy"){
        kirby.sprite = kirbyHappySprite();
        kirby.sprite.sound();
        delete sushis[sushi.id];
    } else if (isGameEnding){
        kirbySucks();
        kirbyHappySprite().sound();
        delete sushis[sushi.id];
        setTimeout( () => {
            kirby.sprite = kirbyHappySprite();
        }, 1500)
    } else {
        
        score.update(-1);
        sushi.hit = true;
        sushi.flying = true;
        sushi.grabbed = false;
        sushi.dropped = false;
        sushi.plated = false;
        let attack = attackSprites[randomIndex(attackSprites)]
        if (attack.vector === "find") {
            sushi.vector = sushi.findNormalizedVector(kirby.pos, chef.pos)
        } else {
            sushi.vector = attack.vector;
        }
        kirby.sprite = attack.sprite();
        kirby.sprite.sound();
    }
}

let completeOrder = (order, success) => {
    if (success){
        if (order.charsArray.length !==1){
            score.update(1);
            order.sushis.forEach(sushi => {
                sushis[sushi.id] = sushi;
                feedKirby(sushi)
            }) 
        } else {
            kirbyMood = "happy";
            score.update(1);
        }
    } else if (!success){
        score.update(-1);
        kirby.sprite = kirbySadSprite();
        kirby.sprite.sound();
    }
    orders.splice(order.index, 1);
    shiftOrders();
}

//game functions


let render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fdd13e');
    gradient.addColorStop(1 / 2, '#fdd13e');
    gradient.addColorStop(2 / 2, '#fdd13e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    renderSprite(norin);
    ingameMusicButton.render(ctx)

    orders.forEach(order => {
        renderStatic(order);
    })

    Object.keys(entities).forEach(key => {
        renderSprite(entities[key]);
    })

    Object.keys(sushis).forEach((id) => {
        renderStatic(sushis[id]);
    })

    mouse.render(ctx);

};


let renderSprite = (entity) => {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    
    if (entity.sprite.render(ctx)){
        let sprite = entity.defaultSprite();
        entity.sprite = sprite;
    };
    ctx.restore();
}

let renderStatic = (entity) => {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.render(ctx);
    ctx.restore();
}

let gameLoop = () => {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    lastTime = now;
    update(dt);
    render();
    if (step !== "end") requestAnimFrame(gameLoop);
};

let update = (dt) => {
    if(!isGameOver){
        if ((score.score === 0 || score.score === endGameScore )&& !isGameEnding) endGame();
        gameTime += dt;
        updateCooldowns(dt);
        updateEntities(dt);
        ingameMusicButton.update(dt);
    }
};

let updateEntities = (dt) => {
    updateOrders(dt);
    updateSprites(dt);
    updateSushis(dt);
}

let updateCooldowns = (dt) => {
    orderCooldown -= dt;
    sushiCooldown -= dt;
    soundCooldown -= dt;
    windCooldown -= dt;
}

let updateOrders = (dt) => {
    if (orderCooldown < 0) {
        orderCooldown = 5;
        generateOrder(orders.length);
    }
    orders.forEach( (order, i) => {
        order.update(dt)
        if (order.timeUp()){
            completeOrder(order, false);
        } else if (order.ready()) {
            setTimeout(completeOrder(order, true), 2000)
        }
    })
}

let updateSprites = (dt) => {
    Object.keys(entities).forEach(key => {
        entities[key].sprite.update(dt);
    })
}

let updateSushis = (dt) => {
    sushiCooldown -= dt;
    if (sushiCooldown < 0) {
        sushiCooldown = 2.5;
        let sushi = generateSushi()
        sushis[sushi.id] = sushi;
    }

    Object.keys(sushis).forEach((id) => {
        let sushi = sushis[id];
        sushi.update(dt, 8, [mouse.x, mouse.y])
        if (sushi.flying){
            if (sushi.nearby(kirby.pos, 30)){
                if(!sushi.hit){
                    kirbyEats(sushi);
                } else if (isGameEnding){
                    if (score.score < endGameScore) {
                        sushi.hit = true;
                        sushi.flying = true;
                        sushi.vector = sushi.findNormalizedVector(sushi.pos, chef.pos)
                    } else {
                        kirbyEats(sushi);
                    }
                }
            } else if (sushi.nearby(chef.pos, 30)) {
                sushi.dropped = true;
                sushi.flying = false;
                chef.sprite = chefHurtSprite();
            }
        } else if (sushi.offConveyor()) {
            delete sushis[sushi.id];
        } else if (sushi.grabbed) {
            orders.forEach(order => {
                if (order.within(sushi.pos)
                    && order.charsArray.includes(sushi.character)
                    && order.charsArray.length !== 1) {
                    order.addSushi(sushi);
                    delete sushis[sushi.id]
                }
            })
        }
    })
}



let endGame = () => {
    score.gameEnd = true;
    if (score.score === 0 && !isGameEnding) {
        isGameEnding = true;
        kirby.sprite = kirbyCombo();
        kirby.sprite.sound();
        let spit = setInterval(() => {
            let sushi = generateSushi(true);
            sushi.grabbed = false;
            sushi.dropped = false;
            sushi.plated = false;
            sushi.hit = true;
            sushi.flying = true;
            sushi.speed = 20;
            sushis[sushi.id] = sushi;
        }, 300);
        spit;
        setTimeout(() => {
            clearInterval(spit);
            switchToGameOver();
            tutorialLoop();
        }, 2000)
    } else if (!isGameEnding) {
        isGameEnding = true;
        kirbySucks();
        Object.keys(sushis).forEach(id => {
            let sushi = sushis[id];
            sushi.grabbed = false;
            sushi.dropped = false;
            sushi.plated = false;
            sushi.hit = false;
            sushi.flying = true;
            sushi.vector = sushi.findNormalizedVector(sushi.pos, kirby.pos)
        })
        setTimeout(() => { 
            switchToGameOver();
            tutorialLoop();
        }, 2000)
    }
}

let switchToGameOver = () => {
    canvas.classList.remove('front-canvas');
    canvas.classList.add('back-canvas');
    modalCanvas.classList.remove('back-canvas');
    modalCanvas.classList.add('front-canvas');
    isGameOver = true;
    tutorial = true;
    step = "end";
    change = true;
}


let step = 0;
let change = true;
let modaltext =  new Modaltext(300, 300, 0)

let tutorialLoop = () => {
    if (!tutorial) {
        gameLoop();
        return;
    };
    if (tutorial) {
        now = Date.now();
        dt = (now - lastTime) / 1000.0;
        lastTime = now;
        if (change){
            switch (step) {
                case 1:
                    spotlight.x = kirby.pos[0] + kirby.sprite.size[0] / 2;
                    spotlight.y = kirby.pos[1] + kirby.sprite.size[1] / 2;
                    spotlight.radius = 1;
                    spotlight.maxRadius = 80;
                    modaltext.step = step;
                    break;
                case 2:
                    spotlight.x = sushis[1].pos[0] + 30;
                    spotlight.y = sushis[1].pos[1] + 30;
                    spotlight.radius = 1;
                    spotlight.maxRadius = 80;
                    modaltext.step = step;
                    break;
                case 3:
                    spotlight.x = orders[0].pos[0] + orders[0].width / 2;
                    spotlight.y = orders[0].pos[1] + orders[0].height / 2;
                    spotlight.radius = 1;
                    spotlight.maxRadius = 80;
                    modaltext.step = step;
                    break;
                case 4:
                    spotlight.x = kirby.pos[0] + kirby.sprite.size[0] / 2 + 60;
                    spotlight.y = kirby.pos[1] + kirby.sprite.size[1] / 2;
                    spotlight.radius = 1;
                    spotlight.maxRadius = 110;
                    kirby.sprite = kirbyOpeningSprite();
                    wind.sprite = windSprite()
                    wind.sprite.sound();
                    setTimeout(() => {
                        wind.sprite = windSprite();
                        kirby.sprite = kirbyOpeningSprite();
                        wind.sprite.sound();
                    }, 1000);
                    setTimeout(() => {
                        wind.sprite = windSprite();
                        kirby.sprite = kirbyOpeningSprite();
                        wind.sprite.sound();
                    }, 2000);
                    modaltext.step = step;
                    break;
                case 5:
                    spotlight.x = orders[0].pos[0] + orders[0].width / 2;
                    spotlight.y = orders[1].pos[1] + 20 + orders[0].plateDistance;
                    spotlight.radius = 1;
                    spotlight.maxRadius = 80;
                    modaltext.step = step;
                    break;
                case 6:
                    spotlight.x = hearts.pos[0] + 80
                    spotlight.y = hearts.pos[1] + 25;
                    spotlight.radius = 1;
                    spotlight.maxRadius = 80;
                    modaltext.step = step;
                    break;
                case "end":
                    debugger;
                    spotlight.x = kirby.pos[0] + kirby.sprite.size[0] / 2;
                    spotlight.y = kirby.pos[1] + kirby.sprite.size[1] / 2;
                    spotlight.radius = 1;
                    spotlight.maxRadius = 80;
                    modaltext.step = score.score === endGameScore ? "win" : "lose";
                    kirby.sprite = score.score === endGameScore ? kirbyWinSprite() : kirbyLoseSprite();
                    readyButton.flipped = false;
                    setTimeout(kirby.sprite.sound, 1000)
                    break;
            }
            change = false;
        }
    }
    updateTutorial(dt);
    renderTutorial(dt);
    requestAnimFrame(tutorialLoop);
}

let updateTutorial = (dt) => {
    gameTime += dt;
    updateSprites(dt)
    spotlight.update(dt)
    Object.keys(buttons).forEach(key => {
        buttons[key].update(dt)
    })
};

let renderTutorial = () => {
    modalCtx.clearRect(0, 0, canvas.width, canvas.height);
    mouse.render(modalCtx);
    modalCtx.globalAlpha = 0.9;
    modalCtx.fillStyle = "#000000";
    modalCtx.fillRect(0, 0, canvas.width, canvas.height);
    render()
    if(step !== 0) spotlight.render(modalCtx, modalCanvas);
    modaltext.render(modalCtx);
    if (step === 0){
        Object.keys(buttons).forEach(key => {
            buttons[key].render(modalCtx);
        })
    }
    if (step === "end"){
        readyButton.render(modalCtx);
    }
};