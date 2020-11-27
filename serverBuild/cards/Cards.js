"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCards = exports.addCard = exports.removeCard = exports.makeCardsObj = exports.getCardByName = exports.deckListToCards = exports.allCards = void 0;
const fs_1 = require("fs");
const path = require("path");
const util_1 = require("../gameServer/util");
exports.allCards = {};
exports.deckListToCards = (deckList) => {
    return deckList.map(cardName => util_1.deepCopy(exports.allCards[cardName]));
};
exports.getCardByName = (cardName, log = false) => {
    if (log) {
        console.log(`CardName |${cardName}`);
        console.log(exports.allCards[cardName]);
    }
    return util_1.deepCopy(exports.allCards[cardName]);
};
exports.makeCardsObj = async () => {
    return new Promise(async (res, rej) => {
        const cardNames = await getCardNames();
        const cardPromises = cardNames.map(cardName => readCardFile(cardName));
        const cards = await Promise.all(cardPromises);
        const cardObj = cards.reduce((obj, card) => {
            obj[card.name] = card;
            return obj;
        }, {});
        res(cardObj);
    });
};
const getCardNames = () => {
    return new Promise((res, rej) => {
        fs_1.readdir(path.join(__dirname, "..", "..", "cards"), (err, cardNames) => {
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
        fs_1.readFile(path.join(__dirname, "..", "..", "cards", fileName), { encoding: "utf8" }, (err, cardData) => {
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
exports.makeCardsObj().then(cardsObj => (exports.allCards = cardsObj));
exports.removeCard = async (name) => {
    delete exports.allCards[name];
    return new Promise((res, rej) => {
        fs_1.unlink(path.join(__dirname, "..", "..", "cards", name + ".json"), err => {
            if (err) {
                rej(err);
            }
            else {
                res();
            }
        });
    });
};
exports.addCard = async (cardObj, index) => {
    if (index !== null) {
        delete exports.allCards[cardObj.name];
    }
    return new Promise((res, rej) => {
        exports.allCards[cardObj.name] = cardObj;
        fs_1.writeFile(path.join(__dirname, "..", "..", "cards", cardObj.name + ".json"), JSON.stringify(cardObj, null, 2), err => {
            if (err) {
                rej(err);
            }
            else {
                res();
            }
        });
    });
};
exports.downloadCards = () => {
    fs_1.writeFile(path.join(__dirname, "..", "..", "backup.txt"), JSON.stringify(exports.allCards, null, 2), err => {
        if (err) {
            console.error(err);
        }
    });
};
