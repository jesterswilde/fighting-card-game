import { Mechanic, Card, MechanicEnum } from "../../../shared/card";
import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";

/*
    Block N mitigates N damge done NEXT turn.  
    Parry N mitigates N damage done this turn. 
    At the start of each turn, block from the previous turn is converted to parry. 
*/

export const reduceBlock = (mechanic: Mechanic, card: Card, player: number, opponent: number, state: GameState) => {
    const { block } = state;
    block[player] = block[player] || 0;
    if (typeof mechanic.amount === 'number') {
        block[player] += mechanic.amount;
    }
    console.log('block was played', state.block);
}

export const collectBlock = (state: GameState) => {
    const blockArrs: ReadiedEffect[][] = []; 
    state.readiedEffects = state.readiedEffects.map((playerEff, index)=>{
        const [hasBlock, unused] = splitArray(playerEff, (reaEff) => reaEff.mechanic.mechanic === MechanicEnum.BLOCK);
        blockArrs[index] = hasBlock;
        return unused;
    })
    const block = blockArrs.map((arr) => {
        return arr.reduce((total, { mechanic: { amount = 0 } }) => total + Number(amount), 0);
    });
    block.forEach((amount, index)=> state.block[index] += amount); 
}


export const convertBlockToParry = (state: GameState) => {
    state.block = state.block.map((block, index) => {
        state.parry[index] += block;
        return 0;
    })
}