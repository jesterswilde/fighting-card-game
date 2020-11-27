"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEnhancementMechanic = exports.removeEnhancements = exports.addEnhacementsToHands = exports.makeEffectsFromEnhance = void 0;
const util_1 = require("../../util");
//permanently buffs all cards with a tag. 
exports.makeEffectsFromEnhance = (card) => {
    if (!card.enhancements)
        return [];
    const effects = [];
    card.enhancements.forEach(enhance => effects.push(...util_1.deepCopy(enhance.effects)));
    return effects;
};
exports.addEnhacementsToHands = (state) => {
    state.hands.forEach(hand => {
        hand.forEach(card => addEnhancementToCard(card, state));
    });
};
const addEnhancementToCard = (card, state) => {
    if (!card.tags || card.tags.length == 0)
        return;
    const modObj = state.tagModification[card.player];
    card.enhancements = card.tags.reduce((enhArr, tag) => {
        const effects = modObj[tag] || [];
        enhArr.push({ tag, effects: util_1.deepCopy(effects) });
        return enhArr;
    }, []);
};
exports.removeEnhancements = (card) => {
    card.enhancements = null;
};
exports.handleEnhancementMechanic = (mechanic, card, player, opponent, state) => {
    const tagObj = state.tagModification[player];
    tagObj[mechanic.enhancedTag] = tagObj[mechanic.enhancedTag] || [];
    tagObj[mechanic.enhancedTag].push(...util_1.deepCopy(mechanic.effects));
};
