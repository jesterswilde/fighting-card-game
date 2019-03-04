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
const applyEffects_1 = require("./applyEffects");
const errors_1 = require("../errors");
const requirements_1 = require("./requirements");
const modifiedAxis_1 = require("./modifiedAxis");
const events_1 = require("./events");
const playerInput_1 = require("./playCards/playerInput");
const readiedEffects_1 = require("./readiedEffects");
exports.playCard = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        events_1.addCardEvent(state);
        exports.getMechanicsReady(state);
        yield playerInput_1.playersPickOne(state);
        yield playerInput_1.playersMakePredictions(state);
        yield playerInput_1.playersChooseForce(state);
        exports.markAxisChanges(state);
        exports.incrementQueue(state);
        exports.addCardsToQueue(state);
        applyEffects_1.applyEffects(state);
    }
    catch (err) {
        console.log("err", err);
        if (err === errors_1.ControlEnum.PLAY_CARD) {
            console.log('caught and playing card');
            yield exports.playCard(state);
        }
        else {
            throw err;
        }
    }
});
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
        state.readiedEffects[playedBy] = readiedEffects_1.mechanicsToReadiedEffects(allEffects, card);
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
        addCardToQueue(card, player, state);
    });
};
const addCardToQueue = (card, player, state) => {
    const { queue } = state;
    const slot = 0;
    state.pickedCards[player] = null;
    queue[slot][player] = queue[slot][player] || [];
    queue[slot][player].push(card);
};
exports.markAxisChanges = (state) => {
    if (state.readiedEffects) {
        state.readiedEffects.forEach((playerEffect = []) => {
            playerEffect.forEach(({ mechanic, card }) => {
                modifiedAxis_1.markAxisChange(mechanic, card, state);
            });
        });
    }
};
