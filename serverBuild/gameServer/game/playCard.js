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
const cardHappens_1 = require("./playCards/cardHappens");
const errors_1 = require("../errors");
const card_1 = require("../../shared/card");
const readiedEffects_1 = require("./readiedEffects");
const playerInput_1 = require("./playCards/playerInput");
const predict_1 = require("./mechanics/predict");
const enhance_1 = require("./mechanics/enhance");
const util_1 = require("../util");
const critical_1 = require("./mechanics/critical");
const events_1 = require("./events");
const drawCards_1 = require("./drawCards");
const buff_1 = require("./mechanics/buff");
exports.playCards = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        console.log("Playing card");
        yield playerInput_1.playersMakePredictions(state);
        drawCards_1.givePlayersCards(state);
        yield playerInput_1.playersPickCards(state);
        exports.readyEffectsAndMechanics(state);
        events_1.newCardEvent(state); //Processes readed effects and mechs
        events_1.makeEventsFromReadied(state);
        yield playerInput_1.playersMakeCardChoices(state);
        predict_1.markAxisChanges(state); //This is for predictions
        exports.incrementQueue(state);
        exports.addCardsToQueue(state);
        cardHappens_1.cardHappens(state);
    }
    catch (err) {
        console.log("err", err);
        if (err === errors_1.ControlEnum.PLAY_CARD) {
            console.log("caught and playing card");
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
    const { effects = [], mechanics = [], } = card;
    const [crits, nonCritMechs] = util_1.splitArray(mechanics, (mech) => mech.mechanic === card_1.MechanicEnum.CRITICAL);
    state.readiedMechanics[playedBy] = [
        ...state.readiedMechanics[playedBy],
        ...readiedEffects_1.makeReadyMechanics(nonCritMechs, card),
    ];
    const enhanceEffects = enhance_1.makeEffectsFromEnhance(card);
    const buffEffects = buff_1.makeEffectsFromBuff(card);
    const critEffects = critical_1.getEffectsFromCrits(crits);
    state.readiedEffects[playedBy] = [
        ...state.readiedEffects[playedBy],
        ...readiedEffects_1.makeReadyEffects(effects, card),
        ...readiedEffects_1.makeReadyEffects(enhanceEffects, card),
        ...readiedEffects_1.makeReadyEffects(critEffects, card),
        ...readiedEffects_1.makeReadyEffects(buffEffects, card),
    ];
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
