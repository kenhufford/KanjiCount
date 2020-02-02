// let lesson = new Lesson("cantonese", canvas, ctx);
// let game = new Game("cantonese", canvas, ctx);
// let kirbyLink = document.querySelector("#kirbylink");
// let lessonsLink = document.querySelector("#lessonlink")
// let gameSelected;
// resources.loadSelector(images);

// kirbyLink.addEventListener('click', () => {
//     // tutorial = true;
//     lesson.complete = true;
//     gameSelected = true;
//     if (resources.isReady()) {
//        resetGame();
//        init();
//     };

// })

// lessonsLink.addEventListener('click', () => {
//     canvas.classList.add('front-canvas');
//     canvas.classList.remove('back-canvas');
//     modalCanvas.classList.add('back-canvas');
//     modalCanvas.classList.remove('front-canvas');
//     tutorial = false;
//     gameSelected = false;
//     isGameOver = true;
//     let lesson = new Lesson(language, canvas, ctx);
//     if (resources.isReady()) lesson.lessonLoop();
// })

// let resetGame = () => {
//     step = 0;
//     modaltext.step = step;
    // difficulty = "medium";
    // language = "cantonese";
    // tutorial = true;
    // isGameOver = false;
    // isGameEnding = false;
    // isGameStart = false;
    // score.gameEnd = false;
    // orderIndex = 0;
    // sushiIndex = 0;
    // sushiId = 1;
    // gameTime = 0;
    // sushis = {};
    // answers = {};
    // orders = [];
    // orderPositions = [];
    // sushiShelf;
    // endGameScore = 10;
    // kirby.sprite = kirbyIdleSprite();
    // score.reset(gameModes[difficult].startScore)
    // tutorialToggle = true;
    // tutorialMusicButton.flipped = ingameMusicButton.flipped;
    // readyButton.flipped = false;
    // languageButton.flipped = false;
    // difficultyButton.flipped = false;
    // tutorialButton.flipped = false;
    // orderNumEasy = Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1));
    // orderNumMed = Array.from(Array(100).keys()).sort((a, b) => (0.5 - Math.random() * 1));
    // orderNumHard = Array.from(Array(1000).keys()).sort((a, b) => (0.5 - Math.random() * 1));
    
}

// let init = () => {
    // now = Date.now();
    // dt = (now - lastTime) / 1000.0;
    // lastTime = now;
    // generateOrderPositions(4, 140, 10)
    // generateOrder(0);
    // generateOrder(1);
    // let sushi = generateSushi()
    // sushis[sushi.id] = sushi;
//     sushiCooldown = 2.5;
//     debugger
//     update(dt);
//     render();
//     if (tutorial){
//         canvas.classList.remove('front-canvas');
//         canvas.classList.add('back-canvas');
//         modalCanvas.classList.remove('back-canvas');
//         modalCanvas.classList.add('front-canvas');
//         tutorialLoop()
//     } else {
//         orderCooldown = gameModes[difficulty].orderCooldown;
//         orderTime = gameModes[difficulty].orderTime;
//         gameLoop();
//     }
// }



// canvas.addEventListener('click', (e) => {
//     e.preventDefault();
//     if (tutorial) return null
//     let pos = getMousePosition(e);
//     mouse.closed = !mouse.closed;
//     Object.keys(sushis).forEach((id) => {
//         if (mouse.closed && sushis[id].clickInside(pos)) {//grabbed sushi with chops
//             playSound('pickupsushi')
//             sushis[id].grabbed = true;
//             sushis[id].dropped = false;
//         } else if (!mouse.closed && sushis[id].clickInside(pos)){
//             if (sushis[id].nearby(kirby.pos, 100)){
//                 feedKirby(sushis[id]);
//             } else {
//                 sushis[id].grabbed = false;
//                 sushis[id].dropped = true;    
//             }
//         }
//     });
//     orders.forEach (order => {
//         if (order.withinBox(pos)) {
//             if (soundCooldown < 0) {
//                 playNumberSound(order.number, language)
//                 soundCooldown = 3;
//             }
            
//         }
//     })
//     if (ingameMusicButton.inside(pos)){
//         ingameMusicButton.flipped = !ingameMusicButton.flipped;
//         music.play();
//     }
// })


//helper functions
// let randomIndex = (array) => Math.floor(Math.random() * array.length)

