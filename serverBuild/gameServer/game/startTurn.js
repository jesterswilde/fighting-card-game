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
const block_1 = require("./mechanics/block");
const poise_1 = require("./mechanics/poise");
const setup_1 = require("./mechanics/setup");
const predict_1 = require("./mechanics/predict");
exports.startTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    console.log('starting turn');
    poise_1.addPoise(state);
    predict_1.movePendingPredictions(state);
    setup_1.moveSetup(state);
    moveHandSizeMod(state);
    block_1.convertBlockToParry(state); //This happens after so that the player will see the upcoming block
});
const moveHandSizeMod = (state) => {
    state.handSizeMod = state.nextHandSizeMod;
    state.nextHandSizeMod = [0, 0];
};
