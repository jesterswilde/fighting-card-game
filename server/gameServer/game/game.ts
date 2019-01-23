import { GameState, PredictionEnum, PredictionState, BalanceEnum, MotionEnum, StandingEnum } from "../interfaces/stateInterface";
import { Card, Mechanic, MechanicEnum } from "../interfaces/cardInterface";
import { canPlayCard, canUseOptional, mechReqsMet } from "./requirements";
import { deepCopy, makeGameState, makeModifiedAxis } from "../util";
import { markAxisChange } from "./modifiedAxis";
import { reduceMechanics } from "./effectReducer";
import { checkPrediction } from "./predictions";
import { ControlEnum } from "../errors";
import { HAND_SIZE, QUEUE_LENGTH } from "../gameSettings";
import { getLastPlayedCard, iterateQueue } from "./queue";

export const playGame = async (state: GameState) => {
    try {
        startGame(state);
        while (state.winner === undefined) {
            await playTurn(state)
        }
        endGame(state);
    } catch (err) {
        if (err === ControlEnum.GAME_OVER) {
            endGame(state);
        } else {
            console.error(err)
        }
    }
}

const startGame = (state: GameState) => {

}

const endGame = (state: GameState) => {

}

export const playTurn = async (state: GameState) => {
    await startTurn(state);
    while (!state.turnIsOver) {
        await playCard(state);
    }
    endTurn(state);
}

export const startTurn = async (state: GameState) => {
    shuffleDeck(state);
    drawHand(state);
    await playerPicksCard(state);
}

export const endTurn = async (state: GameState) => {
    cullQueue(state);
    decrementCounters(state); 
    changePlayers(state); 
    clearTurnData(state); 
}

export const drawHand = (state: GameState) => {
    const { decks, currentPlayer, hands } = state;
    const deck = decks[currentPlayer];
    let handIndexes: number[] = [];
    for (let i = 0; i < deck.length; i++) {
        if (canPlayCard(deck[i], state)) {
            handIndexes.push(i);
        }
        if (handIndexes.length === HAND_SIZE) {
            break;
        }
    }
    const hand = handIndexes.map((i) => {
        const card = deck[i];
        deck[i] = undefined;
        return card;
    })
    decks[currentPlayer] = decks[currentPlayer].filter((card) => card !== undefined);
    hands[currentPlayer] = hand;
}

export const playerPicksCard = async (state: GameState) => {

}

export const pickCard = (cardNumber: number, state: GameState) => {
    const { currentPlayer: player, hands, decks } = state;
    state.pickedCard = hands[player][cardNumber];
    const unusedCards = hands[player].filter((_, i) => i !== cardNumber);
    decks[player].push(...unusedCards);
    hands[player] = [];
    const opponent = state.currentPlayer === 0 ? 1 : 0;
    state.pickedCard.opponent = opponent;
    state.pickedCard.player = state.currentPlayer;
}

export const addCardToQueue = (state: GameState) => {
    const { currentPlayer: player, queues } = state;
    const queue = queues[player];
    const pickedCard = state.pickedCard;
    state.pickedCard = undefined;
    queue[0] = queue[0] || [];
    queue[0].push(pickedCard);
}
export const incrementQueue = (state: GameState) => {
    const { queues, currentPlayer: player } = state;
    queues[player] = queues[player] || [];
    const queue = queues[player];

    for (let i = queue.length - 1; i >= 0; i--) {
        queue[i + 1] = queue[i];
    }
    queue[0] = [];
}

export const shuffleDeck = (state: GameState, playerToShuffle?: number) => {
    const { decks, currentPlayer } = state;
    let player = playerToShuffle === undefined ? currentPlayer : playerToShuffle;
    const deck = decks[player];
    for (let i = 0; i < deck.length; i++) {
        const rand = Math.floor(Math.random() * deck.length);
        const temp = deck[rand];
        deck[rand] = deck[i];
        deck[i] = temp;
    }
}

export const playCard = async (state: GameState) => {
    getMechanicsReady(state);
    await makePredictions(state);
    markAxisChanges(state);
    incrementQueue(state);
    addCardToQueue(state);
    applyEffects(state);
}

export const getMechanicsReady = (state: GameState) => {
    const { optional = [], effects = [] } = state.pickedCard;
    const validOptEff = optional.filter((reqEff) => canUseOptional(reqEff, state.pickedCard.opponent, state))
        .reduce((effects, reqEffs) => {
            effects.push(...reqEffs.effects);
            return effects;
        }, [])
    state.readiedEffects = [...deepCopy(effects), ...deepCopy(validOptEff)];
}

export const makePredictions = async (state: GameState, { _getPredictions = getPredictions } = {}) => {
    const { readiedEffects = [] } = state;
    for (let i = 0; i < readiedEffects.length; i++) {
        const eff = readiedEffects[i];
        if (eff.mechanic === MechanicEnum.PREDICT) {
            const prediction: PredictionState = {} as PredictionState;
            prediction.enum = await _getPredictions();
            prediction.mechanics = deepCopy(eff.mechanicEffects);
            state.predictions = state.predictions || [];
            state.predictions.push(prediction);
        }
    }
}

const getPredictions = async (): Promise<PredictionEnum> => {
    return PredictionEnum.NONE;
}


export const markAxisChanges = (state: GameState) => {
    const card = state.pickedCard;
    if (state.readiedEffects) {
        state.readiedEffects.forEach((mechanic) => {
            markAxisChange(mechanic, card, state);
        })
    }
}

