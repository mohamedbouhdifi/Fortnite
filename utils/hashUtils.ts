const CryptoJS = require('crypto-js');

const salt = CryptoJS.lib.WordArray.random().toString();
const iterations = 1;

const hash = (password: any) => {
    let hashedPasword = password;
    var PBKDF2 = CryptoJS.PBKDF2(hashedPasword, salt, {
        iterations: 100
    }).toString();
    return PBKDF2;
}

const comparePassword = (password : any, hashedPassword: any, callback: any) => {
    let isMatch = hash(password) === hashedPassword;
    callback(null, isMatch);
}

module.exports = {
    hash: hash,
    salt: salt,
    iterations: iterations,
    comparePassword: comparePassword
};
