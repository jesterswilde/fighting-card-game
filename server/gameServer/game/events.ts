import { GameState } from "../interfaces/stateInterface";
import { EventType, EventEffect, PredictionEvent } from "../interfaces/gameEvent";

export const newCardEvent = (state: GameState)=>{
  startNewEvent(EventType.PLAYED_CARD, state);
  state.pickedCards.forEach((card, i) => {
    state.currentEvent[i].card = {
      cardName: card.name,
      priority: card.priority
    }
  }); 
}

export const reflexEvent = (reflexingCards: string[], state: GameState)=>{
  startNewEvent(EventType.REFLEX, state)
  state.currentEvent.forEach((e, i)=>{
    e.reflexingCard = reflexingCards[i];
  });
}

export const predictionRevealEvent = (predictions: PredictionEvent[], state: GameState)=>{
  startNewEvent(EventType.REVEAL_PREDICTION, state);
  predictions.forEach((pred, i)=>{
    if(!pred)
      return;
    state.currentEvent[i].prediction = pred
  })
}

export const gameOverEvent = (state: GameState)=>{
  startNewEvent(EventType.GAME_OVER, state)
  state.currentEvent.forEach(e => e.winner = state.winner);
}

const startNewEvent = (header: EventType, state: GameState)=>{
  if(state.currentEvent)
    state.events.push(state.currentEvent)
  state.currentEvent = state.agents.map(_=> ({
    type: header
  }))
}

export const makeEventsFromReadied = (state: GameState)=>{
  state.readiedEffects.forEach((reaEffArr, index)=>{
    var events:EventEffect[] = reaEffArr
      .filter(reaEff => {
        const result = !reaEff.eventsHaveProcessed
        reaEff.eventsHaveProcessed = true
        return result;
      })
      .map(({effect, happensTo})=> ({effect, happensTo})); 
      state.currentEvent[index].effects = [...state.currentEvent[index].effects, ...events]; 
  })
}

export const sendEvents = (state: GameState)=>{
  if(state.currentEvent != null){
    state.events.push(state.currentEvent)
    state.currentEvent = null;
  }
  state.agents.forEach(agent => agent.sendEvents(state.events))
}