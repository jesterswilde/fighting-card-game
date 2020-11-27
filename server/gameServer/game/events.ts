import { GameState, HappensEnum } from "../interfaces/stateInterface";
import {
  EventType,
  EventEffect,
  EventEffectType,
} from "../interfaces/gameEvent";

export const newCardEvent = (state: GameState) => {
  console.log("Adding new card event")
  startNewEvent(EventType.PLAYED_CARD, state);
  state.pickedCards.forEach((card, i) => {
    if(!card) 
      return null
    state.currentEvent[i].card = {
      cardName: card.name,
      priority: card.priority,
    };
  });
};

export const reflexEvent = (reflexingCards: string[], state: GameState) => {
  startNewEvent(EventType.REFLEX, state);
};


export const gameOverEvent = (state: GameState) => {
  startNewEvent(EventType.GAME_OVER, state);
  state.currentEvent.forEach((e) => (e.winner = state.winner));
};

export const startNewEvent = (header: EventType, state: GameState) => {
  if (state.currentEvent)
    state.events.push(state.currentEvent);
  state.currentEvent = state.agents.map(() => ({
    type: header,
  }));
};

export const addDisplayEvent = (display: string, index: number, state: GameState, addEvents: boolean = false)=>{
  state.currentEvent[index].effects = state.currentEvent[index].effects || []
  state.currentEvent[index].effects.push({type: EventEffectType.CHOICE, display})
  if(addEvents)
    makeEventsFromReadied(state); 
}

export const makeEventsFromReadied = (state: GameState) => {
  state.readiedEffects.forEach((reaEffArr, index) => {
    var events: EventEffect[] = reaEffArr
      .filter((reaEff) => {
        const result = !reaEff.eventsHaveProcessed;
        reaEff.eventsHaveProcessed = true;
        return result;
      })
      .map(({ effect, happensTo }) => ({ effect, happensTo, type: EventEffectType.EFFECT }));
    if (!state.currentEvent[index]) throw new Error("No current event");
    state.currentEvent[index].effects = state.currentEvent[index].effects ?? [];
    state.currentEvent[index].effects.push(...events)
  });
};

export const sendEvents = (state: GameState) => {
  if (state.currentEvent != null) {
    state.events.push(state.currentEvent);
    state.currentEvent = null;
  }
  state.agents.forEach((agent) => agent.sendEvents(state.events));
  state.events = []
  state.currentEvent = null
};
