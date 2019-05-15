import { Card } from '../shared/card';
import { writeFile, readFile } from 'fs';
import * as path from 'path'; 

export let allCards: { [name: string]: Card } = {};

// onDBReady(async(connection)=>{
//     let cardsObj = {}; 
//     const cardsArr = await cardRepo.find(); 
//     cardsArr.forEach(({card})=>{
//         cardsObj[card.name] = card
//     })
//     cards = cardsObj; 
// })

const readCardsFile = async() => {
    await readFile(path.join(__dirname,'..','..','Cards.txt'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            allCards = JSON.parse(data); 
        }
    });
}
readCardsFile(); 

// export const removeCard = async(name: string)=>{
//     delete cards[name]; 
//     cardRepo.delete({name})
// }

export const removeCard = async(name: string)=>{
    delete allCards[name]; 
    return new Promise((res, rej) => {
        writeFile(path.join(__dirname,'..','..','Cards.txt'), JSON.stringify(allCards), (err) => {
            if (err) {
                rej(err);
            } else {
                res();
            }
        });
    })
}

// export const addCard = (card: Card) =>{
//     cards[card.name] = card; 
//     cardRepo.save({name: card.name, card});
// }

// export const stringifiedCards = ()=>{
//     JSON.stringify(cards, null, 2);
// }

export const addCard = async (cardObj: Card, index: string | null) => {
    if (index !== null) {
        delete allCards[cardObj.name]
    }
    return new Promise((res, rej) => {
        allCards[cardObj.name] = cardObj;
        writeFile(path.join(__dirname,'..','..','Cards.txt'), JSON.stringify(allCards, null, 2), (err) => {
            if (err) {
                rej(err);
            } else {
                res();
            }
        });
    })
}


export const downloadCards = ()=>{
    writeFile(path.join(__dirname, '..', '..', 'backup.txt'), JSON.stringify(allCards, null, 2), (err)=>{
        if(err){
            console.error(err); 
        }
    })
}