/*
    --- TODO ---
    if a telegraph adds a focus or some other effect that lives on the queue, that new effect should be
    it's own entity on the queue. This is not handled in any way currently. 
    smimilarly, if the card is undefined, we don't handle this at all. Will crash. 
*/
export const applyEffects = (state: GameState) => {
    try {
        const card = getLastPlayedCard(state);
        reduceMechanics(state.readiedEffects, card, state.currentPlayer, card.opponent, state);
    } catch (err) {
        if (err === ControlEnum.NEW_EFFECTS) {
            applyEffects(state);
        } else {
            throw (err)
        }
    }
}

export const removeStoredEffects = (state: GameState) => {
    state.readiedEffects = undefined;
}

export const checkForVictor = (state: GameState) => {
    const { health } = state;
    if (health.every((hp) => hp <= 0)) {
        state.winner = -1;
    } else if (health[0] <= 0) {
        state.winner = 1;
    } else if (health[1] <= 0) {
        state.winner = 0;
    }
}

export const checkPredictions = (state: GameState) => {
    const { predictions } = state;
    let stateChanged = false;
    if (predictions !== undefined) {
        predictions.forEach((pred) => {
            if (checkPrediction(pred, state)) {
                stateChanged = true;
                state.readiedEffects = state.readiedEffects || [];
                state.readiedEffects.push(...deepCopy(pred.mechanics));
            }
        })
        state.predictions = undefined;
    }
    if (stateChanged) {
        throw ControlEnum.NEW_EFFECTS;
    }
}

export const checkTelegraph = (state: GameState) => {
    let modifiedState = false;
    const recentCard = getLastPlayedCard(state);
    let readied = [];
    iterateQueue((card, player, state) => {
        if (card !== recentCard) {
            let telegraphs = card.telegraphs || [];
            const metTelegraphs = telegraphs.map((mech) => mechReqsMet(mech, card.opponent, player, state));
            if (metTelegraphs.length > 0) {
                modifiedState = true;
                telegraphs.filter((_, i) => metTelegraphs[i])
                    .map((mech) => readied.push(...mech.mechanicEffects));
                state.readiedEffects = deepCopy(readied);
                telegraphs = telegraphs.filter((_, i) => !metTelegraphs[i]);
            }
            if (telegraphs.length === 0) {
                card.telegraphs = undefined;
            }
        }
    }, state);
    if (readied.length > 0) {
        state.readiedEffects = deepCopy(readied);
    }
    if (modifiedState) {
        throw ControlEnum.NEW_EFFECTS;
    }
}

export const checkReflex = (state: GameState) => {
    let playerToReflex: null | number = null;
    iterateQueue((card, player, state) => {
        if (card.shouldReflex && playerToReflex === null) {
            playerToReflex = player;
            card.shouldReflex = undefined;
        }
    }, state);
    if (playerToReflex !== null) {
        const deck = state.decks[playerToReflex];
        shuffleDeck(state, playerToReflex);
        const cardIndex = deck.findIndex((card) => canPlayCard(card, state));
        if (cardIndex >= 0) {
            const card = deck[cardIndex];
            state.decks[playerToReflex] = deck.filter((card, i) => cardIndex !== i);
            state.pickedCard = card;
            card.player = playerToReflex;
            card.opponent = card.player === 0 ? 1 : 0;
            addCardToQueue(state);
        }
        throw ControlEnum.PLAY_CARD;
    }
}

export const checkFocus = (state: GameState) => {
    if (state.checkedFocus) {
        return;
    }
    const { currentPlayer: player } = state;
    const queue = state.queues[player];
    state.checkedFocus = true;
    let modifiedState = false;
    queue.forEach((cards = []) => {
        cards.forEach((card) => {
            if (card.focuses) {
                const focused = card.focuses
                    .filter((mech) => mechReqsMet(mech, card.opponent, card.player, state))
                    .reduce((arr: Mechanic[], mech) => {
                        arr.push(...mech.mechanicEffects)
                        return arr;
                    }, []);
                if (focused.length > 0) {
                    modifiedState = true;
                    state.readiedEffects = state.readiedEffects || [];
                    state.readiedEffects.push(...deepCopy(focused));
                    modifiedState = true;
                }
            }
        })
    })
    throw ControlEnum.NEW_EFFECTS;
}

export const cullQueue = (state: GameState) => {
    const {decks, queues, currentPlayer: player} = state; 
    const queue = queues[player];
    const deck = decks[player];  
    if(queue.length > QUEUE_LENGTH){
        const cards = queue.pop();
        deck.push(...cards);
    }
}


const decrementCounters = (state: GameState)=>{
    const {stateDurations, playerStates} = state; 

    stateDurations.forEach((duration, i)=>{
        if(duration.balance !== null && duration.balance !== undefined){
            duration.balance--;
            if(duration.balance <= 0){
                duration.balance = null;
                playerStates[i].balance = BalanceEnum.BALANCED; 
            }
        }
        if(duration.motion !== null && duration.motion !== undefined){
            duration.motion--;
            if(duration.motion <= 0){
                duration.motion = null;
                playerStates[i].motion = MotionEnum.MOVING; 
            }
        }
        if(duration.standing !== null && duration.standing !== undefined){
            duration.standing--;
            if(duration.standing <= 0){
                duration.standing = null;
                playerStates[i].standing = StandingEnum.STANDING; 
            }
        }
    })
}

const changePlayers = (state: GameState)=>{
    const player = state.currentPlayer === 0 ? 1 : 0; 
    state.currentPlayer = player; 
}

const clearTurnData = (state: GameState)=>{
    state.damaged = [false, false]; 
    state.predictions = null;
    state.turnIsOver = false; 
    state.modifiedAxis = makeModifiedAxis(); 
    state.turnIsOver = false; 
}
