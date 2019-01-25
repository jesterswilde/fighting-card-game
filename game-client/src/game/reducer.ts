import { GameState, DistanceEnum } from "./interface";
import { ActionType } from "../state/actionTypes";
import { GameActionEnum } from "./actions";

export const gameReducer = (state:GameState = makeDefaultGameState(),  action: ActionType):GameState=>{
    switch(action.type){
        case GameActionEnum.REPLACE_STATE:
            return {...state, ...action.gameState};
        case GameActionEnum.START_GAME:
            return {...state, player: action.player}
        default:
            return state; 
    } 
}

const makeDefaultGameState = (): GameState=>{
    return {
        health: [],
        playerStates:[],
        stateDurations:[],
        block:[],
        queue:[],
        distance: DistanceEnum.FAR,
        currentPlayer: 0,
        damaged:[],
        player: 0
    }
}