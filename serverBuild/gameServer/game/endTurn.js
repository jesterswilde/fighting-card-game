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
exports.endTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    exports.cullQueue(state);
    decrementCounters(state);
    clearTurnData(state);
    changePlayers(state);
    socket_1.sendState(state);
    events_1.sendEvents(state);
});
exports.cullQueue = (state) => {
    const { decks, queue } = state;
    if (queue.length > gameSettings_1.QUEUE_LENGTH) {
        const cards = queue.pop();
        cards.forEach((card) => {
            console.log('culling', card.name, card.player);
            if (card.name !== 'Panic') {
                decks[card.player].push(card);
            }
        });
    }
};
const decrementCounters = (state) => {
    const { stateDurations, playerStates } = state;
    stateDurations.forEach((duration, i) => {
        if (duration.balance !== null && duration.balance !== undefined) {
            duration.balance--;
            if (duration.balance <= 0) {
                duration.balance = null;
                playerStates[i].balance = stateInterface_1.BalanceEnum.BALANCED;
            }
        }
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
    const opponent = state.currentPlayer === 0 ? 1 : 0;
    state.damaged = [false, false];
    state.turnIsOver = false;
    state.modifiedAxis = util_1.makeModifiedAxis();
    state.turnIsOver = false;
    state.incrementedQueue = false;
    state.pendingPredictions = state.predictions;
    state.predictions = null;
    state.block[opponent] = 0;
};
const changePlayers = (state) => {
    const player = state.currentPlayer === 0 ? 1 : 0;
    state.currentPlayer = player;
};