// let generateRandomNumber = (type) => {
//     if (type === "sushi"){
//         sushiShelf= gameModes[difficulty].sushiShelf;
//         if (sushiIndex === sushiShelf.length-1) {
//             sushiShelf.sort((a, b) => (0.5 - Math.random() * 1));
//             sushiIndex = 0;
//         }
//         sushiIndex += 1;
//         return sushiShelf[sushiIndex];
      
//     } else {
//         if (orderIndex === orderNumEasy.length-1){
//             orderNumEasy.sort((a, b) => (0.5 - Math.random() * 1));
//             orderIndex = 0;
//         }
        
//         orderIndex += 1;
//         if (difficulty==="easy"){
//             return orderNumEasy[orderIndex];
//         } else if (difficulty==="medium"){
//             return orderIndex % 2 === 0 ? orderNumEasy[orderIndex] : orderNumMed[orderIndex];
//         } else if (difficulty === "hard") {
//             return orderIndex % 2 === 0 ? orderNumMed[orderIndex] : orderNumHard[orderIndex];
//         }
//     }
// }

// let generateOrderPositions = (numPos, x, y) =>{
//     for (let i = 0; i < numPos; i++){
//         orderPositions.push([i*x + 400, y])
//     }
// }

//game helper functions

// let generateOrder = (index) => {
//     if (orders.length >= 3) return null
//     shiftOrders();
//     let randNum = generateRandomNumber("order");
//     while (randNum < 11 && index === 0){
//         randNum = generateRandomNumber("order");
//     }
//     let characters = convertToKanji(convertNumberToArray(randNum));
//     let order = new Order(
//         index,
//         characters,
//         randNum,
//         orderTime,
//         orderPositions[index]
//     );
    
//     orders.push(order);
//     if (index > 1) playNumberSound(randNum, language)
// }

// let shiftOrders = () => {
//     orders.forEach((order, i) => {
//         order.pos = orderPositions[i];
//         order.index = i;
//     });
// }



// let feedKirby = (sushi) => {
//     wind.sprite = windSprite();
//     wind.sprite.sound();
//     kirby.sprite = kirbyOpeningSprite();
//     sushi.vector = sushi.findNormalizedVector(sushi.pos, kirby.pos)
//     sushi.flying = true;
//     sushi.grabbed = false;
//     sushi.dropped = false;
// }

// let kirbySucks = () => {
//     kirby.sprite = kirbyOpeningSprite();
//     wind.sprite = windSprite();
//     wind.sprite.sound();
// }


// let completeOrder = (order, success) => {
//     if (success){
//         if (order.charsArray.length !==1){
//             score.update(1);
//             order.sushis.forEach(sushi => {
//                 sushis[sushi.id] = sushi;
//                 feedKirby(sushi)
//             }) 
//         } else {
//             kirbyMood = "happy";
//             score.update(1);
//         }
//     } else if (!success){
//         score.update(-1);
//         kirby.sprite = kirbySadSprite();
//         kirby.sprite.sound();
//     }
//     orders.splice(order.index, 1);
//     shiftOrders();
// }

//game functions


// let render = () => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
//     gradient.addColorStop(0, '#fdd13e');
//     gradient.addColorStop(1 / 2, '#fdd13e');
//     gradient.addColorStop(2 / 2, '#fdd13e');
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     renderSprite(norin);
//     ingameMusicButton.render(ctx)

//     orders.forEach(order => {
//         renderStatic(order);
//     })

//     Object.keys(entities).forEach(key => {
//         renderSprite(entities[key]);
//     })

//     Object.keys(sushis).forEach((id) => {
//         renderStatic(sushis[id]);
//     })

//     mouse.render(ctx);

// };


// let renderSprite = (entity) => {
//     ctx.save();
//     ctx.translate(entity.pos[0], entity.pos[1]);
    
//     if (entity.sprite.render(ctx)){
//         let sprite = entity.defaultSprite();
//         entity.sprite = sprite;
//     };
//     ctx.restore();
// }

// let renderStatic = (entity) => {
//     ctx.save();
//     ctx.translate(entity.pos[0], entity.pos[1]);
//     entity.render(ctx);
//     ctx.restore();
// }

// let gameLoop = () => {
//     if (isGameOver) return null
//     let now = Date.now();
//     let dt = (now - lastTime) / 1000.0;
//     lastTime = now;
//     update(dt);
//     render();
//     if (step !== "end") requestAnimFrame(gameLoop);
// };

