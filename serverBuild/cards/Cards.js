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
exports.allCards = {};
exports.makeCardsObj = () => __awaiter(this, void 0, void 0, function* () {
    return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
        const cardNames = yield getCardNames();
        const cardPromises = cardNames.map((cardName) => readCardFile(cardName));
        const cards = yield Promise.all(cardPromises);
        const cardObj = cards.reduce((obj, card) => {
            obj[card.name] = card;
            return obj;
        }, {});
        res(cardObj);
    }));
});
const getCardNames = () => {
    return new Promise((res, rej) => {
        fs_1.readdir(path.join(__dirname, '..', '..', 'cards'), (err, cardNames) => {
            if (err) {
                console.error("Couldn't read folder for cards");
                rej(err);
                return;
            }
            else {
                res(cardNames);
            }
        });
    });
};
const readCardFile = (fileName) => {
    return new Promise((res, rej) => {
        fs_1.readFile(path.join(__dirname, '..', '..', 'cards', fileName), { encoding: 'utf8' }, (err, cardData) => {
            if (err) {
                rej(err);
            }
            else {
                const card = JSON.parse(cardData);
                res(card);
            }
        });
    });
};
//INITIALIZE CARDS OBJ; 
exports.makeCardsObj().then((cardsObj) => exports.allCards = cardsObj);
exports.removeCard = (name) => __awaiter(this, void 0, void 0, function* () {
    delete exports.allCards[name];
    return new Promise((res, rej) => {
        fs_1.unlink(path.join(__dirname, '..', '..', 'cards', name), (err) => {
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
        delete exports.allCards[cardObj.name];
    }
    return new Promise((res, rej) => {
        exports.allCards[cardObj.name] = cardObj;
        fs_1.writeFile(path.join(__dirname, '..', '..', 'cards', cardObj.name + ".json"), JSON.stringify(cardObj, null, 2), (err) => {
            if (err) {
                rej(err);
            }
            else {
                res();
            }
        });
    });
});
exports.downloadCards = () => {
    fs_1.writeFile(path.join(__dirname, '..', '..', 'backup.txt'), JSON.stringify(exports.allCards, null, 2), (err) => {
        if (err) {
            console.error(err);
        }
    });
};
