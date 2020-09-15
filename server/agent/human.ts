import { AgentBase, AgentType } from "./interface";
import { PredictionEnum } from "../gameServer/interfaces/stateInterface";
import { SocketEnum, GameOverEnum } from "../shared/socket";
import { deckListToCards } from "../cards/Cards";
import { PlayerObject } from "../gameServer/lobby/interface";

export interface HumanAgent extends AgentBase{
    type: AgentType.HUMAN
    player: PlayerObject
}

export const makeHumanAgent = (player: PlayerObject): HumanAgent=>{
    return {
        deck: deckListToCards(player.deck.deckList),
        username: player.username,
        type: AgentType.HUMAN,
        player,
        startGame(index){
            player.socket.emit(SocketEnum.START_GAME, {player:index}); 
        },
        gameOver(){
            player.socket.emit(SocketEnum.GAME_OVER);
            player.socket.once(SocketEnum.END_GAME_CHOICE, (choice: GameOverEnum)=>{
                switch(choice){
                    case GameOverEnum.FIND_NEW_OPP_WITH_NEW_DECK:
                        break;
                    case GameOverEnum.FIND_NEW_OPP_WITH_SAME_DECK:
                        break;
                }
            })
        },
        sendHand(cards){
            player.socket.emit(SocketEnum.GOT_CARDS, cards)
        },
        sendState(gameState){
            player.socket.emit(SocketEnum.GOT_STATE, gameState)
        },
        sendEvents(events){
            player.socket.emit(SocketEnum.GOT_EVENTS, events); 
        },
        getPickOneChoice(cardName, mechIndex){
            return new Promise<number>((res, rej)=>{
                player.socket.emit(SocketEnum.SHOULD_PICK_ONE, {cardName, mechIndex})
                player.socket.emit(SocketEnum.PICKED_ONE, (choice: number)=>{
                    res(choice); 
                })
            })
        },
        getPrediction(){
            return new Promise<PredictionEnum>((res, rej)=>{
                player.socket.emit(SocketEnum.SHOULD_PREDICT)
                player.socket.once(SocketEnum.MADE_PREDICTION, (prediction: PredictionEnum)=>{
                    res(prediction);
                })
            })
        },
        getUsedForceful(cardName, mechIndex){
            return new Promise<boolean>((res, rej)=>{
                player.socket.emit(SocketEnum.GOT_FORCEFUL_CHOICE, {cardName, mechIndex})
                player.socket.once(SocketEnum.PICKED_FORCEFUL, (useForceful: boolean)=>{
                    res(useForceful); 
                }); 
            })
        },
        getCardChoice(){
            return new Promise<number>((res, rej)=>{

            });
        },
        opponentMadeCardChoice(){

        }
    }

}