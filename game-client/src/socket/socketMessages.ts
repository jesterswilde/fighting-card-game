import { Card, Mechanic } from '../interfaces/card';
import { dispatchGotCards } from '../hand/dispatch';
import { dispatchSwitchScreen } from '../display/dispatch';
import { ScreenEnum } from '../display/interface';
import { dispatchStartGame, dispatchGameState, dispatchShouldPickOne } from '../game/dispatch';
import { SocketEnum } from './socketEnum';
import { dispatchGotDeckChoices } from '../deck/dispatch';
import { GameState } from '../game/interface';
import { dispatchShouldPredict } from '../gameDisplay/dispatch';
import { DeckChoice } from '../deck/interfaces';

export const setupSockets = (socket: SocketIOClient.Socket)=>{
    console.log('running socket messsages'); 
    
    socket.on(SocketEnum.JOINED_LOBBY, ()=>{
        console.log('joined lobby'); 
        dispatchSwitchScreen(ScreenEnum.LOOKING_FOR_GAME)
    })
    
     socket.on(SocketEnum.GOT_CARDS, (cards: Card[])=>{
         console.log('got cards', cards); 
        dispatchGotCards(cards); 
     })

     socket.on(SocketEnum.START_GAME, ({player})=>{
        console.log("game started");  
        dispatchStartGame(player); 
     })


     socket.on(SocketEnum.GOT_DECK_OPTIONS, (choices: DeckChoice[])=>{
         console.log('got deck options: ', choices); 
        dispatchGotDeckChoices(choices); 
     })

     socket.on(SocketEnum.GOT_STATE, (state: GameState)=>{
        console.log('gotState', state);  
        dispatchGameState(state); 
     })

     socket.on(SocketEnum.SHOULD_PREDICT,()=>{
        console.log('should predict'); 
        dispatchShouldPredict(); 
     });

     socket.on(SocketEnum.SHOULD_PICK_ONE, (choices: Mechanic[][])=>{
        console.log("pick one", choices); 
        dispatchShouldPickOne(choices)
     })
}

