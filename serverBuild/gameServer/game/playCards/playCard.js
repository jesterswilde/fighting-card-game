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
const requirements_1 = require("./requirements");
const readiedEffects_1 = require("../readiedEffects");
const playerInput_1 = require("./playerInput");
const events_1 = require("../events");
const predictions_1 = require("./predictions");
exports.playCards = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield playerInput_1.playersMakeChoices(state);
        events_1.processPlayedCardEvents(state);
        predictions_1.markAxisChanges(state);
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
exports.getPlayerMechanicsReady = (playedBy, state) => {
    const card = state.pickedCards[playedBy];
    if (card === undefined || card === null) {
        return;
    }
    const { optional = [], effects = [], enhancements = [], player, opponent } = card;
    const validOptEff = optional.filter((reqEff) => requirements_1.canUseOptional(reqEff, player, opponent, state))
        .reduce((effsArr, reqEffs) => {
        effsArr.push(...reqEffs.effects);
        return effsArr;
    }, []);
    const enhanceEffs = enhancements.reduce((effs, { mechanics = [] }) => {
        effs.push(...mechanics);
        return effs;
    }, []);
    const allEffects = [...effects, ...validOptEff, ...enhanceEffs];
    state.readiedEffects[playedBy] = [...state.readiedEffects[playedBy], ...readiedEffects_1.mechanicsToReadiedEffects(allEffects, card, state)];
};
exports.getMechanicsReady = (state) => {
    state.pickedCards.forEach((card, playedBy) => {
        const { optional = [], effects = [], enhancements = [], player, opponent } = card;
        const validOptEff = optional.filter((reqEff) => requirements_1.canUseOptional(reqEff, player, opponent, state))
            .reduce((effsArr, reqEffs) => {
            effsArr.push(...reqEffs.effects);
            return effsArr;
        }, []);
        const enhanceEffs = enhancements.reduce((effs, { mechanics = [] }) => {
            effs.push(...mechanics);
            return effs;
        }, []);
        const allEffects = [...effects, ...validOptEff, ...enhanceEffs];
        state.readiedEffects[playedBy] = readiedEffects_1.mechanicsToReadiedEffects(allEffects, card, state);
    });
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
