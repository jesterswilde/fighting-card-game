import { MechanicEnum } from "../shared/card";

const descObj: {[mech: string]: string} = {
    [MechanicEnum.BLOCK]: 'Reduces damage by X amount next turn',
    [MechanicEnum.PARRY]: 'Reduces damage by X amount this turn',
    [MechanicEnum.BUFF]: 'Permanently buffs card for future uses',
    [MechanicEnum.CRIPPLE]: 'Permanently adds a terrible card to your opponent\'s deck',
    [MechanicEnum.FOCUS]: 'While on the queue, at the end of your turn, if the condition is met, the effect happens',
    [MechanicEnum.FORCEFUL]: 'Allows you to spend X Poise to get the effect',
    [MechanicEnum.LOCK]: 'That state cannot change for X turns',
    [MechanicEnum.PICK_ONE]: 'You choose which one of the listed effects will happen',
    [MechanicEnum.PREDICT]: 'Guess what the opponent will change with their next card, if correct, you get the effect',
    [MechanicEnum.REFLEX]: 'Plays a random, valid, card from your deck',
    [MechanicEnum.TELEGRAPH]: 'If the condition is met at the end of a turn (besides the turn this is played), the effect happens',
    [MechanicEnum.ENHANCE]: 'All future cards with this tag, will be enhanced by this effect'
}

export const getMechanicDescription = (mech: MechanicEnum)=>{
    return descObj[mech] || null; 
}