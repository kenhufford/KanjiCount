let canvas = document.querySelector("#myCanvas")
let ctx = canvas.getContext("2d");
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
        orderShelf: Array.from(Array(11).keys()),
        sushiShelf: Array.from(Array(11).keys()).concat(Array.from(Array(11).keys())),
        orderTime: 25,
        orderCooldown: 20
    },
    medium: {
        orderShelf: Array.from(Array(100).keys()),
        sushiShelf: Array.from(Array(11).keys()).concat([10, 10]),
        orderTime: 25,
        orderCooldown: 25
    },
    hard: {
        orderShelf: Array.from(Array(1000).keys()),
        sushiShelf: Array.from(Array(11).keys()).concat([10, 10, 10, 10, 100, 100, 100, 100]),
        orderTime: 25,
        orderCooldown: 30
    }
}
let mode = "medium";
let sushiID = 1;
let gameTime = 0;
let sushis = {};
let answers = {};
let orders = [];
let orderPositions = [];
let sushiCooldown = 2.5;
let soundCooldown = 1;
let endGameScore = 4;
let newGameScore = 2;
let isGameOver = false;
let isGameEnding = false;
let language = 'cantonese';
let lastTime = Date.now();
let orderCooldown = gameModes[mode].orderCooldown;
let orderShelf = gameModes[mode].orderShelf;
let sushiShelf = gameModes[mode].sushiShelf;
let orderTime = gameModes[mode].orderTime;

function reset(){
    sushiID = 1;
    gameTime = 0;
    sushis = {};
    answers = {};
    orders = [];
    orderPositions = [];
    sushiCooldown = 2.5;
    orderCooldown = 10;
    soundCooldown = 1;
    endGameScore = 10;
    newGameScore = 2;
    isGameOver = false;
    isGameEnding = false;
    language = 'cantonese';
    lastTime = Date.now();
    orderShelf = Array.from(Array(11).keys());
    sushiShelf = Array.from(Array(20).keys());
}

