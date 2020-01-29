function playSound(number, language){
    if (language == 'japanese') {
        let newAudio = new Audio(audioJapaneseFiles[number]);
        newAudio.play();
    }

    if (language == 'cantonese') {
        let newAudio = new Audio(audioCantoneseFiles[number]);
        newAudio.play();
    }
}

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



function convertNumberToSoundArray(i, language) {
    let array = Array.from(i.toString()).map(String);
    let piecesArray = [];
    let orderNumber;

    let order = {
        '5': '10000',
        '4': '1000',
        '3': '100',
        '2': '10',
    };

    if (language == 'japanese') {

        for (let i = 0; i < array.length; i++) {
            orderNumber = array.length - i;
            if (array[i] == 0) {
                continue;
            } else if (orderNumber == 5 && array[i] == 1) {
                piecesArray.push('10000a')
            } else if (orderNumber == 4 && array[i] == 8) {
                piecesArray.push('8000')
            } else if (orderNumber == 4 && array[i] == 3) {
                piecesArray.push('3000')
            } else if (orderNumber == 3 && array[i] == 3) {
                piecesArray.push('300')
            } else if (orderNumber == 3 && array[i] == 6) {
                piecesArray.push('600')
            } else if (orderNumber == 3 && array[i] == 8) {
                piecesArray.push('800')
            } else if (array[i] == 1 && orderNumber != 1) {
                piecesArray.push(order[orderNumber]);
            } else if (orderNumber == 1) {
                piecesArray.push(array[i]);
            } else {
                piecesArray.push(array[i]);
                piecesArray.push(order[orderNumber]);
            };
        }
    };

    if (language == 'cantonese') {

        for (let i = 0; i < array.length; i++) {
            orderNumber = array.length - i;
            if (array[i] == 0) {
                continue;
            } else if (orderNumber == 5 && array[i] == 1) {
                piecesArray.push('10000a')
            } else if (orderNumber == 4 && array[i] == 1) {
                piecesArray.push('1000a')
            } else if (orderNumber == 3 && array[i] == 1) {
                piecesArray.push('1000a')
            } else if (array[i] == 1 && orderNumber != 1) {
                piecesArray.push(order[orderNumber]);
            } else if (orderNumber == 1) {
                piecesArray.push(array[i]);
            } else {
                piecesArray.push(array[i]);
                piecesArray.push(order[orderNumber]);
            };
        }
    };

    return piecesArray;
};


function convertNumberToKanjiArray(i) {
    let array = Array.from(i.toString()).map(String);
    let piecesArray = [];
    let orderNumber;

    let order = {
        '5': '10000',
        '4': '1000',
        '3': '100',
        '2': '10',
    };

    for (let i = 0; i < array.length; i++) {
        orderNumber = array.length - i;
        if (array[i] == 0 && array.length == 1) {
            piecesArray.push(array[i]);
        } else if (array[i] == 0) {
            continue;
        } else if (array[i] == 1 && orderNumber != 1) {
            piecesArray.push(order[orderNumber]);
        } else if (orderNumber == 1 && array[i] != 0) {
            piecesArray.push(array[i]);
        } else {
            piecesArray.push(array[i]);
            piecesArray.push(order[orderNumber]);
        };
    }

    return piecesArray;
};

function convertToKanji(array, language) {

    let kanjiNumber = "";
    for (let i = 0; i < array.length; i++) {
        kanjiNumber += kanji[array[i]];
    }
    return kanjiNumber;
};
