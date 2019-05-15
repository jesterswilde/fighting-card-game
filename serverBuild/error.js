"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorEnum;
(function (ErrorEnum) {
    ErrorEnum["INVALID_TOKEN"] = "invalid token";
    ErrorEnum["INCORRECT_USER_OR_PW"] = "incorrect username or password";
    ErrorEnum["DOESNT_OWN_DECK"] = "user doe not own deck";
    ErrorEnum["CARDS_ARENT_IN_STYLES"] = "some of these cards are not in the styles you chose";
    ErrorEnum["TOO_MANY_STYLES"] = "too many styles in deck";
})(ErrorEnum = exports.ErrorEnum || (exports.ErrorEnum = {}));
