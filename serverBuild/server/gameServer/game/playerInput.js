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
const socket_1 = require("../../../shared/socket");
const util_1 = require("../../util");
const readiedEffects_1 = require("../readiedEffects");
exports.playersPickCards = (state) => __awaiter(this, void 0, void 0, function* () {
    const promiseArr = state.sockets.map((_, player) => {
        return playerPicksCard(player, state);
    });
    return Promise.all(promiseArr);
});
const playerPicksCard = (player, state) => __awaiter(this, void 0, void 0, function* () {
    const { sockets } = state;
    const opponent = util_1.getOpponent(player);
    return new Promise((res, rej) => {
        sockets[player].once(socket_1.SocketEnum.PICKED_CARD, (index) => {
            exports.pickCard(player, index, state);
            sockets[opponent].emit(socket_1.SocketEnum.OPPONENT_PICKED_CARDS);
            res();
        });
    });
});
exports.pickCard = (player, cardNumber, state) => {
    const { hands, decks } = state;
    const card = hands[player][cardNumber];
    const unusedCards = hands[player].filter((_, i) => i !== cardNumber);
    decks[player].push(...unusedCards);
    hands[player] = [];
    card.opponent = util_1.getOpponent(player);
    state.pickedCards[player] = card;
};
exports.playersPickOne = (state) => {
    const promiseArr = state.readiedEffects.map((_, player) => {
        return playerPicksOne(state, player);
    });
    return Promise.all(promiseArr);
};
const playerPicksOne = (state, player, { _waitForPlayerToChoose = waitForPlayerToChoose } = {}) => __awaiter(this, void 0, void 0, function* () {
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
            pickedEffects.push(...readiedEffects_1.mechanicsToReadiedEffects(picked, card));
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
exports.playersMakePredictions = (state) => {
    const promiseArr = state.readiedEffects.map((_, player) => {
        return makePredictions(player, state);
    });
    return Promise.all(promiseArr);
};
const makePredictions = (player, state, { _getPredictions = getPredictions } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { readiedEffects = [], sockets } = state;
    const playerEffects = readiedEffects[player] || [];
    for (let i = 0; i < playerEffects.length; i++) {
        const { mechanic: eff, card, isEventOnly } = playerEffects[i];
        if (eff.mechanic === card_1.MechanicEnum.PREDICT && !isEventOnly) {
            playerEffects.push({ mechanic: eff, card, isEventOnly: true });
            const prediction = {};
            const socket = sockets[player];
            prediction.prediction = yield _getPredictions(state, socket);
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
        socket.emit(socket_1.SocketEnum.SHOULD_PREDICT);
        socket.once(socket_1.SocketEnum.MADE_PREDICTION, (prediction) => {
            console.log('gotPrediction');
            res(prediction);
        });
    });
};
exports.playersChooseForce = (state) => {
    const promiseArr = state.readiedEffects.map((_, player) => {
        return playerChoosesForce(player, state);
    });
    return Promise.all(promiseArr);
};
const playerChoosesForce = (player, state) => __awaiter(this, void 0, void 0, function* () {
    console.log('checking forceful');
    const { readiedEffects = [] } = state;
    let playerEffects = readiedEffects[player] || [];
    const options = playerEffects.filter(({ card: { player }, mechanic: mech, isEventOnly }) => {
        const { poise } = state.playerStates[player];
        return mech.mechanic === card_1.MechanicEnum.FORCEFUL && poise >= mech.amount && !isEventOnly;
    });
    //filter out all readied forecful mechanics
    playerEffects = playerEffects.filter(({ mechanic: mech }) => mech.mechanic !== card_1.MechanicEnum.FORCEFUL);
    for (let i = 0; i < options.length; i++) {
        const { card: { name: cardName }, mechanic, card } = options[i];
        const socket = state.sockets[player];
        const choiceToPlay = yield getForcefulChoice(socket, mechanic, cardName);
        if (choiceToPlay) {
            playerEffects.push({ mechanic, card, isEventOnly: true });
            const readied = readiedEffects_1.mechanicsToReadiedEffects(mechanic.mechanicEffects, card);
            state.playerStates[player].poise -= typeof mechanic.amount === 'number' ? mechanic.amount : 0;
            playerEffects.push(...readied);
        }
    }
    state.readiedEffects[player] = playerEffects;
});
const getForcefulChoice = (socket, mechanic, cardName) => {
    return new Promise((res, rej) => {
        socket.emit(socket_1.SocketEnum.GOT_FORCEFUL_CHOICE, { mechanic, cardName });
        socket.once(socket_1.SocketEnum.PICKED_FORCEFUL, (useForecful) => {
            res(useForecful);
        });
    });
};
