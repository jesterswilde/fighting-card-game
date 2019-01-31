import { GameState, PredictionEnum, PredictionState, BalanceEnum, MotionEnum, StandingEnum } from "../interfaces/stateInterface";
import { Card, Mechanic, MechanicEnum } from "../interfaces/cardInterface";
import { canPlayCard, canUseOptional, mechReqsMet } from "./requirements";
import { deepCopy, makeModifiedAxis } from "../util";
import { markAxisChange } from "./modifiedAxis";
import { reduceMechanics } from "./effectReducer";
import { didPredictionHappen } from "./predictions";
import { ControlEnum, ErrorEnum } from "../errors";
import { HAND_SIZE, QUEUE_LENGTH } from "../gameSettings";
import { getLastPlayedCard } from "./queue";
import { SocketEnum } from "../interfaces/socket";
import { Socket } from "socket.io";

export const playGame = async (state: GameState) => {
    try {
        startGame(state);
        while (true) {
            await playTurn(state)
        }
    } catch (err) {
        if (err === ControlEnum.GAME_OVER) {
            endGame(state);
        } else {
            console.error(err)
        }
    }
}

const startGame = (state: GameState) => {
    assignPlayerToDecks(state);
    sendState(state);
    state.sockets.forEach((socket, i) => {
        socket.emit(SocketEnum.START_GAME, { player: i });
    })
}

const endGame = (state: GameState) => {

}

const sendState = (state: GameState) => {
    if(!state){
        return;
    }
    const sendState = {
        playerStates: state.playerStates,
        stateDurations: state.stateDurations,
        block: state.block,
        queue: state.queue,
        distance: state.distance,
        currentPlayer: state.currentPlayer,
        health: state.health,
        damaged: state.damaged,
        predictions: state.pendingPredictions
    }
    state.sockets.forEach((socket, i) => {
        const stateToSend = deepCopy(sendState) as GameState; 
        if(stateToSend.predictions){
            stateToSend.predictions.forEach((pred)=>{
                if(pred.player !== i){
                    pred.prediction = null; 
                }
            })
        }
        socket.emit(SocketEnum.GOT_STATE, stateToSend);
    })
}

