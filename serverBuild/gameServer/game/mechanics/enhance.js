"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../../util");
//permanently buffs all cards with a tag. 
exports.getEnhancementsFromCard = (card) => {
    if (!card.enhancements)
        return [];
    const effects = [];
    card.enhancements.forEach(enhance => effects.push(...util_1.deepCopy(enhance.effects)));
    return effects;
};
const addEnhancementToCard = (card, state) => {
    const tags = card.tags || [];
    const modObj = state.tagModification[card.player];
    card.enhancements = tags.reduce((enhArr, tag) => {
        const effects = modObj[tag] || [];
        enhArr.push({ tag, effects });
        return enhArr;
    }, []);
};
exports.addEnhacementsToHands = (state) => {
    state.hands.forEach(hand => {
        hand.forEach(card => addEnhancementToCard(card, state));
    });
};
exports.removeEnhancements = (card) => {
    card.enhancements = null;
};
exports.handleEnhancementMechanic = (mechanic, card, player, opponent, state) => {
    const tagObj = state.tagModification[player];
    tagObj[mechanic.enhancedTag] = tagObj[mechanic.enhancedTag] || [];
    tagObj[mechanic.enhancedTag].push(...util_1.deepCopy(mechanic.effects));
};
