"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
//permanently buffs all cards with a tag. 
exports.reduceEnhance = (mechanic, card, player, opponent, state) => {
    const alterObj = state.tagModification[player];
    const enhanceArr = [...(alterObj[mechanic.amount] || []), ...(mechanic.mechanicEffects || [])];
    alterObj[mechanic.amount] = util_1.consolidateMechanics(enhanceArr);
};
exports.addEnhancement = (card, state) => {
    const tags = card.tags || [];
    const modObj = state.tagModification[card.player];
    card.enhancements = tags.reduce((enhArr, { value: tag }) => {
        const mechanics = modObj[tag] || [];
        enhArr.push({ tag, mechanics });
        return enhArr;
    }, []);
};
exports.removeEnhancements = (card) => {
    card.enhancements = null;
};
