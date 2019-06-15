import { Mechanic, Card, Enhancement } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";
import { consolidateMechanics } from "../../util";

//permanently buffs all cards with a tag. 

export const reduceEnhance = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const alterObj = state.tagModification[player];
    const enhanceArr = [...(alterObj[mechanic.amount] || []), ...(mechanic.mechanicEffects || [])];
    alterObj[mechanic.amount] = consolidateMechanics(enhanceArr);
}


export const addEnhancement = (card: Card, state: GameState) => {
    const tags = card.tags || [];
    const modObj = state.tagModification[card.player]
    card.enhancements = tags.reduce((enhArr: Enhancement[], {value:tag})=>{
        const mechanics = modObj[tag] || [];
        enhArr.push({tag, mechanics});
        return enhArr;
    },[])
}

export const removeEnhancements = (card: Card)=>{
    card.enhancements = null; 
}