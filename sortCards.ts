import * as fs from 'fs';
import * as path from 'path';
import { Card, StatePiece, Mechanic, AxisEnum } from './shared/card';
import { getSortOrder, sortCard } from './shared/sortOrder';


let cards: { [cardName: string]: Card };
const run = () => {
    fs.readFile(path.join(__dirname, 'Cards.txt'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            cards = JSON.parse(data);
            for (let key in cards) {
                sortCard(cards[key]);
            }
            fs.writeFile(path.join(__dirname, 'Cards.txt'), JSON.stringify(cards, null, 2), () => {
                process.exit();
            });
        }
    });
};


run(); 