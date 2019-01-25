// jshint ignore: start

const fs = require('fs');
const path = require('path');

let cards;
let names;
const run = () => {
    fs.readFile(path.join(__dirname, 'Cards.txt'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            cards = JSON.parse(data); 
            names = Object.keys(cards);  
            fs.writeFile(path.join(__dirname, 'CardNames.txt'), JSON.stringify(names), ()=>{
                process.exit(); 
            });
        }
    });
};

run(); 