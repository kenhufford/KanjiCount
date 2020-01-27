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
let conveyor = new EntitySprite([150,400], conveyorSprite)
let sushis = []
sushis.push(createSushi())

function createSushi(){
    let randSushiUrl = sushiUrls[Math.floor(Math.random() * sushiUrls.length)];
    let kanjiArray = Object.values(kanji)
    let randSushiChar = kanjiArray[Math.floor(Math.random() * kanjiArray.length)];
    let sushi = new EntityStatic([700, 370], randSushiUrl, randSushiChar) //700, 370 start, 130 end
    return sushi
}
let mouse = new Mouse(false, 0, 0, mouseImages[0], mouseImages[1])

let getMousePosition = (e) => {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left - 25;
    let y = e.clientY - rect.top - 100;
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
    sushis.forEach((sushi) => {
        if (sushi.clickInside(pos)){
            sushi.grabbed = true;
        };
    })
})

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderSprite(conveyor);
    mouse.render(ctx);
    sushis.forEach((sushi)=> {
        renderStatic(sushi);
    })
    
};

function renderSprite(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
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
    update(dt);
    render();
    lastTime = now;
    requestAnimFrame(main);
};

function update(dt) {
    gameTime += dt;
    updateEntities(dt);
};

let sushiCooldown = 2;

function updateEntities(dt) {
    sushiCooldown -= dt;
    conveyor.sprite.update(dt);
    if (sushis.length < 7 && sushiCooldown < 0){
        sushiCooldown = 2;
        sushis.push(createSushi())
    }

    sushis.forEach( (sushi) => {
        sushi.update(dt, 5, getMousePosition())
        if (sushi.offConveyor()) {
            sushis.shift();
            console.log(sushis)
            sushis.push(createSushi())
        }
    })
}



