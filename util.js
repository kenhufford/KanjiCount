let playSound = (key, language) => {
    let newAudio;
    switch (language) {
        case 'japanese':
            newAudio = new Audio(audioJapaneseFiles[key]);
            break;
        case 'cantonese':
            newAudio = new Audio(audioCantoneseFiles[key]);
            break;
        default:
            newAudio = new Audio(gameSoundFiles[key])
            break;
    }
    newAudio.play();
}

let playNumberSound = (number, language) => {
    let audioArray = convertNumberToSoundArray(number, language);
    let newAudio;

    let index = -1;
    let playSound = () => {
        index++;
        if (index === audioArray.length) {
            return;
        }
        if (language === 'cantonese') {
            newAudio = new Audio(audioCantoneseFiles[audioArray[index]]);
        } else if (language === 'japanese') {
            newAudio = new Audio(audioJapaneseFiles[audioArray[index]]);
        };
        newAudio.addEventListener('ended', playSound);
        newAudio.play();
    }
    playSound();
};

const audioJapaneseFiles = {
    '0': 'japaneseAudio/0.mp3',
    '1': 'japaneseAudio/1.mp3',
    '2': 'japaneseAudio/2.mp3',
    '3': 'japaneseAudio/3.mp3',
    '4': 'japaneseAudio/4.mp3',
    '5': 'japaneseAudio/5.mp3',
    '6': 'japaneseAudio/6.mp3',
    '7': 'japaneseAudio/7.mp3',
    '8': 'japaneseAudio/8.mp3',
    '9': 'japaneseAudio/9.mp3',
    '10': 'japaneseAudio/10.mp3',
    '100': 'japaneseAudio/100.mp3',
    '300': 'japaneseAudio/300.mp3',
    '600': 'japaneseAudio/600.mp3',
    '3000': 'japaneseAudio/3000.mp3',
    '8000': 'japaneseAudio/8000.mp3',
    '1000': 'japaneseAudio/1000.mp3',
    '10000': 'japaneseAudio/10000.mp3',
    '10000a': 'japaneseAudio/10000a.mp3',
    'equals': 'japaneseAudio/equals.mp3',
    'plus': 'japaneseAudio/plus.mp3',
    'minus': 'japaneseAudio/minus.mp3'
};

const japanesePronunciation = {
    '0': 'rei',
    '1': 'ichi',
    '2': 'ni',
    '3': 'san',
    '4': 'yon',
    '5': 'go',
    '6': 'roku',
    '7': 'nana',
    '8': 'hachi',
    '9': 'kyu',
    '10': 'ju',
    '100': 'hyaku',
    '1000': 'sen',
    '10000': 'ichiman',
};

const cantonesePronunciation = {
    '0': 'lihng',
    '1': 'yāt',
    '2': 'yih',
    '3': 'sàam',
    '4': 'sei',
    '5': 'nǵh',
    '6': 'luhk',
    '7': 'chāt',
    '8': 'baat',
    '9': 'gáu',
    '10': 'sahp',
    '100': 'yātbaak', 
    '1000': 'yātchìn',
    '10000': 'yātmaahn',
};


const audioCantoneseFiles = {
    '0': 'cantoneseAudio/0.mp3',
    '1': 'cantoneseAudio/1.mp3',
    '2': 'cantoneseAudio/2.mp3',
    '3': 'cantoneseAudio/3.mp3',
    '4': 'cantoneseAudio/4.mp3',
    '5': 'cantoneseAudio/5.mp3',
    '6': 'cantoneseAudio/6.mp3',
    '7': 'cantoneseAudio/7.mp3',
    '8': 'cantoneseAudio/8.mp3',
    '9': 'cantoneseAudio/9.mp3',
    '10': 'cantoneseAudio/10.mp3',
    '100': 'cantoneseAudio/100.mp3',
    '100a': 'cantoneseAudio/100a.mp3',
    '1000': 'cantoneseAudio/1000.mp3',
    '1000a': 'cantoneseAudio/1000a.mp3',
    '10000': 'cantoneseAudio/10000.mp3',
    '10000a': 'cantoneseAudio/10000a.mp3',
    'equals': 'cantoneseAudio/equals.mp3',
    'plus': 'cantoneseAudio/plus.mp3',
    'minus': 'cantoneseAudio/minus.mp3'
};

