
const kanji = {
    '0': '0',
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