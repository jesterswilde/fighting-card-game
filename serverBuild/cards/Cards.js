"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
exports.cards = {};
const readCardsFile = () => __awaiter(this, void 0, void 0, function* () {
    yield fs_1.readFile(path.join(__dirname, '..', '..', 'Cards.txt'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            exports.cards = JSON.parse(data);
        }
    });
});
readCardsFile();
exports.removeCard = (name) => __awaiter(this, void 0, void 0, function* () {
    delete exports.cards[name];
    return new Promise((res, rej) => {
        fs_1.writeFile(path.join(__dirname, '..', '..', 'Cards.txt'), JSON.stringify(exports.cards), (err) => {
            if (err) {
                rej(err);
            }
            else {
                res();
            }
        });
    });
});
exports.addCard = (cardObj, index) => __awaiter(this, void 0, void 0, function* () {
    if (index !== null) {
        delete exports.cards[cardObj.name];
    }
    return new Promise((res, rej) => {
        exports.cards[cardObj.name] = cardObj;
        fs_1.writeFile(path.join(__dirname, '..', '..', 'Cards.txt'), JSON.stringify(exports.cards, null, 2), (err) => {
            if (err) {
                rej(err);
            }
            else {
                res();
            }
        });
    });
});
