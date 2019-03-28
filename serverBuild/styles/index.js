"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grappler_1 = require("./grappler");
const Cards_1 = require("../cards/Cards");
const allStyles = [
    grappler_1.grappleStyle,
];
exports.getFightingStyles = () => {
    return allStyles.map(({ name, description, identity, strengths }) => ({ name, description }));
};
exports.getFightingStyleByName = (styleName) => {
    const style = allStyles.find(({ name }) => name === styleName);
    if (style) {
        return Object.assign({}, style, { cards: style.cards.map((cardName) => Cards_1.cards[cardName] ? Cards_1.cards[cardName] : null) });
    }
    return null;
};
