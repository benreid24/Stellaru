function objectKeys(object) {
    return Object.entries(object).map(([key, _]) => key);
}

function shuffle(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function capitalizeWord(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function capitalize(str, sep) {
    return sep ? str.split(sep).map(capitalizeWord).join(' ') : capitalizeWord(str);
}

function randomString(length) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let chosen = [];
    for (let i = 0; i < length; i += 1) {
        chosen.push(chars.charAt(Math.floor(Math.random()*chars.length)));
    }
    return chosen.join('');
}

export {
    objectKeys,
    shuffle,
    capitalizeWord,
    capitalize,
    randomString
}