export const playTurn = async (state: GameState) => {
    sendState(state); 
    await startTurn(state);
    await playCard(state);
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

const assignPlayerToDecks = (state: GameState) => {
    for (let player = 0; player < state.decks.length; player++) {
        const deck = state.decks[player];
        for (let i = 0; i < deck.length; i++) {
            deck[i].player = player;
        }
        console.log(deck.map(({ player }) => player));
    }
}

export const drawHand = (state: GameState, { _sendHand = sendHand } = {}) => {
    const { decks, currentPlayer, hands } = state;
    const deck = decks[currentPlayer];
    let handIndexes: number[] = [];
    try {
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
        markOptional(hand, state); 
        if (hand.length === 0) {
            addPanicCard(state);
        }
        _sendHand(state);
    } catch (err) {
        if (err === ErrorEnum.NO_CARD) {
            console.log("No card", deck)
        }else{
            throw err
        }
    }
}

const markOptional = (cards: Card[], state: GameState)=>{
    cards.forEach(({optional = [], opponent, player})=>{
        if(opponent === undefined){
            opponent = player === 0 ? 1 : 0; 
        }
        optional.forEach((opt)=>{
            opt.canPlay = canUseOptional(opt, opponent, state); 
        })
    })
}

const addPanicCard = (state: GameState) => {
    const { currentPlayer: player } = state;
    const card: Card = {
        name: 'Panic',
        effects: [],
        requirements: [],
        player,
        opponent: player === 0 ? 1 : 0,
        optional: []
    }
    state.hands[player].push(card);
}

const sendHand = (state: GameState) => {
    const { sockets, currentPlayer: player, hands } = state;
    sockets[player].emit(SocketEnum.GOT_CARDS, hands[player]);
}

export const playerPicksCard = async (state: GameState) => {
    const { sockets, currentPlayer: player } = state;
    return new Promise((res, rej) => {
        sockets[player].once(SocketEnum.PICKED_CARD, (index: number) => {
            pickCard(index, state);
            res();
        })
    })
}

export const pickCard = (cardNumber: number, state: GameState) => {
    const { currentPlayer: player, hands, decks } = state;
    state.pickedCard = hands[player][cardNumber];
    const unusedCards = hands[player].filter((_, i) => i !== cardNumber);
    decks[player].push(...unusedCards);
    hands[player] = [];
    const opponent = state.currentPlayer === 0 ? 1 : 0;
    state.pickedCard.opponent = opponent;
}

export const incrementQueue = (state: GameState) => {
    const { queue } = state;
    if (!state.incrementedQueue) {
        for (let i = queue.length - 1; i >= 0; i--) {
            queue[i + 1] = queue[i];
        }
        queue[0] = [];
        state.incrementedQueue = true;
    }
}

export const addCardToQueue = (state: GameState) => {
    const { currentPlayer: player, queue } = state;
    const pickedCard = state.pickedCard;
    state.pickedCard = undefined;
    queue[0] = queue[0] || [];
    queue[0].push(pickedCard);
}

export const shuffleDeck = (state: GameState, playerToShuffle?: number) => {
    const { decks, currentPlayer: player } = state;

    const deck = decks[player];
    for (let i = 0; i < deck.length; i++) {
        const rand = Math.floor(Math.random() * deck.length);
        const temp = deck[rand];
        deck[rand] = deck[i];
        deck[i] = temp;
    }
}

export const playCard = async (state: GameState) => {
    try {
        getMechanicsReady(state);
        await playerPicksOne(state); 
        await makePredictions(state);
        markAxisChanges(state);
        incrementQueue(state);
        addCardToQueue(state);
        applyEffects(state);
        sendState(state);
    } catch (err) {
        console.log("err", err)
        if (err === ControlEnum.PLAY_CARD) {
            console.log('caught and playing card');
            await playCard(state);
        } else {
            throw err;
        }
    }
}

export const getMechanicsReady = (state: GameState) => {
    const { optional = [], effects = [] } = state.pickedCard;
    const validOptEff = optional.filter((reqEff) => canUseOptional(reqEff, state.pickedCard.opponent, state))
        .reduce((effsArr, reqEffs) => {
            effsArr.push(...reqEffs.effects);
            return effsArr;
        }, [])
    state.readiedEffects = [...deepCopy(effects), ...deepCopy(validOptEff)];
}

export const playerPicksOne = async(state: GameState, {_waitForPlayerToChoose = waitForPlayerToChoose} = {})=>{
    const {sockets, currentPlayer, readiedEffects = []} = state;
    const pickedEffects: Mechanic[] = []; 
    const unusedEffs: boolean[] = [];
    const player = sockets[currentPlayer];
    for(let i = 0; i < readiedEffects.length; i++){
        const effect = state.readiedEffects[i]; 
        if(effect.mechanic === MechanicEnum.PICK_ONE){
            const choice = await _waitForPlayerToChoose(effect.choices, player);
            const picked = effect.choices[choice];
            pickedEffects.push(...picked);
            unusedEffs.push(false); 
        }
        unusedEffs.push(true); 
    }
    state.readiedEffects = state.readiedEffects.filter((_,i)=> unusedEffs[i]);
    state.readiedEffects.push(...pickedEffects); 
}

const waitForPlayerToChoose = (choices: Mechanic[][], player: Socket): Promise<number>=>{
    return new Promise((res, rej)=>{
        player.emit(SocketEnum.SHOULD_PICK_ONE, choices); 
        player.once(SocketEnum.PICKED_ONE, (choice: number)=>{
            res(choice); 
        })
    })
}

export const makePredictions = async (state: GameState, { _getPredictions = getPredictions } = {}) => {
    const { readiedEffects = [] } = state;
    for (let i = 0; i < readiedEffects.length; i++) {
        const eff = readiedEffects[i];
        if (eff.mechanic === MechanicEnum.PREDICT) {
            const prediction: PredictionState = {} as PredictionState;
            prediction.prediction = await _getPredictions(state);
            prediction.mechanics = deepCopy(eff.mechanicEffects);
            prediction.player = state.currentPlayer; 
            state.predictions = state.predictions || [];
            state.predictions.push(prediction);
            console.log('prediction: ', state.predictions); 
        }
    }
}

const getPredictions = (state: GameState): Promise<PredictionEnum> => {
    console.log('getting predictin'); 
    return new Promise((res, rej) => {
        const { currentPlayer: player, sockets } = state;
        const socket = sockets[player];
        socket.emit(SocketEnum.SHOULD_PREDICT);
        socket.once(SocketEnum.MADE_PREDICTION, (prediction: PredictionEnum) => {
            console.log('gotPrediction'); 
            res(prediction); 
        })
    })
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
        makeEffectsReduceable(state);
        removeStoredEffects(state);
        checkForVictor(state);
        checkPredictions(state);
        checkTelegraph(state);
        checkReflex(state);
        checkFocus(state);
    } catch (err) {
        if (err === ControlEnum.NEW_EFFECTS) {
            applyEffects(state);
        } else {
            throw (err)
        }
    }
}

export const makeEffectsReduceable = (state: GameState) => {
    const card = getLastPlayedCard(state);
    reduceMechanics(state.readiedEffects, card, state.currentPlayer, card.opponent, state);
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
    if (state.winner !== undefined) {
        throw ControlEnum.GAME_OVER;
    }
}

