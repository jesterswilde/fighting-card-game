import { Card, Mechanic } from '../shared/card';
import { dispatchGotHandState, dispatchOppGotCards, dispatchOppPickedCard } from '../hand/dispatch';
import { dispatchSwitchScreen } from '../display/dispatch';
import { ScreenEnum } from '../display/interface';
import { dispatchStartGame, dispatchGameState, dispatchShouldPickOne, dispatchShouldPickForecful } from '../game/dispatch';
import { SocketEnum } from '../shared/socket';
import { dispatchGotDeckChoices } from '../lobby/dispatch';
import { GameState } from '../game/interface';
import { dispatchShouldPredict } from '../gameDisplay/dispatch';
import { DeckChoice } from '../lobby/interfaces';
import { EventAction } from '../events/interface';
import { dispatchGotEvents } from '../events/dispatch';
import { HandState } from '../hand/interface';
import { store } from '../state/store';

export const setupSockets = (socket: SocketIOClient.Socket) => {
   console.log('running socket messsages');

   socket.emit(SocketEnum.AUTHORIZATION, store.getState().user.token || null);

   socket.on(SocketEnum.JOINED_LOBBY, () => {
      console.log('joined lobby');
      dispatchSwitchScreen(ScreenEnum.LOOKING_FOR_GAME)
   })

   socket.on(SocketEnum.GOT_CARDS, (handState: HandState) => {
      console.log('got hand State', handState);
      dispatchGotHandState(handState);
   })

   socket.on(SocketEnum.START_GAME, ({ player }) => {
      console.log("game started");
      dispatchStartGame(player);
   })


   socket.on(SocketEnum.GOT_DECK_OPTIONS, (choices: DeckChoice[]) => {
      console.log('got deck options: ', choices);
      dispatchGotDeckChoices(choices);
   })

   socket.on(SocketEnum.GOT_STATE, (state: GameState) => {
      console.log('gotState', state);
      dispatchGameState(state);
   })

   socket.on(SocketEnum.SHOULD_PREDICT, () => {
      console.log('should predict');
      dispatchShouldPredict();
   });

   socket.on(SocketEnum.SHOULD_PICK_ONE, (choices: Mechanic[][]) => {
      console.log("pick one", choices);
      dispatchShouldPickOne(choices)
   })

   socket.on(SocketEnum.GOT_EVENTS, (events: EventAction[]) => {
      console.log('gotEvents', events);
      dispatchGotEvents(events);
   })

   socket.on(SocketEnum.GOT_FORCEFUL_CHOICE, (options: { cardName: string, mechanic: Mechanic }) => {
      dispatchShouldPickForecful(options);
   })

   socket.on(SocketEnum.OPPONENT_GOT_CARDS, (cards: number) => {
      console.log('opponent got cards');
      dispatchOppGotCards(cards);
   })

   socket.on(SocketEnum.OPPONENT_PICKED_CARDS, () => {
      console.log('opponent picked cards');
      dispatchOppPickedCard();
   })
}

