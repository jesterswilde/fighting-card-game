import { GameState, PredictionEnum } from "../gameServer/interfaces/stateInterface";
import { Card } from "../shared/card";
import { EventAction } from "../gameServer/interfaces/gameEvent";

export interface AgentBase {
    username: string,
    deck?: Card[],
    startGame: (index: number)=> void,
    gameOver: (didWin: boolean, state: GameState)=>void,
    sendState: (state: GameState)=> void,
    sendHand: (cards: Card[][])=> void,
    sendEvents: (events: EventAction[][])=> void,
    getCardChoice: ()=>Promise<number>,
    opponentMadeCardChoice: ()=>void,
    getPrediction: ()=> Promise<PredictionEnum>,
    getUsedForceful: (mech: MechanicOnCard) => Promise<boolean>,
    getPickOneChoice: (mech: MechanicOnCard) => Promise<number>
}

export enum AgentType{
    HUMAN = "human",
    RANDOM = "random"
}

export interface MechanicOnCard{
    cardName: string, 
    index: number
}