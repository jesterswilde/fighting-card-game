import { GameState, DistanceEnum, StandingEnum, MotionEnum, BalanceEnum } from "../interfaces/stateInterface";
import { MechanicEnum, Mechanic, Card, AxisEnum, PlayerEnum } from "../interfaces/cardInterface";
import { getCardByName } from "./getCards";
import { playerEnumToPlayerArray } from "../util";

export const reduceMechanics = (mechanics: Mechanic[], card: Card, player: number, opponent: number, state: GameState) => {
    mechanics.forEach((mech) => {
        const reducer = mechanicRouter[mech.mechanic];
        if (reducer !== undefined) {
            reducer(mech, card, player, opponent, state);
        } else {
            reduceStateChange(mech, card, player, opponent, state);
        }
    });
}

const reduceBlock = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const { block } = state;
    block[player] = block[player] || 0;
    if (typeof mechanic.amount === 'number') {
        block[player] += mechanic.amount;
    }
}
const reduceBuff = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const effect = card.effects.find(({mechanic: mechEnum, axis, player, amount})=>{
        return mechanic.axis === axis && player === mechanic.player && mechEnum !== MechanicEnum.BUFF
    })
    if(effect !== undefined && typeof effect.amount === 'number' && typeof mechanic.amount === 'number'){
        effect.amount += mechanic.amount; 
    }else{
        card.effects.push({axis: mechanic.axis, amount: mechanic.amount, player: mechanic.player});
    }
}

const reduceCripple = async (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState, { _getCardByName = getCardByName } = {}) => {
    const { decks } = state;
    const { amount } = mechanic;
    const deck = decks[opponent];
    if (typeof amount === 'string') {
        const card = _getCardByName(amount);
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
    card.predictions = card.predictions || [];
    card.predictions.push(mechanic);
}
const reduceReflex = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    card.shouldReflex = true;
}
const reduceTelegraph = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    card.telegraphs = card.telegraphs || [];
    card.telegraphs.push(mechanic);
}

const reduceStateChange = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const applyGlobal = globalAxis[mechanic.axis];
    if (applyGlobal !== undefined) {
        applyGlobal(state);
    }
    let whoToCheck = playerEnumToPlayerArray(mechanic.player, player, opponent);
    let amount: number | null;
    if (mechanic.amount !== undefined && mechanic.amount !== null) {
        amount = Number(mechanic.amount)
    } else {
        amount = null;
    }
    const applyPlayerState = playerAxis[mechanic.axis];
    if (applyPlayerState !== undefined && (amount === undefined || !isNaN(amount))) {
        applyPlayerState(whoToCheck, amount, state);
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
    [MechanicEnum.TELEGRAPH]: reduceTelegraph
}

const globalAxis: { [axis: string]: (state: GameState) => void } = {
    [AxisEnum.GRAPPLED]: (state: GameState) => state.distance = DistanceEnum.GRAPPLED,
    [AxisEnum.CLOSE]: (state: GameState) => state.distance = DistanceEnum.CLOSE,
    [AxisEnum.FAR]: (state: GameState) => state.distance = DistanceEnum.FAR,
}


const playerAxis: { [axis: string]: (players: number[], amount: number, state: GameState) => void } = {
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
            stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== StandingEnum.STANDING)
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
    [AxisEnum.BALANCED]: (players: number[], amount: number, state: GameState) => {
        const { stateDurations, playerStates, lockedState } = state;
        players.forEach((i) => {
            if (!state.lockedState.players[i].poise ||state.playerStates[i].balance !== BalanceEnum.ANTICIPATING) {
                stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== BalanceEnum.BALANCED)
                state.playerStates[i].balance = BalanceEnum.BALANCED
            }
        })
    },
    [AxisEnum.ANTICIPATING]: (players: number[], amount: number, state: GameState) => {
        const { stateDurations, playerStates, lockedState } = state;
        players.forEach((i)=>{
            if(!lockedState.players[i].poise){
                stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== BalanceEnum.ANTICIPATING)
                state.playerStates[i].balance = BalanceEnum.ANTICIPATING
            }
        })
    },
    [AxisEnum.UNBALANCED]: (players: number[], amount: number, state: GameState) => {
        const { stateDurations, playerStates, lockedState } = state;
        players.forEach((i)=>{
            if(!lockedState.players[i].poise){
                stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== BalanceEnum.UNBALANCED)
                playerStates[i].balance = BalanceEnum.UNBALANCED
            }
        })
    },
    [AxisEnum.DAMAGE]: (players: number[], amount: number, state: GameState) => {
        players.forEach((i) => {
            const block = state.block[i];
            if (block > 0) {
                const remaining = amount - block;
                if (remaining >= 0) {
                    state.block[i] = 0;
                    state.health[i] -= remaining;
                } else {
                    state.block[i] = -remaining;
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
    if (changed) {
        return nextAmount * 2;
    }
    if (currentAmount === null || nextAmount === null) {
        return null;
    }
    return Math.max(currentAmount, nextAmount * 2);
}