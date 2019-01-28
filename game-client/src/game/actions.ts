import { GameState, PredictionEnum } from "./interface";

export enum GameActionEnum{
    REPLACE_STATE = 'replaceGameState',
    START_GAME = 'startGame',
    PICKED_CARD = 'pickedCard',
    MADE_PREDICTION = 'madePrediction'
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



export type GameActions = ReplaceGameAction | StartGameAction | MadePredictionAction; 