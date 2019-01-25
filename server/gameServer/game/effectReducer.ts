import { GameState, DistanceEnum, StandingEnum, MotionEnum, BalanceEnum } from "../interfaces/stateInterface";
import { MechanicEnum, Mechanic, Card, AxisEnum, PlayerEnum } from "../interfaces/cardInterface";
import { getCardByName } from "./getCards";

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
    let whoToCheck: number[];
    if (mechanic.player === PlayerEnum.PLAYER) {
        whoToCheck = [player];
    }
    else if (mechanic.player === PlayerEnum.OPPONENT) {
        whoToCheck = [opponent];
    }
    else {
        whoToCheck = [player, opponent];
    }
    let amount: number | null; 
    if(mechanic.amount !== undefined && mechanic.amount !== null){
        amount =  Number(mechanic.amount)
    }else{
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
        const {stateDurations, playerStates} = state; 
        players.forEach((i)=> stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== StandingEnum.STANDING))
        state.playerStates[i].standing = StandingEnum.STANDING        
    }),
    [AxisEnum.PRONE]: (players: number[], amount: number, state: GameState) => players.forEach((i) => {
        const {stateDurations, playerStates} = state;
        players.forEach((i)=> stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== StandingEnum.STANDING))
        state.playerStates[i].standing = StandingEnum.PRONE
    }),
    [AxisEnum.STILL]: (players: number[], amount: number, state: GameState) => {
        const {stateDurations, playerStates} = state; 
        players.forEach((i)=> stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== MotionEnum.STILL))
        players.forEach((i) => state.playerStates[i].motion = MotionEnum.STILL)
    },
    [AxisEnum.MOVING]: (players: number[], amount: number, state: GameState) => {
        const {stateDurations, playerStates} = state; 
        players.forEach((i)=> stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== MotionEnum.MOVING))
        players.forEach((i) => state.playerStates[i].motion = MotionEnum.MOVING)
    },
    [AxisEnum.BALANCED]: (players: number[], amount: number, state: GameState) => {
        const {stateDurations, playerStates} = state; 
        players.forEach((i) => {
            if(state.playerStates[i].balance !== BalanceEnum.ANTICIPATING){
                stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== BalanceEnum.BALANCED)
                state.playerStates[i].balance = BalanceEnum.BALANCED
            }
        })
    },
    [AxisEnum.ANTICIPATING]: (players: number[], amount: number, state: GameState) => {
        const {stateDurations, playerStates} = state;         
        players.forEach((i)=> stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== BalanceEnum.ANTICIPATING))
        players.forEach((i) => state.playerStates[i].balance = BalanceEnum.ANTICIPATING)
    },
    [AxisEnum.UNBALANCED]: (players: number[], amount: number, state: GameState) => {
        const {stateDurations, playerStates} = state; 
        players.forEach((i)=> stateDurations[i].balance = getMaxAmount(stateDurations[i].balance, amount, playerStates[i].balance !== BalanceEnum.UNBALANCED))
        players.forEach((i) => playerStates[i].balance = BalanceEnum.UNBALANCED)
    },
    [AxisEnum.DAMAGE]: (players: number[], amount: number, state: GameState) => {
        players.forEach((i) => state.health[i] -= amount)
        players.forEach((i) => state.damaged[i] = true);
    },
}

const getMaxAmount = (currentAmount: number, nextAmount: number, changed: boolean)=>{
    //The *2 is a hack for decrement counters
    if(changed){
        return nextAmount * 2;
    }
    if(currentAmount === null || nextAmount === null){
        return null;
    }
    return Math.max(currentAmount, nextAmount * 2); 
}