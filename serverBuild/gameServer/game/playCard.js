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
const util_1 = require("../util");
const requirements_1 = require("./requirements");
const modifiedAxis_1 = require("./modifiedAxis");
const events_1 = require("./events");
const playerInput_1 = require("./playCards/playerInput");
exports.playCard = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        events_1.addCardEvent(state.pickedCard, state);
        exports.getMechanicsReady(state);
        yield playerInput_1.playerPicksOne(state);
        yield playerInput_1.makePredictions(state);
        yield playerInput_1.CheckForForecful(state);
        exports.markAxisChanges(state);
        exports.incrementQueue(state);
        exports.addCardToQueue(state);
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
    const { optional = [], effects = [] } = state.pickedCard;
    const validOptEff = optional.filter((reqEff) => requirements_1.canUseOptional(reqEff, state.pickedCard.player, state.pickedCard.opponent, state))
        .reduce((effsArr, reqEffs) => {
        effsArr.push(...reqEffs.effects);
        return effsArr;
    }, []);
    const allEffects = [...effects, ...validOptEff];
    state.readiedEffects = exports.mechanicsToReadiedEffects(allEffects, state.pickedCard);
};
exports.mechanicsToReadiedEffects = (mechanics = [], card) => {
    return mechanics.map((mech) => exports.mechanicToReadiedEffect(mech, card));
};
exports.mechanicToReadiedEffect = (mechanic, card) => {
    return { mechanic: util_1.deepCopy(mechanic), card };
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
exports.addCardToQueue = (state) => {
    const { currentPlayer: player, queue } = state;
    const pickedCard = state.pickedCard;
    state.pickedCard = undefined;
    queue[0] = queue[0] || [];
    queue[0].push(pickedCard);
};
exports.markAxisChanges = (state) => {
    if (state.readiedEffects) {
        state.readiedEffects.forEach(({ mechanic, card }) => {
            modifiedAxis_1.markAxisChange(mechanic, card, state);
        });
    }
};
