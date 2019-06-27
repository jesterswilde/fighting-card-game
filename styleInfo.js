// jshint ignore: start
const fs = require('fs');  
const path = require('path'); 
const {getAllFightingStylesArr} = require('./serverBuild/styles'); 

const printStyleInfo = ()=>{
    const styles = getAllFightingStylesArr(); 
    const totalCards = styles.reduce((total, {cards})=> total + cards.length, 0); 
    console.log("Total Styles: ",styles.length)
    console.log("Total Cards In All Styles:", totalCards); 
    styles.forEach((style)=> {
        console.log(style.name + ': ',style.cards.length, 'cards');
    });
};

printStyleInfo(); 