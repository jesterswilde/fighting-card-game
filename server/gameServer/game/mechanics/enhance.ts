import { Card, Enhancement, Effect, Mechanic } from "../../../shared/card";
import { GameState } from "../../interfaces/stateInterface";
import { deepCopy } from "../../util";


//permanently buffs all cards with a tag. 

export const makeEffectsFromEnhance = (card:Card) =>{
    if(!card.enhancements)
        return [];
    const effects: Effect[] = []; 
    card.enhancements.forEach(enhance => effects.push(...deepCopy(enhance.effects)));
    return effects; 
}

export const addEnhacementsToHands = (state: GameState)=>{
    state.hands.forEach(hand =>{
        hand.forEach(card => addEnhancementToCard(card, state));
    })
}

const addEnhancementToCard = (card: Card, state: GameState) => {
    if(!card.tags || card.tags.length == 0)
        return
    const modObj = state.tagModification[card.player]
    card.enhancements = card.tags.reduce((enhArr: Enhancement[], tag)=>{
        const effects = modObj[tag] || [];
        enhArr.push({tag, effects: deepCopy(effects)});
        return enhArr;
    },[])
}

export const removeEnhancements = (card: Card)=>{
    card.enhancements = null; 
}

export const handleEnhancementMechanic = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState)=>{
    const tagObj = state.tagModification[player]; 
    tagObj[mechanic.enhancedTag] = tagObj[mechanic.enhancedTag] || []; 
    tagObj[mechanic.enhancedTag].push(...deepCopy(mechanic.effects));
}