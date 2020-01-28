let canvas = document.querySelector("#myCanvas")
let ctx = canvas.getContext("2d");
let resources = new Resources();
let characters = []
resources.loadSelector(images);
resources.onReady(init);

function init() {
    lastTime = Date.now();
    main();
}

let gameTime = 0;
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

let conveyorSprite = new Sprite("https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png", [0, 0], [605, 60], 4, [0, 1, 2, 3], 'vertical', false);
let conveyor = new EntitySprite([150, 400], conveyorSprite,"https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
let kirbyOpeningSprite = () => new Sprite("https://i.imgur.com/eIrsFm5.png", [0,0],[75, 75], 0.5, [0, 1, 2, 2, 2] , "horizontal", true)
let kirbyClosingSprite = () =>  new Sprite("https://i.imgur.com/eIrsFm5.png", [150,0],[75,75], 0.5, [2, 3, 4] , "horizontal", true)
let kirbyIdleSprite = () => new Sprite("https://i.imgur.com/eIrsFm5.png", [0,75],[75,75], 1, [0, 1] , "horizontal", false)
let kirbySadSprite = () =>  new Sprite("https://i.imgur.com/eIrsFm5.png", [0,150],[75,75], 0.5, [0, 1, 2] , "horizontal", true)
let kirbyHappySprite = () =>  new Sprite("https://i.imgur.com/eIrsFm5.png", [0,225],[75,75], 0.5, [0, 1] , "horizontal", true)
let kirby = new EntitySprite([100, 200], kirbyIdleSprite(), "https://i.imgur.com/eIrsFm5.png", kirbyIdleSprite)

let entities = {
    kirby, conveyor
}
let sushiID = 1;
let sushis = {};
sushis[1] = createSushi()

function createSushi(){
    let randSushiUrl = sushiUrls[Math.floor(Math.random() * sushiUrls.length)];
    let kanjiArray = Object.values(kanji)
    let randSushiChar = kanjiArray[Math.floor(Math.random() * kanjiArray.length)];
    let sushi = new Sushi(sushiID, [700, 370], randSushiUrl, randSushiChar) //700, 370 start, 130 end
    sushiID++;
    return sushi
}
let mouse = new Mouse(false, 0, 0, mouseImages[0], mouseImages[1])

let getMousePosition = (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    return [x,y]
}

canvas.onmousemove = function(e){
    let pos = getMousePosition(e);
    mouse.update(pos[0], pos[1])
}

canvas.addEventListener('click', (e) => {
    e.preventDefault();
    let pos = getMousePosition(e);
    mouse.closed = !mouse.closed;
    Object.keys(sushis).forEach((id) => {
        if (mouse.closed && sushis[id].clickInside(pos)) {//grabbed sushi with chops
            sushis[id].grabbed = true;
            sushis[id].dropped = false;
        } else if (!mouse.closed && sushis[id].clickInside(pos)){
            if (sushis[id].nearby(kirby.pos, 200)){
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

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fdd13e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    Object.keys(entities).forEach(key => {
        renderSprite(entities[key]);
    })
    mouse.render(ctx);
    Object.keys(sushis).forEach((id) => {
        renderStatic(sushis[id]);
    })
};

function renderSprite(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    if (entity.sprite.render(ctx)){
        let sprite = kirby.defaultSprite();
        kirby.sprite = sprite;
    };
    ctx.restore();
}

function renderStatic(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.render(ctx);
    ctx.restore();
}

let lastTime = Date.now();

function main() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    console.log(dt)
    update(dt);
    render();
    lastTime = now;
    requestAnimFrame(main);
};

function update(dt) {
    gameTime += dt;
    updateEntities(dt);
};

let cooldown = 2;

function updateEntities(dt) {
    cooldown -= dt;
    Object.keys(entities).forEach( key => {
        entities[key].sprite.update(dt);
    })

    if (cooldown < 0){
        cooldown = 2;
        let sushi = createSushi()
        sushis[sushi.id] = sushi;
    }

    Object.keys(sushis).forEach( (id) => {
        sushis[id].update(dt, 5, [mouse.x, mouse.y])
        if (sushis[id].nearby(kirby.pos, 5)) {
            kirby.sprite = kirbyHappySprite();
            delete sushis[id]
        } else if (sushis[id].offConveyor()) {
            delete sushis[id];  
        }
    })

    
}



