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
const card_1 = require("../../../shared/card");
const readiedEffects_1 = require("../readiedEffects");
const socket_1 = require("../../../shared/socket");
/*
    A player is given a few choices by a card, and get to pick only one.
*/
exports.playerPicksOne = (player, state, { _waitForPlayerToChoose = waitForPlayerToChoose } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { sockets } = state;
    const playerEffects = state.readiedEffects[player] || [];
    const pickedEffects = [];
    const unusedEffs = [];
    for (let i = 0; i < playerEffects.length; i++) {
        const { mechanic: effect, card, isEventOnly } = playerEffects[i];
        if (effect.mechanic === card_1.MechanicEnum.PICK_ONE && !isEventOnly) {
            const socket = sockets[player];
            const choice = yield _waitForPlayerToChoose(effect.choices, socket);
            const picked = effect.choices[choice];
            pickedEffects.push({ mechanic: effect, card, isEventOnly: true });
            pickedEffects.push(...readiedEffects_1.mechanicsToReadiedEffects(picked, card, state));
            unusedEffs.push(false);
        }
        else {
            unusedEffs.push(true);
        }
    }
    state.readiedEffects[player] = playerEffects.filter((_, i) => unusedEffs[i]);
    state.readiedEffects[player].push(...pickedEffects);
});
const waitForPlayerToChoose = (choices, player) => {
    return new Promise((res, rej) => {
        player.emit(socket_1.SocketEnum.SHOULD_PICK_ONE, choices);
        player.once(socket_1.SocketEnum.PICKED_ONE, (choice) => {
            res(choice);
        });
    });
};
