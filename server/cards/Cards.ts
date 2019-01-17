import { readFile, writeFile } from 'fs';
import { Card } from './CardInterfaces';
import * as path from 'path'; 

export let cards: { [name: string]: Card } = {};

const readCardsFile = async() => {
    await readFile(path.join(__dirname,'..','..','Cards.txt'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            cards = JSON.parse(data); 
        }
    });
}
readCardsFile(); 

export const removeCard = async(name: string)=>{
    delete cards[name]; 
    return new Promise((res, rej) => {
        writeFile(path.join(__dirname,'..','..','Cards.txt'), JSON.stringify(cards), (err) => {
            if (err) {
                rej(err);
            } else {
                res();
            }
        });
    })
}

export const addCard = async (cardObj: Card, index: string | null) => {
    if (index !== null) {
        delete cards[cardObj.name]
    }
    return new Promise((res, rej) => {
        cards[cardObj.name] = cardObj;
        writeFile(path.join(__dirname,'..','..','Cards.txt'), JSON.stringify(cards), (err) => {
            if (err) {
                rej(err);
            } else {
                res();
            }
        });
    })
}
