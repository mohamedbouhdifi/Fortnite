const CryptoJS = require('crypto-js');
const utils = require('./utils');

const salt = CryptoJS.lib.WordArray.random().toString();
const iterations = 1;

const hash = (password) => {
    let hashedPasword = password;
    var PBKDF2 = CryptoJS.PBKDF2(hashedPasword, salt, {
        iterations: 100
    }).toString();
    return PBKDF2;
}

exports.hash = utils.time(hash);
exports.salt = salt;
exports.iterations = iterations;