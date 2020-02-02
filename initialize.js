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
//game variables


// let tutorial = true;
// let isGameOver = false;
// let isGameEnding = false;
// let isGameStart = false;
// let mode = "medium";
// let ordNumIndex = 0;
// let sushiNumIndex = 0;
// let sushiID = 1;
// let gameTime = 0;
// let sushis = {};
// let answers = {};
// let orders = [];
// let orderPositions = [];
// let sushiCooldown = 2.5;
// let soundCooldown = 3;
// let endGameScore = 10;
// let windCooldown = 1;
// let sushiShelf;

// let language = 'cantonese';
// let lastTime = Date.now();
// let now = Date.now();
// let dt = (now - lastTime) / 1000.0;
// let tutorialToggle = true;

// let orderCooldown = gameModes[mode].orderCooldown;
// let orderTime = gameModes[mode].orderTime;
// let orderNumEasy = Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1));
// let orderNumMed = Array.from(Array(100).keys()).sort((a, b) => (0.5 - Math.random() * 1));
// let orderNumHard = Array.from(Array(1000).keys()).sort((a, b) => (0.5 - Math.random() * 1));

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
let kirbyHappySprite = () => new Sprite(kirbySpriteURL, [0, 225], [75, 75], 10, [0, 1, 2, 3], "horizontal", true, () => playSound('haumph'))
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
let heartsSprite = () => new Sprite(heartsSpriteURL, [0, 0], [250, 50], 1, [10 - 2], "vertical", false);
let norinSprite = () => new Sprite(norinSpriteURL, [100, 0], [900, 190], 1, [0], "vertical", false);

// let kirby = new Entity([50, 200], kirbyIdleSprite(), kirbySpriteURL, kirbyIdleSprite)
// let chef = new Entity([750, 310], chefSprite(), kirbySpriteURL, chefSprite)
// let wind = new Entity([90, 110], noWindSprite(), kirbySpriteURL, noWindSprite)

// let music = new Music(gameSoundFiles["kirbysong"]);








let kanjiArray = Object.values(kanji);
let randomIndex = (array) => Math.floor(Math.random() * array.length)

let lesson = new Lesson("cantonese", canvas, ctx);
let game;
let kirbyLink = document.querySelector("#kirbylink");
let lessonsLink = document.querySelector("#lessonlink")
let gameSelected;
resources.loadSelector(images);

kirbyLink.addEventListener('click', () => {
    // tutorial = true;
    lesson.complete = true;
    gameSelected = true;
    if (resources.isReady()) {
        let game = new Game("medium", "cantonese", canvas, ctx, modalCanvas, modalCtx);
        game.start();
    };

})

lessonsLink.addEventListener('click', () => {
    canvas.classList.add('front-canvas');
    canvas.classList.remove('back-canvas');
    modalCanvas.classList.add('back-canvas');
    modalCanvas.classList.remove('front-canvas');
    let lesson = new Lesson(language, canvas, ctx);
    if (resources.isReady()) lesson.lessonLoop();
})