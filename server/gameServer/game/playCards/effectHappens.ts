import { GameState, DistanceEnum, StandingEnum, MotionEnum, PoiseEnum, ReadiedEffect, HappensEnum } from "../../interfaces/stateInterface";
import { MechanicEnum, Mechanic, Card, AxisEnum, PlayerEnum } from "../../../shared/card";
import { getCardByName } from "./getCards";
import { playerEnumToPlayerArray, consolidateMechanics } from "../../util";
import { MAX_POISE, MIN_POISE } from "../../gameSettings";
import { mechanicsToReadiedEffects } from "../readiedEffects";

export const reduceMechanics = (readiedMechanics: ReadiedEffect[], state: GameState) => {
    readiedMechanics.forEach(({ mechanic: mech, card, isEventOnly, isHappening }) => {
        const reducer = mechanicRouter[mech.mechanic];
        if (isEventOnly) return;
        if (reducer !== undefined) {
            reducer(mech, card, card.player, card.opponent, state);
        } else {
            throw "Tried to reduce effect here"
        }
    });
}

const reduceBlock = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const { block } = state;
    block[player] = block[player] || 0;
    if (typeof mechanic.amount === 'number') {
        block[player] += mechanic.amount;
    }
    console.log('block was played', state.block);
}
const reduceBuff = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const effect = card.effects.find(({ mechanic: mechEnum, axis, player, amount }) => {
        return mechanic.axis === axis && player === mechanic.player && mechEnum !== MechanicEnum.BUFF
    })
    if (effect !== undefined && typeof effect.amount === 'number' && typeof mechanic.amount === 'number') {
        effect.amount += mechanic.amount;
    } else {
        card.effects.push({ axis: mechanic.axis, amount: mechanic.amount, player: mechanic.player });
    }
}

const reduceCripple = async (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState, { _getCardByName = getCardByName } = {}) => {
    const { decks } = state;
    const { amount: cardName } = mechanic;
    const deck = decks[opponent];
    if (typeof cardName === 'string') {
        const card = _getCardByName(cardName);
        card.player = opponent;
        card.opponent = player;
        deck.push(card);
    }
}
const reduceFocus = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    card.focuses = card.focuses || [];
    card.focuses.push(mechanic);
}
const reduceLock = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const { lockedState } = state;
    if (mechanic.axis === AxisEnum.DISTANCE) {
        lockedState.distance = getLockMax(lockedState.distance, mechanic.amount);
        return;
    }
    let whoToCheck = playerEnumToPlayerArray(mechanic.player, player, opponent);
    whoToCheck.forEach((player) => {
        switch (mechanic.axis) {
            case (AxisEnum.MOTION):
                lockedState.players[player].motion = getLockMax(lockedState.distance, mechanic.amount);
                break;
            case (AxisEnum.POISE):
                lockedState.players[player].poise = getLockMax(lockedState.distance, mechanic.amount);
                break;
            case (AxisEnum.STANCE):
                lockedState.players[player].stance = getLockMax(lockedState.distance, mechanic.amount);
                break;
            default: return;
        }
    })
}

const getLockMax = (current, next) => {
    if (!next) {
        return current;
    }
    if (current === null) {
        return next;
    }
    return Math.max(next * 2, current);
}

const reducePredict = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    state.pendingPredictions[card.player] = state.pendingPredictions[card.player] || { readiedEffects: [] }
    const reaEffs = mechanicsToReadiedEffects(mechanic.mechanicEffects, card, state); 
    state.pendingPredictions[card.player].readiedEffects.push(...reaEffs)
}
const reduceReflex = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    console.log('marking reflex');
    card.shouldReflex = true;
}
const reduceTelegraph = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    card.telegraphs = card.telegraphs || [];
    card.telegraphs.push(mechanic);
}
const reduceEnhance = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const alterObj = state.tagModification[player];
    const enhanceArr = [...(alterObj[mechanic.amount] || []), ...(mechanic.mechanicEffects || [])];
    alterObj[mechanic.amount] = consolidateMechanics(enhanceArr);
}

export const reduceStateChangeReaEff = (reaEff: ReadiedEffect, state: GameState) => {
    const whoToCheck = reaEff.happensTo.map((value, i) => value === HappensEnum.HAPPENS ? i : null)
        .filter((value) => value !== null);
    reduceStateChange(reaEff.mechanic, reaEff.card, reaEff.card.player, reaEff.card.opponent, state, whoToCheck);
}

