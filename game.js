
let lesson = new Lesson("cantonese", canvas, ctx);
let kirbyLink = document.querySelector("#kirbylink");
let lessonsLink = document.querySelector("#lessonlink")
let gameSelected;
resources.loadSelector(images);

kirbyLink.addEventListener('click', () => {
    tutorial = false;
    lesson.complete = true;
    gameSelected = true;
    if (resources.isReady()) resetGame();
})

lessonsLink.addEventListener('click', () => {
    canvas.classList.add('front-canvas');
    canvas.classList.remove('back-canvas');
    modalCanvas.classList.add('back-canvas');
    modalCanvas.classList.remove('front-canvas');
    lesson.complete = false;
    gameSelected = false;
    isGameOver = true;
    if (resources.isReady()) lesson.lessonLoop();
})

let resetGame = () => {
    step = 0;
    modaltext.step = step;
    mode = "medium";
    language = "cantonese";
    tutorial = true;
    isGameOver = false;
    isGameEnding = false;
    isGameStart = false;
    score.gameEnd = false;
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
    score.reset(gameModes[mode].startScore)
    tutorialToggle = true;
    tutorialMusicButton.flipped = ingameMusicButton.flipped;
    readyButton.flipped = false;
    languageButton.flipped = false;
    difficultyButton.flipped = false;
    tutorialButton.flipped = false;
    orderNumEasy = Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1));
    orderNumMed = Array.from(Array(100).keys()).sort((a, b) => (0.5 - Math.random() * 1));
    orderNumHard = Array.from(Array(1000).keys()).sort((a, b) => (0.5 - Math.random() * 1));
    init();
}

let init = () => {
    if(!gameSelected) return null;
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


modalCanvas.addEventListener('click', (e) =>{
    e.preventDefault();
    if (!tutorial) return null
    mouse.closed = !mouse.closed;
    let pos = getMousePosition(e);
    
    if (step === "end" && readyButton.inside(pos)) {
        console.log(ingameMusicButton.flipped)
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
            console.log(mode);
        } else if (languageButton.inside(pos)){
            languageButton.flipped = !languageButton.flipped;
            language = language === "cantonese" ? "japanese" : "cantonese";
        } else if (tutorialMusicButton.inside(pos)){
            tutorialMusicButton.flipped = !tutorialMusicButton.flipped;
            music.play();
        }
    } else if (step !=="end") {
        step += 1;
        change = true;
    }
    if (step > 6){
        tutorial = false;
        isGameStart = true;
        ingameMusicButton.flipped = tutorialMusicButton.flipped;
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
    if (index > 1) playNumberSound(randNum, language)
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
    if (isGameOver) return null
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    lastTime = now;
    update(dt);
    render();
    if (step !== "end") requestAnimFrame(gameLoop);
};

let update = (dt) => {
    if ((score.score === 0 || score.score === endGameScore )&& !isGameEnding) endGame();
    gameTime += dt;
    updateCooldowns(dt);
    updateEntities(dt);
    ingameMusicButton.update(dt);
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