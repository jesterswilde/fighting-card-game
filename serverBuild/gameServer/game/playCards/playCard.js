"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cardHappens_1 = require("./cardHappens");
const errors_1 = require("../../errors");
const card_1 = require("../../../shared/card");
const readiedEffects_1 = require("../readiedEffects");
const playerInput_1 = require("./playerInput");
const predict_1 = require("../mechanics/predict");
const enhance_1 = require("../mechanics/enhance");
const util_1 = require("../../util");
const critical_1 = require("../mechanics/critical");
const events_1 = require("../events");
exports.playCards = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield playerInput_1.playersPredictAndPickCards(state);
        exports.readyEffectsAndMechanics(state);
        yield playerInput_1.playersMakeCardChoices(state);
        events_1.newCardEvent(state); //Processes readed effects and mechs
        predict_1.markAxisChanges(state); //This is for predictions
        exports.incrementQueue(state);
        exports.addCardsToQueue(state);
        cardHappens_1.cardHappens(state);
    }
    catch (err) {
        console.log("err", err);
        if (err === errors_1.ControlEnum.PLAY_CARD) {
            console.log('caught and playing card');
            yield exports.playCards(state);
        }
        else {
            throw err;
        }
    }
});
exports.readyEffectsAndMechanics = (state) => {
    state.agents.forEach((_, i) => exports.readyPlayerEffectsAndMechanics(state, i));
};
exports.readyPlayerEffectsAndMechanics = (state, playedBy) => {
    const card = state.pickedCards[playedBy];
    if (card === undefined || card === null) {
        return;
    }
    const { effects = [], mechanics = [], enhancements = [], player, opponent } = card;
    let [criticals, nonCritMechs] = util_1.splitArray(mechanics, (mech) => mech.mechanic === card_1.MechanicEnum.CRITICAL);
    criticals = criticals.filter(mech => critical_1.canUseCritical(mech, playedBy, opponent, state));
    const enhanceEffects = enhance_1.getEnhancementsFromCard(card);
    state.readiedMechanics[playedBy] = [...state.readiedMechanics[playedBy], ...readiedEffects_1.readyMechanics(criticals, card), ...readiedEffects_1.readyMechanics(nonCritMechs, card)];
    state.readiedEffects[playedBy] = [...state.readiedEffects[playedBy], ...readiedEffects_1.readyEffects(effects, card, state), ...readiedEffects_1.readyEffects(enhanceEffects, card, state)];
};
exports.incrementQueue = (state) => {
    const { queue } = state;
    if (!state.incrementedQueue) {
        for (let i = queue.length - 1; i >= 0; i--) {
            queue[i + 1] = queue[i];
        }
        queue[0] = [];
        state.incrementedQueue = true;
    }
};
exports.addCardsToQueue = (state) => {
    state.pickedCards.forEach((card, player) => {
        if (card !== undefined && card !== null) {
            addCardToQueue(card, player, state);
        }
    });
};
const addCardToQueue = (card, player, state) => {
    const { queue } = state;
    const slot = 0;
    state.pickedCards[player] = null;
    queue[slot] = queue[slot] || [];
    queue[slot][player] = queue[slot][player] || [];
    queue[slot][player].push(card);
};
