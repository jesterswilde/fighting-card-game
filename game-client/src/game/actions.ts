import { GameState, PredictionEnum } from "./interface";
import { Mechanic } from "../shared/card";

export enum GameActionEnum{
    REPLACE_STATE = 'replaceGameState',
    START_GAME = 'startGame',
    PICKED_CARD = 'pickedCard',
    MADE_PREDICTION = 'madePrediction',
    SHOULD_PICK_ONE = 'shouldPickOne',
    DID_PICK_ONE = 'didPickOne',
    SHOULD_PICK_FORCEFUL = 'shouldPickForceful',
    DID_PICK_FORCEFUL = 'didPickForceful',
    SWAPPED_CARD_DISPLAY_MODE = 'swapCardDisplayMode'
}

export interface SwapCardDisplayModeAction{
    type: GameActionEnum.SWAPPED_CARD_DISPLAY_MODE,
    cardLoc: {turn: number, player: number, index: number}
}

export interface ShouldPickForecfulAction{
    type: GameActionEnum.SHOULD_PICK_FORCEFUL,
    option: {cardName: string, mechanic: Mechanic}
}

export interface DidPickForcefulAction{
    type: GameActionEnum.DID_PICK_FORCEFUL,
    choice: boolean
}

export interface MadePredictionAction{
    type: GameActionEnum.MADE_PREDICTION,
    prediction: PredictionEnum
}

export interface ReplaceGameAction{
    type: GameActionEnum.REPLACE_STATE,
    gameState: GameState
}

export interface StartGameAction{
    type: GameActionEnum.START_GAME,
    player: number
}

export interface ShouldPickOneAction{
    type: GameActionEnum.SHOULD_PICK_ONE
    choices: Mechanic[][]
}

export interface DidPickOneAction {
    type: GameActionEnum.DID_PICK_ONE
    choice: number
}



export type GameActions = ReplaceGameAction | StartGameAction | MadePredictionAction | ShouldPickOneAction | DidPickOneAction |
    ShouldPickForecfulAction | DidPickForcefulAction | SwapCardDisplayModeAction; 