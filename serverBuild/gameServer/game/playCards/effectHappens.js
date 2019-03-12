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
const stateInterface_1 = require("../../interfaces/stateInterface");
const card_1 = require("../../../shared/card");
const getCards_1 = require("./getCards");
const util_1 = require("../../util");
const readiedEffects_1 = require("../readiedEffects");
exports.reduceMechanics = (readiedMechanics, state) => {
    readiedMechanics.forEach(({ mechanic: mech, card, isEventOnly, isHappening }) => {
        const reducer = mechanicRouter[mech.mechanic];
        if (isEventOnly)
            return;
        if (reducer !== undefined) {
            reducer(mech, card, card.player, card.opponent, state);
        }
        else {
            throw "Tried to reduce effect here";
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
        return mechanic.axis === axis && player === mechanic.player && mechEnum !== card_1.MechanicEnum.BUFF;
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
        card.player = opponent;
        card.opponent = player;
        deck.push(card);
    }
});
const reduceFocus = (mechanic, card, player, opponent, state) => {
    card.focuses = card.focuses || [];
    card.focuses.push(mechanic);
};
const reduceLock = (mechanic, card, player, opponent, state) => {
    const { lockedState } = state;
    if (mechanic.axis === card_1.AxisEnum.DISTANCE) {
        lockedState.distance = getLockMax(lockedState.distance, mechanic.amount);
        return;
    }
    let whoToCheck = util_1.playerEnumToPlayerArray(mechanic.player, player, opponent);
    whoToCheck.forEach((player) => {
        switch (mechanic.axis) {
            case (card_1.AxisEnum.MOTION):
                lockedState.players[player].motion = getLockMax(lockedState.distance, mechanic.amount);
                break;
            case (card_1.AxisEnum.POISE):
                lockedState.players[player].poise = getLockMax(lockedState.distance, mechanic.amount);
                break;
            case (card_1.AxisEnum.STANCE):
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
    state.pendingPredictions[card.player] = state.pendingPredictions[card.player] || { readiedEffects: [] };
    const reaEffs = readiedEffects_1.mechanicsToReadiedEffects(mechanic.mechanicEffects, card, state);
    state.pendingPredictions[card.player].readiedEffects.push(...reaEffs);
};
const reduceReflex = (mechanic, card, player, opponent, state) => {
    console.log('marking reflex');
    card.shouldReflex = true;
};
const reduceTelegraph = (mechanic, card, player, opponent, state) => {
    card.telegraphs = card.telegraphs || [];
    card.telegraphs.push(mechanic);
};
const reduceEnhance = (mechanic, card, player, opponent, state) => {
    const alterObj = state.tagModification[player];
    const enhanceArr = [...(alterObj[mechanic.amount] || []), ...(mechanic.mechanicEffects || [])];
    alterObj[mechanic.amount] = util_1.consolidateMechanics(enhanceArr);
};
exports.reduceStateChangeReaEff = (reaEff, state) => {
    const whoToCheck = reaEff.happensTo.map((value, i) => value === stateInterface_1.HappensEnum.HAPPENS ? i : null)
        .filter((value) => value !== null);
    reduceStateChange(reaEff.mechanic, reaEff.card, reaEff.card.player, reaEff.card.opponent, state, whoToCheck);
};
const reduceStateChange = (mechanic, card, player, opponent, state, appliesTo) => {
    const applyGlobal = globalAxis[mechanic.axis];
    if (appliesTo.length === 0) {
        return;
    }
    if (applyGlobal !== undefined) {
        applyGlobal(state);
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
        applyPlayerState(appliesTo, amount, state);
    }
};
const mechanicRouter = {
    [card_1.MechanicEnum.BLOCK]: reduceBlock,
    [card_1.MechanicEnum.BUFF]: reduceBuff,
    [card_1.MechanicEnum.CRIPPLE]: reduceCripple,
    [card_1.MechanicEnum.FOCUS]: reduceFocus,
    [card_1.MechanicEnum.LOCK]: reduceLock,
    [card_1.MechanicEnum.PREDICT]: reducePredict,
    [card_1.MechanicEnum.REFLEX]: reduceReflex,
    [card_1.MechanicEnum.TELEGRAPH]: reduceTelegraph,
    [card_1.MechanicEnum.FORCEFUL]: () => { },
    [card_1.MechanicEnum.ENHANCE]: reduceEnhance,
};
const globalAxis = {
    [card_1.AxisEnum.GRAPPLED]: (state) => state.distance = stateInterface_1.DistanceEnum.GRAPPLED,
    [card_1.AxisEnum.CLOSE]: (state) => state.distance = stateInterface_1.DistanceEnum.CLOSE,
    [card_1.AxisEnum.FAR]: (state) => state.distance = stateInterface_1.DistanceEnum.FAR,
    [card_1.AxisEnum.CLOSER]: (state) => {
        if (state.distance === stateInterface_1.DistanceEnum.FAR) {
            state.distance = stateInterface_1.DistanceEnum.CLOSE;
        }
        else {
            state.distance = stateInterface_1.DistanceEnum.GRAPPLED;
        }
    },
    [card_1.AxisEnum.FURTHER]: (state) => {
        if (state.distance === stateInterface_1.DistanceEnum.GRAPPLED) {
            state.distance = stateInterface_1.DistanceEnum.CLOSE;
        }
        else {
            state.distance = stateInterface_1.DistanceEnum.FAR;
        }
    }
};
const playerAxis = {
    [card_1.AxisEnum.POISE]: (players, amount, state) => players.forEach((i) => {
        const { playerStates } = state;
        playerStates[i].poise += amount;
    }),
    [card_1.AxisEnum.LOSE_POISE]: (players, amount, state) => players.forEach((i) => {
        const { playerStates } = state;
        playerStates[i].poise -= amount;
    }),
    [card_1.AxisEnum.STANDING]: (players, amount, state) => players.forEach((i) => {
        const { stateDurations, playerStates, lockedState } = state;
        if (!lockedState.players[i].stance) {
            stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== stateInterface_1.StandingEnum.STANDING);
            playerStates[i].standing = stateInterface_1.StandingEnum.STANDING;
        }
    }),
    [card_1.AxisEnum.PRONE]: (players, amount, state) => players.forEach((i) => {
        const { stateDurations, playerStates, lockedState } = state;
        if (!lockedState.players[i].stance) {
            stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== stateInterface_1.StandingEnum.PRONE);
            state.playerStates[i].standing = stateInterface_1.StandingEnum.PRONE;
        }
    }),
    [card_1.AxisEnum.STILL]: (players, amount, state) => {
        players.forEach((i) => {
            const { stateDurations, playerStates, lockedState } = state;
            if (!lockedState.players[i].motion) {
                stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== stateInterface_1.MotionEnum.STILL);
                state.playerStates[i].motion = stateInterface_1.MotionEnum.STILL;
            }
        });
    },
    [card_1.AxisEnum.MOVING]: (players, amount, state) => {
        const { stateDurations, playerStates, lockedState } = state;
        players.forEach((i) => {
            if (!lockedState.players[i].motion) {
                stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== stateInterface_1.MotionEnum.MOVING);
                state.playerStates[i].motion = stateInterface_1.MotionEnum.MOVING;
            }
        });
    },
    [card_1.AxisEnum.DAMAGE]: (players, amount, state) => {
        players.forEach((i) => {
            const parry = state.parry[i];
            if (parry > 0) {
                const remainingDamage = amount - parry;
                if (remainingDamage >= 0) {
                    state.parry[i] = 0;
                    state.health[i] -= remainingDamage;
                }
                else {
                    state.parry[i] -= amount;
                }
            }
            else {
                state.health[i] -= amount;
            }
        });
    },
};
const getMaxAmount = (currentAmount, nextAmount, changed) => {
    //The *2 is a hack for decrement counters
    if (nextAmount === null) {
        return null;
    }
    if (changed) {
        return nextAmount;
    }
    if (currentAmount === null) {
        return null;
    }
    return Math.max(currentAmount, nextAmount);
};
