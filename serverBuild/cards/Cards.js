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
const db_1 = require("../db");
const fs_1 = require("fs");
const path = require("path");
exports.cards = {};
db_1.onDBReady((connection) => __awaiter(this, void 0, void 0, function* () {
    let cardsObj = {};
    const cardsArr = yield db_1.cardRepo.find();
    cardsArr.forEach(({ card }) => {
        cardsObj[card.name] = card;
    });
    exports.cards = cardsObj;
}));
// const readCardsFile = async() => {
//     await readFile(path.join(__dirname,'..','..','Cards.txt'), { encoding: 'utf8' }, (err, data) => {
//         if (err) {
//             console.error(err);
//         } else {
//             cards = JSON.parse(data); 
//         }
//     });
// }
// readCardsFile(); 
exports.removeCard = (name) => __awaiter(this, void 0, void 0, function* () {
    delete exports.cards[name];
    db_1.cardRepo.delete({ name });
});
// export const removeCard = async(name: string)=>{
//     delete cards[name]; 
//     return new Promise((res, rej) => {
//         writeFile(path.join(__dirname,'..','..','Cards.txt'), JSON.stringify(cards), (err) => {
//             if (err) {
//                 rej(err);
//             } else {
//                 res();
//             }
//         });
//     })
// }
exports.addCard = (card) => {
    exports.cards[card.name] = card;
    db_1.cardRepo.save({ name: card.name, card });
};
exports.stringifiedCards = () => {
    JSON.stringify(exports.cards, null, 2);
};
// export const addCard = async (cardObj: Card, index: string | null) => {
//     if (index !== null) {
//         delete cards[cardObj.name]
//     }
//     return new Promise((res, rej) => {
//         cards[cardObj.name] = cardObj;
//         writeFile(path.join(__dirname,'..','..','Cards.txt'), JSON.stringify(cards, null, 2), (err) => {
//             if (err) {
//                 rej(err);
//             } else {
//                 res();
//             }
//         });
//     })
// }
exports.downloadCards = () => {
    fs_1.writeFile(path.join(__dirname, '..', '..', 'backup.txt'), JSON.stringify(exports.cards, null, 2), (err) => {
        if (err) {
            console.error(err);
        }
    });
};
