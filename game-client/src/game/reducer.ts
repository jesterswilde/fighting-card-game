import { GameState, DistanceEnum } from "./interface";
import { ActionType } from "../state/actionTypes";
import { GameActionEnum, SwapCardDisplayModeAction } from "./actions";

export const gameReducer = (state: GameState = makeDefaultGameState(), action: ActionType): GameState => {
    switch (action.type) {
        case GameActionEnum.REPLACE_STATE:
            return { ...state, ...action.gameState, hasGameState: true };
        case GameActionEnum.START_GAME:
            return { ...state, player: action.player }
        case GameActionEnum.SHOULD_PICK_ONE:
            return { ...state, choices: action.choices }
        case GameActionEnum.DID_PICK_ONE:
            return { ...state, choices: undefined }
        case GameActionEnum.SHOULD_PICK_FORCEFUL:
            return { ...state, forceful: action.option }
        case GameActionEnum.DID_PICK_FORCEFUL:
            return { ...state, forceful: undefined }
        case GameActionEnum.SWAPPED_CARD_DISPLAY_MODE:
            return swapDisplayMode(state, action);
        default:
            return state;
    }
}

const swapDisplayMode = (state: GameState, { cardLoc: { turn, player, index } }: SwapCardDisplayModeAction): GameState => {
    const queue = [...state.queue];
    const turnColumn = [...queue[turn]];
    const playerCards = [...turnColumn[player]];
    const card = { ...playerCards[index] }
    card.showFullCard = !card.showFullCard;
    playerCards[index] = card; 
    turnColumn[player] = playerCards;
    queue[turn] = turnColumn;
    return {
        ...state,
        queue
    }
}

const makeDefaultGameState = (): GameState => {
    return {
        health: [],
        playerStates: [],
        stateDurations: [],
        block: [],
        queue: [],
        distance: DistanceEnum.FAR,
        currentPlayer: 0,
        damaged: [],
        player: 0,
        turnNumber: 0,
        lockedState: {
            distance: null,
            players: [
                { motion: null, poise: null, stance: null },
                { motion: null, poise: null, stance: null }
            ]
        }
    }
}