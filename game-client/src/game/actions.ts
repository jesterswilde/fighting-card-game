import { GameState } from "./interface";

export enum GameActionEnum{
    REPLACE_STATE = 'replaceGameState',
    START_GAME = 'startGame',
    PICKED_CARD = 'pickedCard'
}

export interface ReplaceGameAction{
    type: GameActionEnum.REPLACE_STATE,
    gameState: GameState
}

export interface StartGameAction{
    type: GameActionEnum.START_GAME,
    player: number
}



export type GameActions = ReplaceGameAction | StartGameAction; 