import { Card, Effect } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";

/*
    Buff permanently increases the damage of a card by N amount on every successive play of that card. 
*/

export const buffCard = (effect: Effect, card: Card, player: number, opponent: number, state: GameState) => {
    card.buffed = card.buffed || 0; 
    card.buffed += effect.amount; 
}
