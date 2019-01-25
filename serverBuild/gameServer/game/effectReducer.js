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
const stateInterface_1 = require("../interfaces/stateInterface");
const cardInterface_1 = require("../interfaces/cardInterface");
const getCards_1 = require("./getCards");
exports.reduceMechanics = (mechanics, card, player, opponent, state) => {
    mechanics.forEach((mech) => {
        const reducer = mechanicRouter[mech.mechanic];
        if (reducer !== undefined) {
            reducer(mech, card, player, opponent, state);
        }
        else {
            reduceStateChange(mech, card, player, opponent, state);
        }
    });
};
const reduceBlock = (mechanic, card, player, opponent, state) => {
    const { block } = state;
    block[player] = block[player] || 0;
    if (typeof mechanic.amount === 'number') {
        block[player] += mechanic.amount;
    }
};
const reduceBuff = (mechanic, card, player, opponent, state) => {
};
const reduceCripple = (mechanic, card, player, opponent, state, { _getCardByName = getCards_1.getCardByName } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { decks } = state;
    const { amount } = mechanic;
    const deck = decks[opponent];
    if (typeof amount === 'string') {
        const card = _getCardByName(amount);
        deck.push(card);
    }
});
const reduceFocus = (mechanic, card, player, opponent, state) => {
    card.focuses = card.focuses || [];
    card.focuses.push(mechanic);
};
const reduceLock = (mechanic, card, player, opponent, state) => {
};
const reducePredict = (mechanic, card, player, opponent, state) => {
    card.predictions = card.predictions || [];
    card.predictions.push(mechanic);
};
const reduceReflex = (mechanic, card, player, opponent, state) => {
    card.shouldReflex = true;
};
const reduceTelegraph = (mechanic, card, player, opponent, state) => {
    card.telegraphs = card.telegraphs || [];
    card.telegraphs.push(mechanic);
};
const reduceStateChange = (mechanic, card, player, opponent, state) => {
    const applyGlobal = globalAxis[mechanic.axis];
    if (applyGlobal !== undefined) {
        applyGlobal(state);
    }
    let whoToCheck;
    if (mechanic.player === cardInterface_1.PlayerEnum.PLAYER) {
        whoToCheck = [player];
    }
    else if (mechanic.player === cardInterface_1.PlayerEnum.OPPONENT) {
        whoToCheck = [opponent];
    }
    else {
        whoToCheck = [player, opponent];
    }
    let amount;
    if (mechanic.amount !== undefined && mechanic.amount !== null) {
        amount = Number(mechanic.amount);
    }
    else {
        amount = null;
    }
    const applyPlayerState = playerAxis[mechanic.axis];
    if (applyPlayerState !== undefined && (amount === undefined || !isNaN(amount))) {
        applyPlayerState(whoToCheck, amount, state);
    }
};
const mechanicRouter = {
    [cardInterface_1.MechanicEnum.BLOCK]: reduceBlock,
    [cardInterface_1.MechanicEnum.BUFF]: reduceBuff,
    [cardInterface_1.MechanicEnum.CRIPPLE]: reduceCripple,
    [cardInterface_1.MechanicEnum.FOCUS]: reduceFocus,
    [cardInterface_1.MechanicEnum.LOCK]: reduceLock,
    [cardInterface_1.MechanicEnum.PREDICT]: reducePredict,
    [cardInterface_1.MechanicEnum.REFLEX]: reduceReflex,
    [cardInterface_1.MechanicEnum.TELEGRAPH]: reduceTelegraph
};
const globalAxis = {
    [cardInterface_1.AxisEnum.GRAPPLED]: (state) => state.distance = stateInterface_1.DistanceEnum.GRAPPLED,
    [cardInterface_1.AxisEnum.CLOSE]: (state) => state.distance = stateInterface_1.DistanceEnum.CLOSE,
    [cardInterface_1.AxisEnum.FAR]: (state) => state.distance = stateInterface_1.DistanceEnum.FAR,
};
const playerAxis = {
    [cardInterface_1.AxisEnum.STANDING]: (players, amount, state) => players.forEach((i) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== stateInterface_1.StandingEnum.STANDING));
        state.playerStates[i].standing = stateInterface_1.StandingEnum.STANDING;
    }),
    [cardInterface_1.AxisEnum.PRONE]: (players, amount, state) => players.forEach((i) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== stateInterface_1.StandingEnum.STANDING));
        state.playerStates[i].standing = stateInterface_1.StandingEnum.PRONE;
    }),
    [cardInterface_1.AxisEnum.STILL]: (players, amount, state) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== stateInterface_1.MotionEnum.STILL));
        players.forEach((i) => state.playerStates[i].motion = stateInterface_1.MotionEnum.STILL);
    },
    [cardInterface_1.AxisEnum.MOVING]: (players, amount, state) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== stateInterface_1.MotionEnum.MOVING));
        players.forEach((i) => state.playerStates[i].motion = stateInterface_1.MotionEnum.MOVING);
    },
    [cardInterface_1.AxisEnum.BALANCED]: (players, amount, state) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => {
            if (state.playerStates[i].balance !== stateInterface_1.BalanceEnum.ANTICIPATING) {
                stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== stateInterface_1.BalanceEnum.BALANCED);
                state.playerStates[i].balance = stateInterface_1.BalanceEnum.BALANCED;
            }
        });
    },
    [cardInterface_1.AxisEnum.ANTICIPATING]: (players, amount, state) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== stateInterface_1.BalanceEnum.ANTICIPATING));
        players.forEach((i) => state.playerStates[i].balance = stateInterface_1.BalanceEnum.ANTICIPATING);
    },
    [cardInterface_1.AxisEnum.UNBALANCED]: (players, amount, state) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== stateInterface_1.BalanceEnum.UNBALANCED));
        players.forEach((i) => playerStates[i].balance = stateInterface_1.BalanceEnum.UNBALANCED);
    },
    [cardInterface_1.AxisEnum.DAMAGE]: (players, amount, state) => {
        players.forEach((i) => state.health[i] -= amount);
        players.forEach((i) => state.damaged[i] = true);
    },
};
const getMaxAmount = (currentAmount, nextAmount, changed) => {
    //The *2 is a hack for decrement counters
    if (changed) {
        return nextAmount * 2;
    }
    if (currentAmount === null || nextAmount === null) {
        return null;
    }
    return Math.max(currentAmount, nextAmount * 2);
};
