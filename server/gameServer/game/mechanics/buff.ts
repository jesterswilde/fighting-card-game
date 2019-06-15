import { Mechanic, Card, MechanicEnum } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";

/*
    Buff permanently increases the damage of a card by N amount on every successive play of that card. 
*/

export const reduceBuff = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const effect = card.effects.find(({ mechanic: mechEnum, axis, player, amount }) => {
        return mechanic.axis === axis && player === mechanic.player && mechEnum !== MechanicEnum.BUFF
    })
    if (effect !== undefined && typeof effect.amount === 'number' && typeof mechanic.amount === 'number') {
        effect.amount += mechanic.amount;
    } else {
        card.effects.push({ axis: mechanic.axis, amount: mechanic.amount, player: mechanic.player });
    }
}
