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
let sushiID = 1;
let gameTime = 0;
let sushis = {};
let answers = {};
let orders = [];
let orderPositions = [];
let sushiCooldown = 2;
let orderCooldown = 10;
let endGameScore = 10;
let newGameScore = 2;
let isGameOver = false;
let isGameEnding = false;
let language = 'cantonese';
let lastTime = Date.now();
let orderShelf = Array.from(Array(11).keys());
let sushiShelf = Array.from(Array(11).keys()).concat(Array.from(Array(11).keys()))

function reset(){
    sushiID = 1;
    gameTime = 0;
    sushis = {};
    answers = {};
    orders = [];
    orderPositions = [];
    sushiCooldown = 2;
    orderCooldown = 10;
    endGameScore = 10;
    newGameScore = 2;
    isGameOver = false;
    isGameEnding = false;
    language = 'cantonese';
    lastTime = Date.now();
    orderShelf = Array.from(Array(11).keys());
    sushiShelf = Array.from(Array(11).keys()).concat(Array.from(Array(11).keys()))
}

//sprite and entity setup
let conveyorSprite = new Sprite("https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png", [0, 0], [605, 60], 4, [0, 1, 2, 3], 'vertical', false);
let conveyorSprite2 = new Sprite("https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png", [0, 0], [605, 60], 4, [3, 2, 1, 0], 'vertical', false);
let kirbySpriteURL = 'https://i.imgur.com/Csvj6I1.png'
let kirbyOpeningSprite = () => new Sprite(kirbySpriteURL, [0, 0], [75, 75], 0.5, [0, 1, 2, 2, 2], "horizontal", true)
let kirbyClosingSprite = () => new Sprite(kirbySpriteURL, [150, 0], [75, 75], 0.5, [2, 3, 4], "horizontal", true)
let kirbyIdleSprite = () => new Sprite(kirbySpriteURL, [0, 75], [75, 75], 10, Array.from(Array(34).keys()), "horizontal", false)
let kirbySadSprite = () => new Sprite(kirbySpriteURL, [0, 150], [75, 75], 0.5, [0, 1, 2], "horizontal", true)
let kirbyHappySprite = () => new Sprite(kirbySpriteURL, [0, 225], [75, 75], 0.5, [0, 1], "horizontal", true)
let kirbyAttackFwd = () => new Sprite(kirbySpriteURL, [0, 600], [150, 75], 20, [0, 1, 2, 3], "horizontal", true)
let kirbyAttackDown = () => new Sprite(kirbySpriteURL, [0, 900], [150, 150], 20, [0, 1, 2, 3, 4, 5], "horizontal", true)
let kirbyAttackUp = () => new Sprite(kirbySpriteURL, [0, 1050], [150, 150], 20, [0, 1, 2, 3, 4], "horizontal", true)
let chefSprite = () => new Sprite(kirbySpriteURL, [0, 525], [150, 75], 3.2, [0, 1, 2, 3], "horizontal", false)
let chefHurtSprite = () => new Sprite(kirbySpriteURL, [0, 750], [105, 105], 12, Array.from(Array(8).keys()), "horizontal", true)
let windSprite = () => new Sprite(kirbySpriteURL, [0, 1200], [225, 225], 25, Array.from(Array(11).keys()), "horizontal", true);
let noWindSprite = () => new Sprite(kirbySpriteURL, [0, 0], [0, 0], 0, Array.from(Array(1).keys()), "horizontal", false);
let conveyor = new Entity([150, 350], conveyorSprite, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
let conveyor2 = new Entity([110, 500], conveyorSprite2, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
let kirby = new Entity([50, 200], kirbyIdleSprite(), kirbySpriteURL, kirbyIdleSprite)
let chef = new Entity([750, 310], chefSprite(), kirbySpriteURL, chefSprite)
let wind = new Entity([90, 110], noWindSprite(), kirbySpriteURL, noWindSprite)
let score = new Score(newGameScore, [600,10], endGameScore)
let mouse = new Mouse(false, 0, 0, mouseImages[0], mouseImages[1])

let attackSprites = [
    { sprite: kirbyAttackDown, vector: [0, -1] }, { sprite: kirbyAttackUp, vector: [0, 1] }, { sprite: kirbyAttackFwd, vector: "find" }
];
let entities = {
    kirby, conveyor, conveyor2, chef, wind
};

let init = () => {
    lastTime = Date.now();
    gameLoop();
    generateOrderPositions(8, 120, 10)
    setTimeout(() => {
        sushis[1] = generateSushi();
        generateOrder(0);
    }, 1000);
}

resources.loadSelector(images);
resources.onReady(init);


canvas.addEventListener('click', (e) => {
    e.preventDefault();
    let pos = getMousePosition(e);
    mouse.closed = !mouse.closed;
    Object.keys(sushis).forEach((id) => {
        // if (sushis[id].hit) return null
        if (mouse.closed && sushis[id].clickInside(pos)) {//grabbed sushi with chops
            sushis[id].grabbed = true;
            sushis[id].dropped = false;
        } else if (!mouse.closed && sushis[id].clickInside(pos)){
            if (sushis[id].nearby(kirby.pos, 250)){
                wind.sprite = windSprite();
                sushis[id].flying = true;
                sushis[id].vector = sushis[id].findNormalizedVector(pos, kirby.pos)
                sushis[id].grabbed = false;
                sushis[id].dropped = false; 
                kirby.sprite = kirbyOpeningSprite();
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
        orderPositions.push([i*x + 10, y])
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
    mouse.update(pos[0], pos[1])
}

//game helper functions

let generateOrder = (index) => {
    if (orders.length >= 4) return null
    shiftOrders();
    let randNum = generateRandomNumber("order");
    let order = new Order(
        kanjiArray[randNum],
        randNum,
        20,
        orderPositions[index]
    );
    orders.push(order);
    playSound(randNum, language)
}

let shiftOrders = () => {
    orders.forEach((order, i) => {
        order.pos = orderPositions[i];
    });
}

let generateSushi = (end) => {
    let startPos = [700, 320];
    if (end) {
        startPos = [...kirby.pos];
    }
    let randSushiUrl = sushiUrls[Math.floor(Math.random() * sushiUrls.length)];
    let randSushiNum = generateRandomNumber("sushi");
    let randSushiChar = kanjiArray[randSushiNum];
    let sushi = new Sushi(sushiID, startPos, randSushiUrl, randSushiChar, randSushiNum) //700, 370 start, 130 end
    sushiID++;
    return sushi
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
        updateEntities(dt);
    }
};

let updateEntities = (dt) => {
    updateOrders(dt);
    updateSprites(dt);
    updateSushis(dt);
}

let updateOrders = (dt) => {
    let removeOrderIndex= -1;
    orderCooldown -= dt;
    if (orderCooldown < 0) {
        orderCooldown = 15;
        generateOrder(orders.length);
    }
    orders.forEach( (order, i) => {
        order.update(dt)
        if (order.timeUp()){
            score.update(-1);
            if (score.score === 0) endGame();
            orderShelf.push(order.number)
            removeOrderIndex = i;
            kirby.sprite = kirbySadSprite();
        }
    })
    if (removeOrderIndex!== -1){
        orderShelf.push(orders[removeOrderIndex].number)
        orders.splice(removeOrderIndex, 1);
        shiftOrders();
    } 
}

let updateSprites = (dt) => {
    Object.keys(entities).forEach(key => {
        entities[key].sprite.update(dt);
    })
}

let updateSushis = (dt) => {
    sushiCooldown -= dt;
    if (sushiCooldown < 0) {
        sushiCooldown = 1.5;
        let sushi = generateSushi()
        sushis[sushi.id] = sushi;
    }

    Object.keys(sushis).forEach((id) => {
        sushis[id].update(dt, 8, [mouse.x, mouse.y])
        if (sushis[id].nearby(kirby.pos, 30)) {
            if (sushis[id].match(orders) !== -1 && !sushis[id].hit && 
                (!isGameEnding || score.score >= endGameScore)) {
                score.update(1);
                if (score.score >= endGameScore) endGame();
                sushiShelf.push(sushis[id].number)
                orderShelf.push(orders[sushis[id].match(orders)].number)
                kirby.sprite = kirbyHappySprite();
                orders.splice(sushis[id].match(orders), 1);
                shiftOrders();
                generateOrder(orders.length);
                delete sushis[id];
            } else if (!sushis[id].hit) {
                if (isGameEnding && score.score < endGameScore){
                    sushis[id].hit = true;
                    let attack = attackSprites[2]
                    sushis[id].vector = sushis[id].findNormalizedVector(sushis[id].pos, chef.pos)
                    kirby.sprite = attack.sprite();
                } else if (isGameEnding && score.score >= endGameScore){
                    kirby.sprite = kirbyOpeningSprite();
                    orders.splice(sushis[id].match(orders), 1);
                } else {
                    score.update(-1);
                    if (score.score === 0) endGame();
                    sushiShelf.push(sushis[id].number)
                    sushis[id].hit = true;
                    let attack = attackSprites[randomIndex(attackSprites)]
                    if (attack.vector !== "find") {
                        sushis[id].vector = attack.vector;
                    } else {
                        sushis[id].vector = sushis[id].findNormalizedVector(sushis[id].pos, chef.pos)
                    }
                    kirby.sprite = attack.sprite();
                }
            }
        } else if (sushis[id].nearby(chef.pos, 30)) {
            sushis[id].dropped = true;
            sushis[id].flying = false;
            chef.sprite = chefHurtSprite();
        } else if (sushis[id].offConveyor()) {
            sushiShelf.push(sushis[id].number);
            delete sushis[id];
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
        wind.sprite = windSprite();
        kirby.sprite = kirbyOpeningSprite();
        Object.keys(sushis).forEach(id => {
            sushis[id].grabbed = false;
            sushis[id].dropped = false;
            sushis[id].flying = true;
            sushis[id].vector = sushis[id].findNormalizedVector(sushis[id].pos, kirby.pos)
        })
        setTimeout(() => isGameOver = true, 2000)
    }
}
