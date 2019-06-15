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
const util_1 = require("../../util");
const card_1 = require("../../../shared/card");
const readiedEffects_1 = require("../readiedEffects");
const socket_1 = require("../../../shared/socket");
/*
    Give up N poise, to gain an effect.
    Forceful is it's own choice, but only shows up if you can pay it.
*/
exports.playerChoosesForce = (player, state) => __awaiter(this, void 0, void 0, function* () {
    const { readiedEffects = [] } = state;
    let playerEffects = readiedEffects[player] || [];
    let [allForcefulArr, unused] = util_1.splitArray(playerEffects, ({ mechanic }) => mechanic.mechanic === card_1.MechanicEnum.FORCEFUL);
    const validForcefulArr = allForcefulArr.filter(({ mechanic }) => state.playerStates[player].poise >= mechanic.amount);
    const readiedArr = [];
    for (let i = 0; i < validForcefulArr.length; i++) {
        const { card: { name: cardName }, mechanic, card } = validForcefulArr[i];
        const socket = state.sockets[player];
        const choseToPlay = yield getForcefulChoice(socket, mechanic, cardName);
        if (choseToPlay) {
            state.playerStates[player].poise -= typeof mechanic.amount === 'number' ? mechanic.amount : 0;
            readiedArr.push({ mechanic, card, isEventOnly: true });
            const readied = readiedEffects_1.mechanicsToReadiedEffects(mechanic.mechanicEffects, card, state);
            readiedArr.push(...readied);
        }
    }
    state.readiedEffects[player] = [...unused, ...readiedArr];
});
const getForcefulChoice = (socket, mechanic, cardName) => {
    return new Promise((res, rej) => {
        socket.emit(socket_1.SocketEnum.GOT_FORCEFUL_CHOICE, { mechanic, cardName });
        socket.once(socket_1.SocketEnum.PICKED_FORCEFUL, (useForecful) => {
            res(useForecful);
        });
    });
};
