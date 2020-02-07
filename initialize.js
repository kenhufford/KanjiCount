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

let conveyorSprite = new Sprite("https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png", [0, 0], [605, 60], 4, [0, 1, 2, 3], 'vertical', false);
let conveyorSprite2 = new Sprite("https://obsoletegame.files.wordpress.com/2013/10/conveyorbelt605x60.png", [0, 0], [605, 60], 4, [3, 2, 1, 0], 'vertical', false);
let kirbySpriteURL = 'https://i.imgur.com/L41WBdc.png';
let heartsSpriteURL = 'https://i.imgur.com/yHVGEZl.png';
let norinSpriteURL = "https://i.imgur.com/K6KU5Rs.png";
let kirbyOpeningSprite = () => new Sprite(kirbySpriteURL, [0, 0], [75, 75], 10, [0, 0 , 1, 1, 2, 2, 3, 3], "horizontal", true);
let kirbyClosingSprite = () => new Sprite(kirbySpriteURL, [150, 0], [75, 75], 10, [0, 1, 2], "horizontal", true)
let kirbyIdleSprite = () => new Sprite(kirbySpriteURL, [0, 75], [75, 75], 5, Array.from(Array(34).keys()), "horizontal", false)
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
let kanjiArray = Object.values(kanji);
let randomIndex = (array) => Math.floor(Math.random() * array.length)


let lessonTutorial = new LessonTutorial(modalCanvas, modalCtx, canvas, ctx);
let lesson = lessonTutorial.lesson;
let game = new Game("easy", "cantonese", canvas, ctx, modalCanvas, modalCtx);
let kirbyLink = document.querySelector("#kirbylink");
let lessonsLink = document.querySelector("#lessonlink")
resources.loadSelector(images);

kirbyLink.addEventListener('click', () => {
    debugger
    if (game){
        game.gamePhase = "tutorial";
    }
    if (lesson){
        lesson.lessonPhase = "complete";
    }
    // if (resources.isReady()) {
        game = new Game("easy", "cantonese", canvas, ctx, modalCanvas, modalCtx);
        game.start();
    // };
    debugger
})

lessonsLink.addEventListener('click', () => {
    if (game){
        game.gamePhase = "lessons";
    }
    if (lesson) {
        lesson.lessonPhase = "options";
    }
    canvas.classList.remove('front-canvas');
    canvas.classList.add('back-canvas');
    modalCanvas.classList.remove('back-canvas');
    modalCanvas.classList.add('front-canvas');
    lessonTutorial = new LessonTutorial(modalCanvas, modalCtx, canvas, ctx);
    lesson = new Lesson("cantonese", canvas, ctx, modalCanvas, modalCtx, lessonTutorial);
    if (resources.isReady()) lessonTutorial.loop();
})

canvas.classList.remove('front-canvas');
canvas.classList.add('back-canvas');
modalCanvas.classList.remove('back-canvas');
modalCanvas.classList.add('front-canvas');

lessonTutorial.loop();