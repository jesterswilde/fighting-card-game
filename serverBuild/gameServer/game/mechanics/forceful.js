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
const events_1 = require("../events");
/*
    Give up N poise, to gain an effect.
    Forceful is it's own choice, but only shows up if you can pay it.
*/
exports.playerChoosesForce = (player, state) => __awaiter(this, void 0, void 0, function* () {
    const { readiedMechanics = [] } = state;
    let readiedMechs = readiedMechanics[player] || [];
    let [forcefulMechs, unused] = util_1.splitArray(readiedMechs, ({ mechanic }) => mechanic.mechanic === card_1.MechanicEnum.FORCEFUL);
    const validForcefulArr = forcefulMechs.filter(({ mechanic }) => state.playerStates[player].poise >= mechanic.amount);
    let readiedEffs = [];
    for (let i = 0; i < validForcefulArr.length; i++) {
        const { card: { name: cardName }, mechanic, card, } = validForcefulArr[i];
        console.log("Sending forceful question");
        const choseToPlay = yield state.agents[player].getUsedForceful({ cardName, index: mechanic.index });
        console.log("Did choose to play: ", choseToPlay);
        if (choseToPlay) {
            state.playerStates[player].poise -= mechanic.amount;
            readiedEffs.push(...readiedEffects_1.makeReadyEffects(mechanic.effects, card));
            events_1.addDisplayEvent("Forceful", player, state);
            events_1.makeEventsFromReadied(state);
        }
    }
    state.readiedEffects[player].push(...readiedEffs);
    state.readiedMechanics[player] = [...unused];
});
