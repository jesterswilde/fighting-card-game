import { StoreState, store } from "../state/store";
import { CardJSON, MechanicJSON, StatePieceJSON, RequirementEffectJSON } from '../interfaces/cardJSON';
import { cloneDeep as clone } from 'lodash';
import { makeDefaultCardJSON } from './interface';
import { omit } from 'lodash';
import { hostURL } from '../utils';


export const cardToJSON = (state: StoreState): CardJSON => {
    if (state.card.editingCard !== null) {
        const card = clone(state.card.editingCard);
        let requirements: StatePieceJSON[] = [];
        if (card.requirements !== undefined) {
            requirements = card.requirements.map((reqId) => buildStatePiece(state, reqId));
        }
        let effects: MechanicJSON[] = [];
        if (card.effects !== undefined) {
            effects = card.effects.map((effId) => buildMechanic(state, effId));
        }
        let optional: RequirementEffectJSON[] = [];
        if (card.optional !== undefined) {
            optional = card.optional.map((optId) => buildOptional(state, optId));
        }
        const tagObjs = card.tagObjs;
        return {
            ...card,
            requirements,
            effects,
            optional,
            tagObjs,
        }
    }
    return makeDefaultCardJSON();
}


export const updateCard = () => {
    const card = cardToServerJSON(store.getState()); 
    fetch(hostURL + 'card', {
        body: JSON.stringify(card),
        headers: {
            "Content-Type": "application/json",
        },
        method: 'POST',
    })
}

const omitIdFromEff = (mech: MechanicJSON): MechanicJSON => {
    if (mech.mechanicRequirements !== undefined) {
        mech.mechanicRequirements = mech.mechanicRequirements.map((req) => omit(req, 'id'));
    }
    if (mech.mechanicEffects !== undefined) {
        mech.mechanicEffects = mech.mechanicEffects.map((eff) => omit(eff, 'id'));
    }
    if (mech.choices !== undefined) {
        mech.choices = mech.choices.map((choice) => choice.map((eff) => omit(eff, 'id')));
    }
    return omit(mech, 'id');
}

export const buildStatePiece = (state: StoreState, id: number): StatePieceJSON => {
    const spObj = state.statePiece.piecesById[id];
    if (spObj === undefined) {
        throw new Error("could not find state piece with ID " + id);
    }
    return spObj;
}

export const buildMechanic = (state: StoreState, id: number): MechanicJSON => {
    const mechObj = state.mechanic.mechanicsById[id];
    if (mechObj === undefined) {
        throw new Error("Could not find mechanic with ID " + id);
    }
    const mechJSON = {} as MechanicJSON;
    if (mechObj.choices !== undefined) {
        mechJSON.choices = mechObj.choices.map((choices = []) => {
            return choices.map((choiceID) => buildMechanic(state, choiceID))
        })
    }
    if (mechObj.mechReq !== undefined) {
        mechJSON.mechanicRequirements = mechObj.mechReq.map((reqId) => buildStatePiece(state, reqId))
    }
    if (mechObj.mechEff !== undefined) {
        mechJSON.mechanicEffects = mechObj.mechEff.map((mechId) => buildMechanic(state, mechId));
    }
    if (mechObj.amount !== undefined) {
        mechJSON.amount = mechObj.amount;
    }
    if (mechObj.axis !== undefined) {
        mechJSON.axis = mechObj.axis;
    }
    if (mechObj.player !== undefined) {
        mechJSON.player = mechObj.player
    }
    mechJSON.mechanic = mechObj.mechEnum;
    mechJSON.id = mechObj.id;
    return mechJSON;
}

export const buildOptional = (state: StoreState, id: number): RequirementEffectJSON => {
    const optional = state.optional.optionalById[id];
    if (optional === undefined) {
        throw new Error("Could not find optional with ID " + id);
    }
    const optJSON = {} as RequirementEffectJSON;
    if (optional.effects !== undefined) {
        optJSON.effects = optional.effects.map((effId) => buildMechanic(state, effId));
    }
    if (optional.requirements !== undefined) {
        optJSON.requirements = optional.requirements.map((reqId) => buildStatePiece(state, reqId));
    }
    optJSON.id = optional.id;
    return optJSON;
}


export const cardToServerJSON = (state: StoreState): CardJSON => {
    const card = cardToJSON(state);
    card.requirements = card.requirements.map((req) => omit(req, 'id'));
    card.optional = card.optional.map((opt) => {
        opt.effects = opt.effects.map(omitIdFromEff);
        return omit(opt, 'id');
    });
    card.effects = card.effects.map(omitIdFromEff);
    card.tagObjs = card.tagObjs.map((tag)=> omit(tag, 'id')); 
    return card;
}