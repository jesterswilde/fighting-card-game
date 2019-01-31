import { GameState, PredictionEnum } from "./interface";
import { Mechanic } from "../interfaces/card";

export enum GameActionEnum{
    REPLACE_STATE = 'replaceGameState',
    START_GAME = 'startGame',
    PICKED_CARD = 'pickedCard',
    MADE_PREDICTION = 'madePrediction',
    SHOULD_PICK_ONE = 'shouldPickOne',
    DID_PICK_ONE = 'didPickOne'
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



export type GameActions = ReplaceGameAction | StartGameAction | MadePredictionAction | ShouldPickOneAction | DidPickOneAction; 