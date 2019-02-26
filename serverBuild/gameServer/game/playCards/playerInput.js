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
const playCard_1 = require("../playCard");
const socket_1 = require("../../../shared/socket");
const util_1 = require("../../util");
exports.playerPicksOne = (state, { _waitForPlayerToChoose = waitForPlayerToChoose } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { sockets, readiedEffects = [] } = state;
    const pickedEffects = [];
    const unusedEffs = [];
    for (let i = 0; i < readiedEffects.length; i++) {
        const { mechanic: effect, card, isEventOnly } = state.readiedEffects[i];
        if (effect.mechanic === card_1.MechanicEnum.PICK_ONE && !isEventOnly) {
            const player = sockets[card.player];
            const choice = yield _waitForPlayerToChoose(effect.choices, player);
            const picked = effect.choices[choice];
            pickedEffects.push({ mechanic: effect, card, isEventOnly: true });
            pickedEffects.push(...playCard_1.mechanicsToReadiedEffects(picked, card));
            unusedEffs.push(false);
        }
        else {
            unusedEffs.push(true);
        }
    }
    state.readiedEffects = state.readiedEffects.filter((_, i) => unusedEffs[i]);
    state.readiedEffects.push(...pickedEffects);
});
const waitForPlayerToChoose = (choices, player) => {
    return new Promise((res, rej) => {
        player.emit(socket_1.SocketEnum.SHOULD_PICK_ONE, choices);
        player.once(socket_1.SocketEnum.PICKED_ONE, (choice) => {
            res(choice);
        });
    });
};
exports.makePredictions = (state, { _getPredictions = getPredictions } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { readiedEffects = [], sockets } = state;
    for (let i = 0; i < readiedEffects.length; i++) {
        const { mechanic: eff, card, isEventOnly } = readiedEffects[i];
        if (eff.mechanic === card_1.MechanicEnum.PREDICT && !isEventOnly) {
            readiedEffects.push({ mechanic: eff, card, isEventOnly: true });
            const prediction = {};
            const player = sockets[card.player];
            prediction.prediction = yield _getPredictions(state, player);
            prediction.card = card;
            prediction.mechanics = util_1.deepCopy(eff.mechanicEffects);
            state.predictions = state.predictions || [];
            state.predictions.push(prediction);
            console.log('prediction: ', state.predictions);
        }
    }
});
const getPredictions = (state, socket) => {
    console.log('getting predictin');
    return new Promise((res, rej) => {
        const { currentPlayer: player, sockets } = state;
        socket.emit(socket_1.SocketEnum.SHOULD_PREDICT);
        socket.once(socket_1.SocketEnum.MADE_PREDICTION, (prediction) => {
            console.log('gotPrediction');
            res(prediction);
        });
    });
};
exports.checkForForecful = (state) => __awaiter(this, void 0, void 0, function* () {
    console.log('checking forceful');
    const { readiedEffects = [] } = state;
    const options = readiedEffects.filter(({ card: { player }, mechanic: mech, isEventOnly }) => {
        const { poise } = state.playerStates[player];
        return mech.mechanic === card_1.MechanicEnum.FORCEFUL && poise >= mech.amount && !isEventOnly;
    });
    //filter out all readied forecful mechanics
    state.readiedEffects = readiedEffects.filter(({ mechanic: mech }) => mech.mechanic !== card_1.MechanicEnum.FORCEFUL);
    for (let i = 0; i < options.length; i++) {
        const { card: { player, name: cardName }, mechanic, card } = options[i];
        const socket = state.sockets[player];
        const choiceToPlay = yield getForcefulChoice(socket, mechanic, cardName);
        if (choiceToPlay) {
            state.readiedEffects.push({ mechanic, card, isEventOnly: true });
            const readied = playCard_1.mechanicsToReadiedEffects(mechanic.mechanicEffects, card);
            state.playerStates[player].poise -= typeof mechanic.amount === 'number' ? mechanic.amount : 0;
            state.readiedEffects.push(...readied);
        }
    }
});
const getForcefulChoice = (socket, mechanic, cardName) => {
    return new Promise((res, rej) => {
        socket.emit(socket_1.SocketEnum.GOT_FORCEFUL_CHOICE, { mechanic, cardName });
        socket.once(socket_1.SocketEnum.PICKED_FORCEFUL, (useForecful) => {
            res(useForecful);
        });
    });
};
