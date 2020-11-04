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
const gameSettings_1 = require("../gameSettings");
const block_1 = require("./mechanics/block");
exports.startTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    console.log('starting turn');
    exports.addPoise(state);
    movePendingPredictions(state);
    exports.moveSetup(state);
    moveHandSizeMod(state);
    block_1.convertBlockToParry(state); //This happens after so that the player will see the upcoming block
});
const moveHandSizeMod = (state) => {
    state.handSizeMod = state.nextHandSizeMod;
    state.nextHandSizeMod = [0, 0];
};
const movePendingPredictions = (state) => {
    state.predictions = state.pendingPredictions;
    state.pendingPredictions = [];
};
exports.addPoise = (state) => {
    const { playerStates } = state;
    playerStates.forEach((pState) => {
        if (state.turnNumber !== 0 && pState.poise < gameSettings_1.ANTICIPATING_POISE - 1) {
            pState.poise++;
        }
    });
};
exports.moveSetup = (state) => {
    state.setup = state.pendingSetup;
    state.pendingSetup = state.pendingSetup.map(() => 0);
};
