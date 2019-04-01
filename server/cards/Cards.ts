import { Card } from '../shared/card';
import { onDBReady, cardRepo } from '../db';
import { writeFile } from 'fs';
import * as path from 'path'; 

export let cards: { [name: string]: Card } = {};

onDBReady(async(connection)=>{
    let cardsObj = {}; 
    const cardsArr = await cardRepo.find(); 
    cardsArr.forEach(({card})=>{
        cardsObj[card.name] = card
    })
    cards = cardsObj; 
})

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

export const removeCard = async(name: string)=>{
    delete cards[name]; 
    cardRepo.delete({name})
}

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

export const addCard = (card: Card) =>{
    cards[card.name] = card; 
    cardRepo.save({name: card.name, card});
}

export const stringifiedCards = ()=>{
    JSON.stringify(cards, null, 2);
}

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


export const downloadCards = ()=>{
    writeFile(path.join(__dirname, '..', '..', 'backup.txt'), JSON.stringify(cards, null, 2), (err)=>{
        if(err){
            console.error(err); 
        }
    })
}