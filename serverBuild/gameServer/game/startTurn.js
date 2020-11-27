"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTurn = void 0;
const block_1 = require("./mechanics/block");
const poise_1 = require("./mechanics/poise");
const setup_1 = require("./mechanics/setup");
const predict_1 = require("./mechanics/predict");
exports.startTurn = async (state) => {
    console.log('starting turn');
    poise_1.addPoise(state);
    predict_1.movePendingPredictions(state);
    setup_1.moveSetup(state);
    moveHandSizeMod(state);
    block_1.convertBlockToParry(state); //This happens after so that the player will see the upcoming block
};
const moveHandSizeMod = (state) => {
    state.handSizeMod = state.nextHandSizeMod;
    state.nextHandSizeMod = [0, 0];
};
