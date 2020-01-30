function playSound(key, language){
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
    'attackfwd': 'GameSound/attackfwd.mp3',
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
}