// let update = (dt) => {
//     if ((score.score === 0 || score.score === endGameScore )&& !isGameEnding) endGame();
//     gameTime += dt;
//     updateCooldowns(dt);
//     updateEntities(dt);
//     ingameMusicButton.update(dt);
// };

// let updateEntities = (dt) => {
//     updateOrders(dt);
//     updateSprites(dt);
//     updateSushis(dt);
// }

// let updateCooldowns = (dt) => {
//     orderCooldown -= dt;
//     sushiCooldown -= dt;
//     soundCooldown -= dt;
//     windCooldown -= dt;
// }

// let updateOrders = (dt) => {
//     if (orderCooldown < 0) {
//         orderCooldown = 5;
//         generateOrder(orders.length);
//     }
//     orders.forEach( (order, i) => {
//         order.update(dt)
//         if (order.timeUp()){
//             completeOrder(order, false);
//         } else if (order.ready()) {
//             setTimeout(completeOrder(order, true), 2000)
//         }
//     })
// }

// let updateSprites = (dt) => {
//     Object.keys(entities).forEach(key => {
//         entities[key].sprite.update(dt);
//     })
// }

// let updateSushis = (dt) => {
//     sushiCooldown -= dt;
//     if (sushiCooldown < 0) {
//         sushiCooldown = 2.5;
//         let sushi = generateSushi()
//         sushis[sushi.id] = sushi;
//     }

//     Object.keys(sushis).forEach((id) => {
//         let sushi = sushis[id];
//         sushi.update(dt, 8, [mouse.x, mouse.y])
//         if (sushi.flying){
//             if (sushi.nearby(kirby.pos, 30)){
//                 if(!sushi.hit){
//                     kirbyEats(sushi);
//                 } else if (isGameEnding){
//                     if (score.score < endGameScore) {
//                         sushi.hit = true;
//                         sushi.flying = true;
//                         sushi.vector = sushi.findNormalizedVector(sushi.pos, chef.pos)
//                     } else {
//                         kirbyEats(sushi);
//                     }
//                 }
//             } else if (sushi.nearby(chef.pos, 30)) {
//                 sushi.dropped = true;
//                 sushi.flying = false;
//                 chef.sprite = chefHurtSprite();
//             }
//         } else if (sushi.offConveyor()) {
//             delete sushis[sushi.id];
//         } else if (sushi.grabbed) {
//             orders.forEach(order => {
//                 if (order.within(sushi.pos)
//                     && order.charsArray.includes(sushi.character)
//                     && order.charsArray.length !== 1) {
//                     order.addSushi(sushi);
//                     delete sushis[sushi.id]
//                 }
//             })
//         }
//     })
// }



// let endGame = () => {
//     score.gameEnd = true;
//     if (score.score === 0 && !isGameEnding) {
//         isGameEnding = true;
//         kirby.sprite = kirbyCombo();
//         kirby.sprite.sound();
//         let spit = setInterval(() => {
//             let sushi = generateSushi(true);
//             sushi.grabbed = false;
//             sushi.dropped = false;
//             sushi.plated = false;
//             sushi.hit = true;
//             sushi.flying = true;
//             sushi.speed = 20;
//             sushis[sushi.id] = sushi;
//         }, 300);
//         spit;
//         setTimeout(() => {
//             clearInterval(spit);
//             switchToGameOver();
//             tutorialLoop();
//         }, 2000)
//     } else if (!isGameEnding) {
//         isGameEnding = true;
//         kirbySucks();
//         Object.keys(sushis).forEach(id => {
//             let sushi = sushis[id];
//             sushi.grabbed = false;
//             sushi.dropped = false;
//             sushi.plated = false;
//             sushi.hit = false;
//             sushi.flying = true;
//             sushi.vector = sushi.findNormalizedVector(sushi.pos, kirby.pos)
//         })
//         setTimeout(() => { 
//             switchToGameOver();
//             tutorialLoop();
//         }, 2000)
//     }
// }

// let switchToGameOver = () => {
//     canvas.classList.remove('front-canvas');
//     canvas.classList.add('back-canvas');
//     modalCanvas.classList.remove('back-canvas');
//     modalCanvas.classList.add('front-canvas');
//     isGameOver = true;
//     tutorial = true;
//     step = "end";
//     change = true;
// }