export const checkPredictions = (state: GameState) => {
    const { pendingPredictions: predictions } = state;
    let stateChanged = false;
    if (predictions) {
        predictions.forEach((pred) => {
            if (didPredictionHappen(pred, state)) {
                stateChanged = true;
                state.readiedEffects = state.readiedEffects || [];
                state.readiedEffects.push(...deepCopy(pred.mechanics));
            }
        })
        state.pendingPredictions = undefined;
    }
    if (stateChanged) {
        throw ControlEnum.NEW_EFFECTS;
    }
}

export const checkTelegraph = (state: GameState) => {
    const { queue } = state;
    const recentCard = getLastPlayedCard(state);
    let readied = [];
    queue.forEach((cards = []) => {
        cards.forEach((card) => {
            if (card !== recentCard && card) {
                let telegraphs = card.telegraphs || [];
                const metTelegraphs = telegraphs.map((mech) => mechReqsMet(mech, card.opponent, card.player, state));
                if (metTelegraphs.length > 0) {
                    telegraphs.filter((_, i) => metTelegraphs[i])
                        .forEach((mech) => readied.push(...mech.mechanicEffects));
                    card.telegraphs = telegraphs.filter((_, i) => !metTelegraphs[i]);
                }
                if (card.telegraphs && card.telegraphs.length === 0) {
                    card.telegraphs = undefined;
                }
            }
        }, state);
    })
    if (readied.length > 0) {
        state.readiedEffects = deepCopy(readied);
        throw ControlEnum.NEW_EFFECTS;
    }
}

export const checkReflex = (state: GameState) => {
    const { queue } = state;
    let playerToReflex: null | number = null;
    queue.forEach((cards) => {
        cards.forEach((card) => {
            if (card.shouldReflex && playerToReflex === null) {
                playerToReflex = card.player;
                card.shouldReflex = undefined;
            }
        }, state);
    })
    if (playerToReflex !== null) {
        reflexCard(playerToReflex, state);
    }
}

const reflexCard = (player: number, state: GameState) => {
    console.log('reflexing');
    const deck = state.decks[player];
    shuffleDeck(state, player);
    const cardIndex = deck.findIndex((card) => canPlayCard(card, state));
    if (cardIndex >= 0) {
        console.log('found card');
        const card = deck[cardIndex];
        state.decks[player] = deck.filter((card, i) => cardIndex !== i);
        card.opponent = card.player === 0 ? 1 : 0;
        state.pickedCard = card;
        console.log(card.name);
        throw ControlEnum.PLAY_CARD;
    } else {
        console.log('reflexed into nothing')
    }
}

export const checkFocus = (state: GameState) => {
    if (state.checkedFocus) {
        return;
    }
    const { queue, currentPlayer: player } = state;
    state.checkedFocus = true;
    let modifiedState = false;
    queue.forEach((cards = []) => {
        cards.forEach((card) => {
            if (card.focuses && card.player === player) {
                console.log('card has focus');
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
    if (modifiedState) {
        throw ControlEnum.NEW_EFFECTS;
    }
}

export const cullQueue = (state: GameState) => {
    const { decks, queue } = state;
    if (queue.length > QUEUE_LENGTH) {
        const cards = queue.pop();
        cards.forEach((card) => {
            console.log('culling', card.name, card.player)
            if (card.name !== 'Panic') {
                decks[card.player].push(card);
            }
        })
    }
}


const decrementCounters = (state: GameState) => {
    const { stateDurations, playerStates } = state;

    stateDurations.forEach((duration, i) => {
        if (duration.balance !== null && duration.balance !== undefined) {
            duration.balance--;
            if (duration.balance <= 0) {
                duration.balance = null;
                playerStates[i].balance = BalanceEnum.BALANCED;
            }
        }
        if (duration.motion !== null && duration.motion !== undefined) {
            duration.motion--;
            if (duration.motion <= 0) {
                duration.motion = null;
                playerStates[i].motion = MotionEnum.STILL;
            }
        }
        if (duration.standing !== null && duration.standing !== undefined) {
            duration.standing--;
            if (duration.standing <= 0) {
                duration.standing = null;
                playerStates[i].standing = StandingEnum.STANDING;
            }
        }
    })
}

const changePlayers = (state: GameState) => {
    const player = state.currentPlayer === 0 ? 1 : 0;
    state.currentPlayer = player;
}

const clearTurnData = (state: GameState) => {
    const opponent = state.currentPlayer === 0 ? 1 : 0; 
    state.damaged = [false, false];
    state.turnIsOver = false;
    state.modifiedAxis = makeModifiedAxis();
    state.turnIsOver = false;
    state.incrementedQueue = false;
    state.pendingPredictions = state.predictions;
    state.predictions = null; 
    state.block[opponent] = 0; 
}