//sprite and entity setup
let conveyorSprite = new Sprite("https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png", [0, 0], [605, 60], 4, [0, 1, 2, 3], 'vertical', false);
let conveyorSprite2 = new Sprite("https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png", [0, 0], [605, 60], 4, [3, 2, 1, 0], 'vertical', false);
let kirbySpriteURL = 'https://i.imgur.com/Csvj6I1.png'
let kirbyOpeningSprite = () => new Sprite(kirbySpriteURL, [0, 0], [75, 75], 0.5, [0, 1, 2, 2, 2], "horizontal", true);
let kirbyClosingSprite = () => new Sprite(kirbySpriteURL, [150, 0], [75, 75], 0.5, [2, 3, 4], "horizontal", true)
let kirbyIdleSprite = () => new Sprite(kirbySpriteURL, [0, 75], [75, 75], 10, Array.from(Array(34).keys()), "horizontal", false)
let kirbySadSprite = () => new Sprite(kirbySpriteURL, [0, 150], [75, 75], 0.5, [0, 1, 2], "horizontal", true, () => playSound('disappointed'))
let kirbyHappySprite = () => new Sprite(kirbySpriteURL, [0, 225], [75, 75], 0.5, [0, 1], "horizontal", true, () => playSound('haumph'))
let kirbyAttackFwd = () => new Sprite(kirbySpriteURL, [0, 600], [150, 75], 20, [0, 1, 2, 3], "horizontal", true, () => playSound('attackfwd'))
let kirbyAttackDown = () => new Sprite(kirbySpriteURL, [0, 900], [150, 150], 20, [0, 1, 2, 3, 4, 5], "horizontal", true, () => playSound('attackdown'))
let kirbyAttackUp = () => new Sprite(kirbySpriteURL, [0, 1050], [150, 150], 20, [0, 1, 2, 3, 4], "horizontal", true, () => playSound('attackup'))
let chefSprite = () => new Sprite(kirbySpriteURL, [0, 525], [150, 75], 3.2, [0, 1, 2, 3], "horizontal", false)
let chefHurtSprite = () => new Sprite(kirbySpriteURL, [0, 750], [105, 105], 12, Array.from(Array(8).keys()), "horizontal", true)
let windSprite = () => new Sprite(kirbySpriteURL, [0, 1200], [225, 225], 25, Array.from(Array(11).keys()), "horizontal", true, () => playSound('suck'));
let noWindSprite = () => new Sprite(kirbySpriteURL, [0, 0], [0, 0], 0, Array.from(Array(1).keys()), "horizontal", false);
let conveyor = new Entity([150, 350], conveyorSprite, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
let conveyor2 = new Entity([110, 500], conveyorSprite2, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
let kirby = new Entity([50, 200], kirbyIdleSprite(), kirbySpriteURL, kirbyIdleSprite)
let chef = new Entity([750, 310], chefSprite(), kirbySpriteURL, chefSprite)
let wind = new Entity([90, 110], noWindSprite(), kirbySpriteURL, noWindSprite)
let score = new Score(newGameScore, [10,10], endGameScore)
let mouse = new Mouse(false, 0, 0, mouseImages[0], mouseImages[1])

let attackSprites = [
    { sprite: kirbyAttackDown, vector: [0, -1], sound: (() => playSound('attackdown')) }, 
    { sprite: kirbyAttackUp, vector: [0, 1], sound: (() => playSound('attackup')) }, 
    { sprite: kirbyAttackFwd, vector: "find", sound: (() => playSound('attackfwd'))}
];
let entities = {
    kirby, conveyor, conveyor2, chef, wind
};

let init = () => {
    lastTime = Date.now();
    gameLoop();
    generateOrderPositions(4, 120, 10)
    generateOrder(0);
}

resources.loadSelector(images);
resources.onReady(init);



canvas.addEventListener('click', (e) => {
    e.preventDefault();
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
})


//helper functions
let randomIndex = (array) => Math.floor(Math.random() * array.length)

let generateRandomNumber = (type) => {
    if (type === "sushi"){
        sushiShelf.sort((a,b)=> (0.5 - Math.random() * 1))
        return sushiShelf.shift();
    } else {
        orderShelf.sort((a, b) => (0.5 - Math.random() * 1))
        return orderShelf.shift();   
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
    let pos = getMousePosition(e);
    orders.forEach( order => {
        if (order.within(pos)){
            if (soundCooldown < 0){
                playSound(order.number, language)
            }
            soundCooldown = 1;
        }
    })
    mouse.update(pos[0], pos[1])
}

//game helper functions

let generateOrder = (index) => {
    if (orders.length >= 4) return null
    shiftOrders();
    let randNum = generateRandomNumber("order");
    let characters = convertToKanji(convertNumberToArray(randNum));
    let order = new Order(
        index,
        characters,
        randNum,
        orderTime,
        orderPositions[index]
    );
    
    orders.push(order);
    playSound(randNum, language)
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
    sushi.plated = false;
}

let kirbyEats = (sushi) => {
    kirby.sprite = kirbyHappySprite();
    kirby.sprite.sound();
    sushiShelf.push(sushi.number)
    delete sushis[sushi.id];
}

let completeOrder = (order) => {
    
    orderShelf.push(order.number)
    orders.splice(order.index, 1);
    shiftOrders();
    generateOrder(orders.length);
}

//game functions


let render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fdd13e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";

    orders.forEach(order => {
        renderStatic(order);
    })

    Object.keys(entities).forEach(key => {
        renderSprite(entities[key]);
    })
    mouse.render(ctx);

    Object.keys(sushis).forEach((id) => {
        renderStatic(sushis[id]);
    })

    renderStatic(score);
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
    requestAnimFrame(gameLoop);
};

let update = (dt) => {
    if(!isGameOver){
        gameTime += dt;
        updateCooldowns(dt)
        updateEntities(dt);
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
}

let updateOrders = (dt) => {
    if (orderCooldown < 0) {
        orderCooldown = 15;
        generateOrder(orders.length);
    }
    orders.forEach( (order, i) => {
        order.update(dt)
        if (order.timeUp()){
            score.update(-1);
            if (score.score === 0) endGame();
            kirby.sprite = kirbySadSprite();
            kirby.sprite.sound();
            completeOrder(order);
        } else if (order.ready()) {
            score.update(1);
            if (score.score >= endGameScore) endGame();
            order.sushis.forEach(sushi => {
                sushis[sushi.id] = sushi;
                feedKirby(sushi)
            })
            completeOrder(order);  
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
                kirbyEats(sushi);
            } else if(sushi.nearby(chef.pos, 30)){
                sushi.dropped = true;
                sushi.flying = false;
                chef.sprite = chefHurtSprite();
            } else if (isGameEnding){
                if (sushi.nearby(kirby.pos, 30)){
                    if (score.score < endGameScore) {
                        sushi.hit = true;
                        let attack = attackSprites[2]
                        sushi.vector = sushi.findNormalizedVector(sushi.pos, chef.pos)
                        kirby.sprite = attack.sprite();
                        kirby.sprite.sound();
                    } 
                }
            }
        } else if (sushi.offConveyor()) {
            sushiShelf.push(sushi.number);
            delete sushis[sushi.id];
        } else if (sushi.grabbed) {
            orders.forEach(order => {
                if (order.within(sushi.pos)
                    && order.charsArray.includes(sushi.character)
                    && !order.collectedChars.includes(sushi.character)) {
                    order.addSushi(sushi);
                    console.log(order.ready())
                    console.log(order.character)
                    sushiShelf.push(sushi.number);
                    delete sushis[sushi.id]
                }
            })
        }
    })
}


let endGame = () => {
    if (score.score === 0 && !isGameEnding) {
        let spit = setInterval(() => {
            isGameEnding = true;
            let sushi = generateSushi(true);
            sushi.grabbed = false;
            sushi.dropped = false;
            sushi.flying = true;
            sushi.speed = 20;
            sushis[sushi.id] = sushi;
        }, 200);
        spit;
        setTimeout(() => {
            clearInterval(spit);
            isGameOver = true;
        }, 2000)
    } else if (!isGameEnding) {
        isGameEnding = true;
        kirby.sprite = kirbyOpeningSprite();
        wind.sprite = windSprite();
        wind.sprite.sound();
        Object.keys(sushis).forEach(id => {
            let sushi = sushis[id];
            sushi.grabbed = false;
            sushi.dropped = false;
            sushi.flying = true;
            sushi.vector = sushi.findNormalizedVector(sushi.pos, kirby.pos)
        })
        setTimeout(() => isGameOver = true, 2000)
    }
}
