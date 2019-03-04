import * as fs from 'fs';
import * as path from 'path';
import { Card, StatePiece, Mechanic } from './shared/card';
import { getSortOrder } from './shared/sortOrder';


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
            fs.writeFile(path.join(__dirname, 'SortedCards.txt'), JSON.stringify(cards, null, 2), () => {
                process.exit();
            });
        }
    });
};

const sortCard = (card: Card) => {
    if(card.priority === undefined){
        card.priority = 5; 
    }
    sortRequirements(card.requirements);
    sortEffects(card.effects);
    card.optional.forEach((opt) => {
        sortRequirements(opt.requirements);
        sortEffects(opt.effects);
    })
}

const sortRequirements = (reqs: StatePiece[]) => {
    reqs.sort((a, b) => getSortOrder(a.axis) - getSortOrder(b.axis))
}

const sortEffects = (effs: Mechanic[]) => {
    effs.sort((a, b) => {
        let aVal: number, bVal: number;
        if (a.mechanic !== undefined) {
            aVal = getSortOrder(a.mechanic);
        } else {
            aVal = getSortOrder(a.axis);
        }
        if (b.mechanic !== undefined) {
            bVal = getSortOrder(b.mechanic);
        } else {
            bVal = getSortOrder(b.axis);
        }
        return aVal - bVal;
    })
    effs.forEach((eff) => {
        if (Array.isArray(eff.mechanicEffects)) {
            sortEffects(eff.mechanicEffects);
        }
        if (Array.isArray(eff.mechanicRequirements)) {
            sortRequirements(eff.mechanicRequirements);
        }
        if (Array.isArray(eff.choices)) {
            eff.choices.forEach((choice) => {
                sortEffects(choice);
            })
        }
    })
}

run(); 