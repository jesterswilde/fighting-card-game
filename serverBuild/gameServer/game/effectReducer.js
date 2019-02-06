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
const util_1 = require("../util");
exports.reduceMechanics = (readiedMechanics, state) => {
    readiedMechanics.forEach(({ mechanic: mech, card }) => {
        const reducer = mechanicRouter[mech.mechanic];
        if (reducer !== undefined) {
            reducer(mech, card, card.player, card.opponent, state);
        }
        else {
            reduceStateChange(mech, card, card.player, card.opponent, state);
        }
    });
};
const reduceBlock = (mechanic, card, player, opponent, state) => {
    const { block } = state;
    block[player] = block[player] || 0;
    if (typeof mechanic.amount === 'number') {
        block[player] += mechanic.amount;
    }
    console.log('block was played', state.block);
};
const reduceBuff = (mechanic, card, player, opponent, state) => {
    const effect = card.effects.find(({ mechanic: mechEnum, axis, player, amount }) => {
        return mechanic.axis === axis && player === mechanic.player && mechEnum !== cardInterface_1.MechanicEnum.BUFF;
    });
    if (effect !== undefined && typeof effect.amount === 'number' && typeof mechanic.amount === 'number') {
        effect.amount += mechanic.amount;
    }
    else {
        card.effects.push({ axis: mechanic.axis, amount: mechanic.amount, player: mechanic.player });
    }
};
const reduceCripple = (mechanic, card, player, opponent, state, { _getCardByName = getCards_1.getCardByName } = {}) => __awaiter(this, void 0, void 0, function* () {
    const { decks } = state;
    const { amount: cardName } = mechanic;
    const deck = decks[opponent];
    if (typeof cardName === 'string') {
        const card = _getCardByName(cardName);
        deck.push(card);
    }
});
const reduceFocus = (mechanic, card, player, opponent, state) => {
    card.focuses = card.focuses || [];
    card.focuses.push(mechanic);
};
const reduceLock = (mechanic, card, player, opponent, state) => {
    const { lockedState } = state;
    if (mechanic.axis === cardInterface_1.AxisEnum.DISTANCE) {
        lockedState.distance = getLockMax(lockedState.distance, mechanic.amount);
        return;
    }
    let whoToCheck = util_1.playerEnumToPlayerArray(mechanic.player, player, opponent);
    whoToCheck.forEach((player) => {
        switch (mechanic.axis) {
            case (cardInterface_1.AxisEnum.MOTION):
                lockedState.players[player].motion = getLockMax(lockedState.distance, mechanic.amount);
                break;
            case (cardInterface_1.AxisEnum.POISE):
                lockedState.players[player].poise = getLockMax(lockedState.distance, mechanic.amount);
                break;
            case (cardInterface_1.AxisEnum.STANCE):
                lockedState.players[player].stance = getLockMax(lockedState.distance, mechanic.amount);
                break;
            default: return;
        }
    });
};
const getLockMax = (current, next) => {
    if (!next) {
        return current;
    }
    if (current === null) {
        return next;
    }
    return Math.max(next * 2, current);
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
    let whoToCheck = util_1.playerEnumToPlayerArray(mechanic.player, player, opponent);
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
    [cardInterface_1.AxisEnum.CLOSER]: (state) => {
        if (state.distance === stateInterface_1.DistanceEnum.FAR) {
            state.distance = stateInterface_1.DistanceEnum.CLOSE;
        }
        else {
            state.distance = stateInterface_1.DistanceEnum.GRAPPLED;
        }
    },
    [cardInterface_1.AxisEnum.FURTHER]: (state) => {
        if (state.distance === stateInterface_1.DistanceEnum.GRAPPLED) {
            state.distance = stateInterface_1.DistanceEnum.CLOSE;
        }
        else {
            state.distance = stateInterface_1.DistanceEnum.FAR;
        }
    }
};
const playerAxis = {
    [cardInterface_1.AxisEnum.STANDING]: (players, amount, state) => players.forEach((i) => {
        const { stateDurations, playerStates, lockedState } = state;
        if (!lockedState.players[i].stance) {
            stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== stateInterface_1.StandingEnum.STANDING);
            playerStates[i].standing = stateInterface_1.StandingEnum.STANDING;
        }
    }),
    [cardInterface_1.AxisEnum.PRONE]: (players, amount, state) => players.forEach((i) => {
        const { stateDurations, playerStates, lockedState } = state;
        if (!lockedState.players[i].stance) {
            stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== stateInterface_1.StandingEnum.PRONE);
            state.playerStates[i].standing = stateInterface_1.StandingEnum.PRONE;
        }
    }),
    [cardInterface_1.AxisEnum.STILL]: (players, amount, state) => {
        players.forEach((i) => {
            const { stateDurations, playerStates, lockedState } = state;
            if (!lockedState.players[i].motion) {
                stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== stateInterface_1.MotionEnum.STILL);
                state.playerStates[i].motion = stateInterface_1.MotionEnum.STILL;
            }
        });
    },
    [cardInterface_1.AxisEnum.MOVING]: (players, amount, state) => {
        const { stateDurations, playerStates, lockedState } = state;
        players.forEach((i) => {
            if (!lockedState.players[i].motion) {
                stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== stateInterface_1.MotionEnum.MOVING);
                state.playerStates[i].motion = stateInterface_1.MotionEnum.MOVING;
            }
        });
    },
    [cardInterface_1.AxisEnum.BALANCED]: (players, amount, state) => {
        const { stateDurations, playerStates, lockedState } = state;
        players.forEach((i) => {
            if (!state.lockedState.players[i].poise || state.playerStates[i].balance !== stateInterface_1.BalanceEnum.ANTICIPATING) {
                stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== stateInterface_1.BalanceEnum.BALANCED);
                state.playerStates[i].balance = stateInterface_1.BalanceEnum.BALANCED;
            }
        });
    },
    [cardInterface_1.AxisEnum.ANTICIPATING]: (players, amount, state) => {
        const { stateDurations, playerStates, lockedState } = state;
        players.forEach((i) => {
            if (!lockedState.players[i].poise) {
                stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== stateInterface_1.BalanceEnum.ANTICIPATING);
                state.playerStates[i].balance = stateInterface_1.BalanceEnum.ANTICIPATING;
            }
        });
    },
    [cardInterface_1.AxisEnum.UNBALANCED]: (players, amount, state) => {
        const { stateDurations, playerStates, lockedState } = state;
        players.forEach((i) => {
            if (!lockedState.players[i].poise) {
                stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== stateInterface_1.BalanceEnum.UNBALANCED);
                playerStates[i].balance = stateInterface_1.BalanceEnum.UNBALANCED;
            }
        });
    },
    [cardInterface_1.AxisEnum.DAMAGE]: (players, amount, state) => {
        players.forEach((i) => {
            const block = state.block[i];
            if (block > 0) {
                const remaining = amount - block;
                if (remaining >= 0) {
                    state.block[i] = 0;
                    state.health[i] -= remaining;
                }
                else {
                    state.block[i] = -remaining;
                }
            }
            else {
                state.health[i] -= amount;
            }
        });
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
