import { ReadiedEffect, GameState, HappensEnum } from "../../interfaces/stateInterface";
import { getSortOrder } from "../../../shared/sortOrder";
import { reduceStateChangeReaEff } from "./effectHappens";
import { stateReaEffEvent } from "../events";
import { splitArray } from "../../util";

interface OrderPlayerObj{
    [order: number]:{
        [player: number]: ReadiedEffect
    }
}

export const applyStateEffects = (state: GameState)=>{
    let stateReaEffs = getStateReaEffs(state); 
    markConflicts(stateReaEffs);
    stateReaEffs.forEach((playerEffs)=> {
        playerEffs.forEach((reaEff)=>{
            reduceStateChangeReaEff(reaEff, state)
        })
    });
}

const getStateReaEffs = (state: GameState) => {
    const stateReaEffs: ReadiedEffect[][] = []; 
    state.readiedEffects = state.readiedEffects.map((playerEffect, index) => {
        const [stateEffects, unused] = splitArray(playerEffect, (reaEff)=> reaEff.mechanic.mechanic === undefined)
        stateReaEffs[index] = stateEffects; 
        return unused; 
    })
    return stateReaEffs; 
}


//this is for removing optional / forceful effects that override the previous effect. 
const filterDuplicateEffects = (reaEffArr: ReadiedEffect[][])=>{

}

const markConflicts = (stateReaEffs: ReadiedEffect[][])=>{
    const orderedPlayerObj: OrderPlayerObj = {}; 
    stateReaEffs.forEach((playerEffs, player)=>{
        [...playerEffs].reverse().forEach((reaEff)=>{
            reaEff.happensTo.forEach((happensEnum, targetPlayer)=>{
                if(happensEnum === HappensEnum.HAPPENS){
                    const order = getSortOrder(reaEff.mechanic.mechanic); 
                    orderedPlayerObj[order] = orderedPlayerObj[order] || {};
                    const alreadyAffected = orderedPlayerObj[order][targetPlayer];
                    if(alreadyAffected === undefined){ //Nothing has affected this before
                        orderedPlayerObj[order][targetPlayer] = reaEff; 
                    }
                    else if(alreadyAffected.card.player === reaEff.card.player){ //This is affected by an earlier mechanic on the same card
                        reaEff.happensTo[targetPlayer] = alreadyAffected.happensTo[targetPlayer];  //if the previous one was blocked, this one should be blocked too. 
                    }else{
                        orderedPlayerObj[order][targetPlayer] = handleConflict(alreadyAffected, reaEff, targetPlayer); 
                    }
                }
            })
        })
    })
}

const handleConflict = (reaEffA: ReadiedEffect, reaEffB: ReadiedEffect, targetPlayer: number)=>{
    if(reaEffA.card.priority > reaEffB.card.priority){
        reaEffB.happensTo[targetPlayer] = HappensEnum.BLOCKED; 
        return reaEffA; 
    }
    if(reaEffA.card.priority < reaEffB.card.priority){
        reaEffA.happensTo[targetPlayer] = HappensEnum.BLOCKED; 
        return reaEffB; 
    }
    reaEffA.happensTo[targetPlayer] = HappensEnum.BLOCKED; 
    reaEffB.happensTo[targetPlayer] = HappensEnum.BLOCKED; 
    return reaEffA; 
}