const reduceStateChange = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState, appliesTo: number[]) => {
    const applyGlobal = globalAxis[mechanic.axis];
    if (appliesTo.length === 0) {
        return;
    }
    if (applyGlobal !== undefined) {
        applyGlobal(state);
    }
    let amount: number | null;
    if (mechanic.amount !== undefined && mechanic.amount !== null) {
        amount = Number(mechanic.amount)
    } else {
        amount = null;
    }
    const applyPlayerState = playerAxis[mechanic.axis];
    if (applyPlayerState !== undefined && (amount === undefined || !isNaN(amount))) {
        applyPlayerState(appliesTo, amount, state);
    }
}

const mechanicRouter: { [name: string]: (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => void } = {
    [MechanicEnum.BLOCK]: reduceBlock,
    [MechanicEnum.BUFF]: reduceBuff,
    [MechanicEnum.CRIPPLE]: reduceCripple,
    [MechanicEnum.FOCUS]: reduceFocus,
    [MechanicEnum.LOCK]: reduceLock,
    [MechanicEnum.PREDICT]: reducePredict,
    [MechanicEnum.REFLEX]: reduceReflex,
    [MechanicEnum.TELEGRAPH]: reduceTelegraph,
    [MechanicEnum.FORCEFUL]: () => { },
    [MechanicEnum.ENHANCE]: reduceEnhance,
}

const globalAxis: { [axis: string]: (state: GameState) => void } = {
    [AxisEnum.GRAPPLED]: (state: GameState) => state.distance = DistanceEnum.GRAPPLED,
    [AxisEnum.CLOSE]: (state: GameState) => state.distance = DistanceEnum.CLOSE,
    [AxisEnum.FAR]: (state: GameState) => state.distance = DistanceEnum.FAR,
    [AxisEnum.CLOSER]: (state: GameState) => {
        if (state.distance === DistanceEnum.FAR) {
            state.distance = DistanceEnum.CLOSE;
        } else {
            state.distance = DistanceEnum.GRAPPLED;
        }
    },
    [AxisEnum.FURTHER]: (state: GameState) => {
        if (state.distance === DistanceEnum.GRAPPLED) {
            state.distance = DistanceEnum.CLOSE;
        } else {
            state.distance = DistanceEnum.FAR;
        }
    }
}


const playerAxis: { [axis: string]: (players: number[], amount: number, state: GameState) => void } = {
    [AxisEnum.POISE]: (players: number[], amount: number, state: GameState) => players.forEach((i) => {
        const { playerStates, lockedState } = state;
        if (!lockedState.players[i].poise) {
            playerStates[i].poise += amount;
            playerStates[i].poise = Math.min(playerStates[i].poise, MAX_POISE);
        }
    }),
    [AxisEnum.LOSE_POISE]: (players: number[], amount: number, state: GameState) => players.forEach((i) => {
        const { playerStates, lockedState } = state;
        if (!lockedState.players[i].poise) {
            playerStates[i].poise -= amount;
            playerStates[i].poise = Math.max(playerStates[i].poise, MIN_POISE);
        }
    }),
    [AxisEnum.STANDING]: (players: number[], amount: number, state: GameState) => players.forEach((i) => {
        const { stateDurations, playerStates, lockedState } = state;
        if (!lockedState.players[i].stance) {
            stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== StandingEnum.STANDING);
            playerStates[i].standing = StandingEnum.STANDING
        }
    }),
    [AxisEnum.PRONE]: (players: number[], amount: number, state: GameState) => players.forEach((i) => {
        const { stateDurations, playerStates, lockedState } = state;
        if (!lockedState.players[i].stance) {
            stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== StandingEnum.PRONE)
            state.playerStates[i].standing = StandingEnum.PRONE
        }
    }),
    [AxisEnum.STILL]: (players: number[], amount: number, state: GameState) => {
        players.forEach((i) => {
            const { stateDurations, playerStates, lockedState } = state;
            if (!lockedState.players[i].motion) {
                stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== MotionEnum.STILL)
                state.playerStates[i].motion = MotionEnum.STILL
            }
        })
    },
    [AxisEnum.MOVING]: (players: number[], amount: number, state: GameState) => {
        const { stateDurations, playerStates, lockedState } = state;
        players.forEach((i) => {
            if (!lockedState.players[i].motion) {
                stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== MotionEnum.MOVING)
                state.playerStates[i].motion = MotionEnum.MOVING;
            }
        })
    },
    [AxisEnum.DAMAGE]: (players: number[], amount: number, state: GameState) => {
        players.forEach((i) => {
            const parry = state.parry[i];
            if (parry > 0) {
                const remainingDamage = amount - parry;
                if (remainingDamage >= 0) {
                    state.parry[i] = 0;
                    state.health[i] -= remainingDamage;
                } else {
                    state.parry[i] -= amount;
                }
            } else {
                state.health[i] -= amount
            }
        })
        players.forEach((i) => state.damaged[i] = true);
    },
}

const getMaxAmount = (currentAmount: number, nextAmount: number, changed: boolean) => {
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
}