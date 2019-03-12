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
const stateInterface_1 = require("../interfaces/stateInterface");
const gameSettings_1 = require("../gameSettings");
const util_1 = require("../util");
const events_1 = require("./events");
const socket_1 = require("./socket");
const queue_1 = require("./queue");
exports.endTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    exports.cullQueue(state);
    decrementCounters(state);
    clearTurnData(state);
    socket_1.sendState(state);
    events_1.sendEvents(state);
    capPoise(state);
    console.log('turn ended');
});
const capPoise = (state) => {
    state.playerStates.forEach((pState) => {
        pState.poise = Math.max(0, pState.poise);
        pState.poise = Math.min(10, pState.poise);
    });
};
exports.cullQueue = (state) => {
    const { decks, queue } = state;
    queue_1.forEachCardInQueue(state, (card, queueIndex) => {
        if (queueIndex >= gameSettings_1.QUEUE_LENGTH && card.name !== "Panic") {
            card.telegraphs = undefined;
            card.focuses = undefined;
            card.shouldReflex = false;
            card.predictions = undefined;
            card.enhancements = undefined;
            decks[card.player].push(card);
        }
    });
    if (state.queue.length > gameSettings_1.QUEUE_LENGTH) {
        queue.pop();
    }
};
const decrementCounters = (state) => {
    const { stateDurations, playerStates } = state;
    stateDurations.forEach((duration, i) => {
        if (duration.motion !== null && duration.motion !== undefined) {
            duration.motion--;
            if (duration.motion <= 0) {
                duration.motion = null;
                playerStates[i].motion = stateInterface_1.MotionEnum.STILL;
            }
        }
        if (duration.standing !== null && duration.standing !== undefined) {
            duration.standing--;
            if (duration.standing <= 0) {
                duration.standing = null;
                playerStates[i].standing = stateInterface_1.StandingEnum.STANDING;
            }
        }
    });
};
const clearTurnData = (state) => {
    state.damaged = state.damaged.map(() => false);
    state.turnIsOver = false;
    state.modifiedAxis = util_1.makeModifiedAxis();
    state.incrementedQueue = false;
    state.parry = state.parry.map(() => 0);
    state.checkedFocus = false;
    state.turnNumber++;
};
