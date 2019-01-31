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
const applyEffects_1 = require("./applyEffects");
const socket_1 = require("./socket");
const errors_1 = require("../errors");
const util_1 = require("../util");
const requirements_1 = require("./requirements");
const cardInterface_1 = require("../interfaces/cardInterface");
const socket_2 = require("../interfaces/socket");
const modifiedAxis_1 = require("./modifiedAxis");
exports.playCard = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        exports.getMechanicsReady(state);
        yield exports.playerPicksOne(state);
        yield exports.makePredictions(state);
        exports.markAxisChanges(state);
        exports.incrementQueue(state);
        exports.addCardToQueue(state);
        applyEffects_1.applyEffects(state);
        socket_1.sendState(state);
    }
    catch (err) {
        console.log("err", err);
        if (err === errors_1.ControlEnum.PLAY_CARD) {
            console.log('caught and playing card');
            yield exports.playCard(state);
        }
        else {
            throw err;
        }
    }
});
exports.getMechanicsReady = (state) => {
    const { optional = [], effects = [] } = state.pickedCard;
    const validOptEff = optional.filter((reqEff) => requirements_1.canUseOptional(reqEff, state.pickedCard.opponent, state))
        .reduce((effsArr, reqEffs) => {
        effsArr.push(...reqEffs.effects);
        return effsArr;
    }, []);
    state.readiedEffects = [...util_1.deepCopy(effects), ...util_1.deepCopy(validOptEff)];
};
exports.playerPicksOne = (state, { _waitForPlayerToChoose = waitForPlayerToChoose } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { sockets, currentPlayer, readiedEffects = [] } = state;
    const pickedEffects = [];
    const unusedEffs = [];
    const player = sockets[currentPlayer];
    for (let i = 0; i < readiedEffects.length; i++) {
        const effect = state.readiedEffects[i];
        if (effect.mechanic === cardInterface_1.MechanicEnum.PICK_ONE) {
            const choice = yield _waitForPlayerToChoose(effect.choices, player);
            const picked = effect.choices[choice];
            pickedEffects.push(...picked);
            unusedEffs.push(false);
        }
        unusedEffs.push(true);
    }
    state.readiedEffects = state.readiedEffects.filter((_, i) => unusedEffs[i]);
    state.readiedEffects.push(...pickedEffects);
});
const waitForPlayerToChoose = (choices, player) => {
    return new Promise((res, rej) => {
        player.emit(socket_2.SocketEnum.SHOULD_PICK_ONE, choices);
        player.once(socket_2.SocketEnum.PICKED_ONE, (choice) => {
            res(choice);
        });
    });
};
exports.makePredictions = (state, { _getPredictions = getPredictions } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { readiedEffects = [] } = state;
    for (let i = 0; i < readiedEffects.length; i++) {
        const eff = readiedEffects[i];
        if (eff.mechanic === cardInterface_1.MechanicEnum.PREDICT) {
            const prediction = {};
            prediction.prediction = yield _getPredictions(state);
            prediction.mechanics = util_1.deepCopy(eff.mechanicEffects);
            prediction.player = state.currentPlayer;
            state.predictions = state.predictions || [];
            state.predictions.push(prediction);
            console.log('prediction: ', state.predictions);
        }
    }
});
const getPredictions = (state) => {
    console.log('getting predictin');
    return new Promise((res, rej) => {
        const { currentPlayer: player, sockets } = state;
        const socket = sockets[player];
        socket.emit(socket_2.SocketEnum.SHOULD_PREDICT);
        socket.once(socket_2.SocketEnum.MADE_PREDICTION, (prediction) => {
            console.log('gotPrediction');
            res(prediction);
        });
    });
};
exports.incrementQueue = (state) => {
    const { queue } = state;
    if (!state.incrementedQueue) {
        for (let i = queue.length - 1; i >= 0; i--) {
            queue[i + 1] = queue[i];
        }
        queue[0] = [];
        state.incrementedQueue = true;
    }
};
exports.addCardToQueue = (state) => {
    const { currentPlayer: player, queue } = state;
    const pickedCard = state.pickedCard;
    state.pickedCard = undefined;
    queue[0] = queue[0] || [];
    queue[0].push(pickedCard);
};
exports.markAxisChanges = (state) => {
    const card = state.pickedCard;
    if (state.readiedEffects) {
        state.readiedEffects.forEach((mechanic) => {
            modifiedAxis_1.markAxisChange(mechanic, card, state);
        });
    }
};
