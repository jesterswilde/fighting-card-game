// jshint ignore: start
const fs = require('fs');  
const path = require('path'); 
const {getAllFightingStylesArr} = require('./serverBuild/styles'); 

let allCards; 

const readCardsFile = async() => {
    await fs.readFile(path.join(__dirname,'Cards.txt'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            allCards = JSON.parse(data); 
            getOrphanedCards(); 
        }
    });
}
readCardsFile(); 

const getOrphanedCards = ()=>{
    const styles = getAllFightingStylesArr(); 
    const cardsObj = {};
    const orphanedCards = []; 
    styles.forEach((style)=> {
        style.cards.forEach((card)=>{
                cardsObj[card] = true;
        });
    });
    Object.keys(allCards).forEach((card)=>{
        if(!cardsObj[card]){
            orphanedCards.push(card); 
        }
    })
    console.log("Orphaned Cards: ", orphanedCards.length); 
    console.log(orphanedCards); 
}