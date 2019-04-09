"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grappler_1 = require("./grappler");
const Cards_1 = require("../cards/Cards");
const cheapShot_1 = require("./cheapShot");
const crowdPleaser_1 = require("./crowdPleaser");
const deathFromAbove_1 = require("./deathFromAbove");
const finesse_1 = require("./finesse");
const hunter_1 = require("./hunter");
const immovable_1 = require("./immovable");
const jester_1 = require("./jester");
const kobraKai_1 = require("./kobraKai");
const mastermind_1 = require("./mastermind");
const retiarius_1 = require("./retiarius");
const seeingRed_1 = require("./seeingRed");
const toolsOfTheTrade_1 = require("./toolsOfTheTrade");
const unstoppable_1 = require("./unstoppable");
const allStyles = [
    grappler_1.grappleStyle,
    cheapShot_1.cheapShotStyle,
    crowdPleaser_1.crowdPleaserStyle,
    deathFromAbove_1.deathFromAboveStyle,
    finesse_1.finesseStyle,
    hunter_1.hunterStyle,
    immovable_1.immovableStyle,
    jester_1.jesterStyle,
    kobraKai_1.kobraKaiStyle,
    mastermind_1.mastermindStyle,
    retiarius_1.retiariusStyle,
    seeingRed_1.seeingRedStyle,
    toolsOfTheTrade_1.toolsOfTheTradeStyle,
    unstoppable_1.unstoppableStyle
];
const fightingStylesObj = {};
allStyles.forEach((style) => {
    fightingStylesObj[style.name] = style;
});
exports.getFightingStyles = () => {
    return allStyles.map(({ name, description }) => ({ name, description }));
};
exports.getFightingStyleByName = (styleName) => {
    const style = fightingStylesObj[styleName];
    if (style) {
        return style;
    }
    return null;
};
exports.getFullFightingStyleByName = (styleName) => {
    const style = fightingStylesObj[styleName];
    if (style) {
        return Object.assign({}, style, { cards: style.cards.map((cardName) => Cards_1.cards[cardName] ? Cards_1.cards[cardName] : null) });
    }
    return null;
};
