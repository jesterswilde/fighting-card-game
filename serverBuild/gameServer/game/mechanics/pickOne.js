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
const util_1 = require("../../util");
/*
    A player is given a few choices by a card, and get to pick only one.
*/
exports.playerPicksOne = (player, state) => __awaiter(this, void 0, void 0, function* () {
    const { agents } = state;
    const card = state.pickedCards[player];
    const [pickedOne, unused] = util_1.splitArray(state.readiedMechanics[player], (reaMech => reaMech.mechanic.mechanic === card_1.MechanicEnum.PICK_ONE));
    const pickedEffects = [];
    for (let i = 0; i < pickedOne.length; i++) {
        const { mechanic, card, } = pickedOne[i];
        const choice = yield agents[player].getPickOneChoice(card.name, mechanic.index);
        const picked = mechanic.choices[choice];
        pickedEffects.push(...picked);
    }
    state.readiedMechanics[player] = unused;
    state.readiedEffects[player] = [...state.readiedEffects[player], ...readiedEffects_1.readyEffects(pickedEffects, card, state)];
});
