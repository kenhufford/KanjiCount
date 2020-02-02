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
    "easy": {
        sushiShelf: Array.from(Array(11).keys()).sort((a, b) => (0.5 - Math.random() * 1)),
        orderTime: 25,
        orderCooldown: 10,
        startScore: 3
    },
    "medium": {
        sushiShelf: Array.from(Array(11).keys()).concat([10, 10]).sort((a, b) => (0.5 - Math.random() * 1)),
        orderTime: 25,
        orderCooldown: 10,
        startScore: 2,
    },
    "hard": {
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
let heartsSprite = () => new Sprite(heartsSpriteURL, [0, 0], [250, 50], 1, [10 - gameModes[mode].startScore], "vertical", false);
let norinSprite = () => new Sprite(norinSpriteURL, [100, 0], [900, 190], 1, [0], "vertical", false);
let conveyor = new Entity([150, 350], conveyorSprite, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
let conveyor2 = new Entity([110, 500], conveyorSprite2, "https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png")
let kirby = new Entity([50, 200], kirbyIdleSprite(), kirbySpriteURL, kirbyIdleSprite)
let chef = new Entity([750, 310], chefSprite(), kirbySpriteURL, chefSprite)
let wind = new Entity([90, 110], noWindSprite(), kirbySpriteURL, noWindSprite)
let hearts = new Entity([10, 10], heartsSprite(), heartsSpriteURL, heartsSprite);
let score = new Score(gameModes[mode].startScore, [10, 10], endGameScore, hearts)
let mouse = new Mouse(false, 0, 0, mouseImages[0], mouseImages[1])
let spotlight = new Spotlight(kirby.pos[0] + kirby.sprite.size[0] / 2, kirby.pos[1] + kirby.sprite.size[1] / 2, 80)
let languageButton = new Button([100, 100], 120, 50, 4, 33, "Cantonese", "Japanese", "", true);
let difficultyButton = new Button([100, 200], 120, 50, 4, 33, "Medium", "Easy", "", true);
let tutorialButton = new Button([100, 300], 120, 50, 4, 33, "Tutorial", "None", "", true);
let tutorialMusicButton = new Button([100, 400], 120, 50, 4, 33, "Off", "On", "",true);
let ingameMusicButton = new Button([760, 530], 120, 50, 4, 33, "Off", "On","", true);
let readyButton = new Button([400, 500], 120, 50, 4, 33, "Start", "Start", "",false);
let norin = new Entity([0, 0], norinSprite(), norinSpriteURL, norinSprite);
let music = new Music(gameSoundFiles["kirbysong"]);

let attackSprites = [
    { sprite: kirbyAttackDown, vector: [0, -1], sound: (() => playSound('attackdown')) },
    { sprite: kirbyAttackUp, vector: [0, 1], sound: (() => playSound('attackup')) },
    { sprite: kirbyAttackFwd, vector: "find", sound: (() => playSound('attackfwd')) }
];
let entities = {
    kirby, conveyor, conveyor2, chef, wind, hearts
};

let buttons = {
    languageButton, difficultyButton, tutorialButton, readyButton, tutorialMusicButton
}



