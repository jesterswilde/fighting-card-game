// jshint ignore: start
const fs = require('fs');  
const path = require('path'); 
const {getAllFightingStylesArr} = require('./serverBuild/styles'); 
const {makeCardsObj} = require('./serverBuild/cards/Cards');

makeCardsObj().then((allCardsObj)=>{
    getOrphanedCards(allCardsObj); 
});

const getOrphanedCards = (allCardsObj)=>{
    const styles = getAllFightingStylesArr(); 
    const cardsObj = {};
    const orphanedCards = []; 
    styles.forEach((style)=> {
        style.cards.forEach((card)=>{
                cardsObj[card] = true;
        });
    });
    Object.keys(allCardsObj).forEach((card)=>{
        if(!cardsObj[card]){
            orphanedCards.push(card); 
        }
    });
    console.log("Orphaned Cards: ", orphanedCards.length); 
    console.log(orphanedCards); 
};