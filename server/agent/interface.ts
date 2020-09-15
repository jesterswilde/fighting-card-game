import { GameState, PredictionEnum } from "../gameServer/interfaces/stateInterface";
import { Card } from "../shared/card";
import { EventAction } from "../gameServer/interfaces/gameEvent";

export interface AgentBase {
    username: string,
    deck?: Card[],
    startGame: (playerIndex: number)=> void,
    gameOver: ()=>void,
    sendState: (gameState: GameState)=> void,
    sendHand: (cards: Card[][])=> void,
    sendEvents: (events: EventAction[][])=> void,
    getCardChoice: ()=>Promise<number>,
    opponentMadeCardChoice: ()=>void,
    getPrediction: ()=> Promise<PredictionEnum>,
    getUsedForceful: (cardName: string, mechanicIndex: number) => Promise<boolean>
    getPickOneChoice: (cardName: string, mechanicIndex: number) => Promise<number>; 
}

export enum AgentType{
    HUMAN = "human",
    RANDOM = "random"
}