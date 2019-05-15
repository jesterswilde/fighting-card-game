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
// onDBReady(async(connection)=>{
//     let cardsObj = {}; 
//     const cardsArr = await cardRepo.find(); 
//     cardsArr.forEach(({card})=>{
//         cardsObj[card.name] = card
//     })
//     cards = cardsObj; 
// })
const readCardsFile = () => __awaiter(this, void 0, void 0, function* () {
    yield fs_1.readFile(path.join(__dirname, '..', '..', 'Cards.txt'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            exports.allCards = JSON.parse(data);
        }
    });
});
readCardsFile();
// export const removeCard = async(name: string)=>{
//     delete cards[name]; 
//     cardRepo.delete({name})
// }
exports.removeCard = (name) => __awaiter(this, void 0, void 0, function* () {
    delete exports.allCards[name];
    return new Promise((res, rej) => {
        fs_1.writeFile(path.join(__dirname, '..', '..', 'Cards.txt'), JSON.stringify(exports.allCards), (err) => {
            if (err) {
                rej(err);
            }
            else {
                res();
            }
        });
    });
});
// export const addCard = (card: Card) =>{
//     cards[card.name] = card; 
//     cardRepo.save({name: card.name, card});
// }
// export const stringifiedCards = ()=>{
//     JSON.stringify(cards, null, 2);
// }
exports.addCard = (cardObj, index) => __awaiter(this, void 0, void 0, function* () {
    if (index !== null) {
        delete exports.allCards[cardObj.name];
    }
    return new Promise((res, rej) => {
        exports.allCards[cardObj.name] = cardObj;
        fs_1.writeFile(path.join(__dirname, '..', '..', 'Cards.txt'), JSON.stringify(exports.allCards, null, 2), (err) => {
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
