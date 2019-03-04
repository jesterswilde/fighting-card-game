import { GameState } from "../interfaces/stateInterface";
import { Card } from "../../shared/card";
import { QUEUE_LENGTH } from "../gameSettings";

export const forEachCardInQueue = (state: GameState, cb: (card: Card, queueIndex: number)=>void)=>{
    state.queue.forEach((queueSlot, queueIndex)=>{
        queueSlot.forEach((playerCards, player)=>{
            playerCards.forEach((card)=>{
                cb(card, queueIndex); 
            })
        })
    })
}