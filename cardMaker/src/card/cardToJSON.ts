import { StoreState } from "../state/store";
import { CardJSON, MechanicJSON, StatePieceJSON, RequirementEffectJSON } from '../interfaces/cardJSON';
import {cloneDeep as clone} from 'lodash';

export const cardToJSON = (state: StoreState): CardJSON | null=>{
    if(state.card.editingCard !== null){
        const card = clone(state.card.editingCard); 
        let requirements: StatePieceJSON[] = [];
        if(card.requirements !== undefined){
            requirements = card.requirements.map((reqId)=> buildStatePiece(state, reqId));
        }
        let effects: MechanicJSON[] = []; 
        if(card.effects !== undefined){
            effects = card.effects.map((effId)=> buildMechanic(state, effId)); 
        }
        let optional: RequirementEffectJSON[] = []; 
        if(card.optional !== undefined){
            optional = card.optional.map((optId)=> buildOptional(state, optId)); 
        }
        return {
            ...card,
            requirements,
            effects,
            optional
        }
    }
    return null; 
}

export const buildStatePiece = (state: StoreState, id:  number): StatePieceJSON=>{
    const spObj = state.statePiece.piecesById[id]; 
    if(spObj === undefined){
        throw new Error("could not find state piece with ID " + id); 
    }
    return spObj; 
}

export const buildMechanic = (state: StoreState, id: number): MechanicJSON=>{
    const mechObj = state.mechanic.mechanicsById[id];
    if(mechObj === undefined){
        throw new Error("Could not find mechanic with ID " + id); 
    }
    const mechJSON = {} as MechanicJSON; 
    if(mechObj.choices !== undefined){
        mechJSON.choices = mechObj.choices.map((choices = [])=>{
            return choices.map((choiceID)=> buildMechanic(state, choiceID))
        })
    }
    if(mechObj.mechReq !== undefined){
        mechJSON.mechanicRequirements = mechObj.mechReq.map((reqId)=> buildStatePiece(state, reqId))
    }
    if(mechObj.mechEff !== undefined){
        mechJSON.mechanicEffects = mechObj.mechEff.map((mechId)=> buildMechanic(state, mechId)); 
    }
    if(mechObj.amount !== undefined){
        mechJSON.amount = mechObj.amount; 
    }
    if(mechObj.axis !== undefined){
        mechJSON.axis = mechObj.axis;
    }
    if(mechObj.player !== undefined){
        mechJSON.player = mechObj.player
    }
    mechJSON.mechanic = mechObj.mechEnum; 
    mechJSON.id = mechObj.id; 
    return mechJSON; 
}

export const buildOptional = (state: StoreState, id: number): RequirementEffectJSON=>{
    const optional = state.optional.optionalById[id]; 
    if(optional === undefined){
        throw new Error("Could not find optional with ID " + id); 
    }
    const optJSON = {} as RequirementEffectJSON; 
    if(optional.effects !== undefined){
        optJSON.effects = optional.effects.map((effId)=> buildMechanic(state, effId)); 
    }
    if(optional.requirements !== undefined){
        optJSON.requirements = optional.requirements.map((reqId)=> buildStatePiece(state, reqId)); 
    }
    optJSON.id = optional.id; 
    return optJSON;
}