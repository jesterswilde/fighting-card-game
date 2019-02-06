// jshint ignore: start

const fs = require('fs');
const path = require('path');

let cards;
let names;
const run = () => {
    fs.readFile(path.join(__dirname, 'Cards.txt'), {
        encoding: 'utf8'
    }, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            cards = JSON.parse(data);
            modifyDamage(cards);
            fs.writeFile(path.join(__dirname, 'Cards.txt'), JSON.stringify(cards, null, 2), () => {
                process.exit();
            });
        }
    });
}

const modifyDamage = (obj) => {
    if (typeof obj === 'object') {
        if (obj.mechanic === 'Block' && typeof obj.amount === 'number') {
            obj.amount *= 4;
        } else {
            for (let key in obj) {
                const value = obj[key];
                if (typeof value === 'object') {
                    modifyDamage(value);
                }
            }
        }
    }
}

run();