const gameSoundFiles = {
    'attackup': 'GameSound/attackup.mp3',
    'attackdown': 'GameSound/attackdown.mp3',
    'attackfwd': 'GameSound/punch.mp3',
    'kirbysong': 'GameSound/kirbysong.mp3',
    'hi': 'GameSound/hi.mp3',
    'disappointed': 'GameSound/disappointed.mp3',
    'gross': 'GameSound/gross.mp3',
    'gross2': 'GameSound/gross2.mp3',
    'haumph': 'GameSound/haumph.mp3',
    'suck': 'GameSound/suck.mp3',
    'pickupsushi': 'GameSound/pickupsushi.mp3',
    'happy': 'GameSound/happy.mp3',
    'hit': 'GameSound/hit.mp3',
    'ahhh': 'GameSound/ahhh.mp3',
    'wahhh': 'GameSound/wahhh.mp3',
}

const kanji = {
    '0': '\u96F6',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d',
    '7': '\u4e03',
    '8': '\u516b',
    '9': '\u4e5d',
    '10': '\u5341',
    '100': '\u767e',
    '1000': '\u5343',
    '10000': '\u4e07'
}


let convertNumberToArray = (num) => {
    let digits = Array.from(num.toString()).map(String);
    let result = [];
    let orderNumber;

    let order = {
        '5': '10000',
        '4': '1000',
        '3': '100',
        '2': '10',
    };

    for (let i = 0; i < digits.length; i++) {
        orderNumber = digits.length - i;
        if (digits[i] == 0 && digits.length == 1) {
            result.push(digits[i]);
        } else if (digits[i] == 0) {
            continue;
        } else if (digits[i] == 1 && orderNumber != 1) {
            result.push(order[orderNumber]);
        } else if (orderNumber == 1 && digits[i] != 0) {
            result.push(digits[i]);
        } else {
            result.push(digits[i]);
            result.push(order[orderNumber]);
        };
    }

    return result;
};

let convertToKanji = (digits) => {
    let kanjiNumber = "";
    for (let i = 0; i < digits.length; i++) {
        kanjiNumber += kanji[digits[i]];
    }
    return kanjiNumber;
};


let convertNumberToSoundArray = (num, language) => {
    let digits = Array.from(num.toString()).map(String);
    let results = [];
    let orderNumber;

    let order = {
        '5': '10000',
        '4': '1000',
        '3': '100',
        '2': '10',
    };

    if (language == 'japanese') {

        for (let i = 0; i < digits.length; i++) {
            orderNumber = digits.length - i;
            if (digits[i] == 0) {
                continue;
            } else if (orderNumber == 5 && digits[i] == 1) {
                results.push('10000a')
            } else if (orderNumber == 4 && digits[i] == 8) {
                results.push('8000')
            } else if (orderNumber == 4 && digits[i] == 3) {
                results.push('3000')
            } else if (orderNumber == 3 && digits[i] == 3) {
                results.push('300')
            } else if (orderNumber == 3 && digits[i] == 6) {
                results.push('600')
            } else if (orderNumber == 3 && digits[i] == 8) {
                results.push('800')
            } else if (digits[i] == 1 && orderNumber != 1) {
                results.push(order[orderNumber]);
            } else if (orderNumber == 1) {
                results.push(digits[i]);
            } else {
                results.push(digits[i]);
                results.push(order[orderNumber]);
            };
        }
    };

    if (language == 'cantonese') {

        for (let i = 0; i < digits.length; i++) {
            orderNumber = digits.length - i;
            if (digits[i] == 0) {
                continue;
            } else if (orderNumber == 5 && digits[i] == 1) {
                results.push('10000a')
            } else if (orderNumber == 4 && digits[i] == 1) {
                results.push('1000a')
            } else if (orderNumber == 3 && digits[i] == 1) {
                results.push('1000a')
            } else if (digits[i] == 1 && orderNumber != 1) {
                results.push(order[orderNumber]);
            } else if (orderNumber == 1) {
                results.push(digits[i]);
            } else {
                results.push(digits[i]);
                results.push(order[orderNumber]);
            };
        }
    };

    return results;
};

let roundRect = (x, y, w, h, radius, ctx, color) => {
    var r = x + w;
    var b = y + h;
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = "4";
    ctx.moveTo(x + radius, y);
    ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    ctx.lineTo(r, y + h - radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.fillStyle = color;
    ctx.stroke();
    ctx.fill();
}

