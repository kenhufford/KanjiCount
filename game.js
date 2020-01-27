let canvas = document.querySelector("#myCanvas")
let ctx = canvas.getContext("2d");
let resources = new Resources();
let sushiUrls = ['https://i.imgur.com/H9FSt3j.png', 'https://i.imgur.com/7xsSO09.png', 'https://i.imgur.com/Gl8HBhm.png', 'https://i.imgur.com/tMccy64.png', 'https://i.imgur.com/4oT0uz5.png', 'https://i.imgur.com/zJeWZPT.png', 'https://i.imgur.com/dE5kRav.png', 'https://i.imgur.com/vZkWtPW.png']
let images = ["https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png"].concat(sushiUrls)
resources.loadSelector(images);
resources.onReady(init);

function init() {
    lastTime = Date.now();
    main();
}

let gameTime = 0;
var requestAnimFrame = (function () {
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
let conveyor = new Entity([150,400], conveyorSprite)

function render() {
    renderStatic(conveyor);
};

function renderStatic(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

let lastTime = Date.now();

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    debugger
    update(dt);
    render();
    lastTime = now;
    requestAnimFrame(main);
};

function update(dt) {
    gameTime += dt;
    updateEntities(dt);
};

function updateEntities(dt) {
    conveyor.sprite.update(dt);
}




// function loadImage(e) {
//     animate();
// }

// let shift = 0;
// let frameWidth = 605;
// let frameHeight = 60;
// let totalFrames = 4;
// let currentFrame = 0;
// let conveyorXStart = 200;
// let conveyorYStart = 200;

// function animate() {
//     context.clearRect(conveyorXStart,conveyorYStart,conveyorXStart+frameWidth, conveyorYStart+frameHeight);

//     context.drawImage(conveyor, 0, shift, frameWidth, frameHeight,
//         120, 25, frameWidth, frameHeight);

//     shift += frameWidth + 1;

//     if (currentFrame == totalFrames) {
//         shift = 0;
//         currentFrame = 0;
//     }

//     currentFrame++;

//     requestAnimationFrame(animate);
// }

// setInterval(animate(), 250)