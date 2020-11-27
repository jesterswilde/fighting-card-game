"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerAxis = exports.globalAxis = void 0;
const stateInterface_1 = require("../../interfaces/stateInterface");
const card_1 = require("../../../shared/card");
exports.globalAxis = {
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
exports.playerAxis = {
    [card_1.AxisEnum.POISE]: (players, amount, state) => players.forEach((i) => {
        const { playerStates } = state;
        playerStates[i].poise += amount;
    }),
    [card_1.AxisEnum.LOSE_POISE]: (players, amount, state) => players.forEach((i) => {
        const { playerStates } = state;
        playerStates[i].poise -= amount;
    }),
    [card_1.AxisEnum.STANDING]: (players, amount, state) => players.forEach((i) => {
        const { stateDurations, playerStates } = state;
        stateDurations[i].standing = null;
        playerStates[i].standing = stateInterface_1.StandingEnum.STANDING;
    }),
    [card_1.AxisEnum.PRONE]: (players, amount, state) => players.forEach((i) => {
        const { stateDurations, playerStates } = state;
        stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== stateInterface_1.StandingEnum.PRONE);
        state.playerStates[i].standing = stateInterface_1.StandingEnum.PRONE;
    }),
    [card_1.AxisEnum.STILL]: (players, amount, state) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => {
            stateDurations[i].motion = null;
            state.playerStates[i].motion = stateInterface_1.MotionEnum.STILL;
        });
    },
    [card_1.AxisEnum.MOVING]: (players, amount, state) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => {
            stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== stateInterface_1.MotionEnum.MOVING);
            state.playerStates[i].motion = stateInterface_1.MotionEnum.MOVING;
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
