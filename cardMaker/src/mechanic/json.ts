import { MechanicJSON } from '../interfaces/cardJSON';
import { Mechanic, makeDefaultMechanic } from './interface';
import { getID } from '../utils';
import { dispatchUpdatedMech, dispatchMechAddReq, dispatchMechAddEff, dispatchMechAddedToChoice } from './dispatch';
import { statePieceFromJSON } from '../statePiece/json';

export const mechAddToChoice = (id?: number, choiceIndex?: number) => {
    if(id === undefined || choiceIndex === undefined) return; 
    const choiceId = mechFromJSON();
    dispatchMechAddedToChoice(id, choiceIndex, choiceId);
}

export const mechCreateReq = (id?: number) => {
    if(id === undefined) return;
    const reqId = statePieceFromJSON();
    dispatchMechAddReq(id, reqId);
}

export const mechCreateEff = (id?: number) => {
    if(id === undefined) return; 
    const effId = mechFromJSON();
    dispatchMechAddEff(id, effId);
}

export const mechFromJSON = (mechJSON?: MechanicJSON): number => {
    let mech: Mechanic;
    if (mechJSON === undefined) {
        mech = makeDefaultMechanic();
    } else {
        mech = {} as Mechanic;
        if (mechJSON.id !== undefined) {
            mech.id = mechJSON.id;
        } else {
            mech.id = getID();
        }
        if (mechJSON.amount !== undefined) {
            mech.amount = mechJSON.amount;
        }
        if (mechJSON.axis !== undefined) {
            mech.axis = mechJSON.axis;
        }
        if (mechJSON.mechanic !== undefined) {
            mech.mechEnum = mechJSON.mechanic;
        }
        if (mechJSON.player !== undefined) {
            mech.player = mechJSON.player;
        }
        if (mechJSON.mechanicRequirements !== undefined) {
            mech.mechReq = mechJSON.mechanicRequirements.map(statePieceFromJSON);
        }
        if (mechJSON.mechanicEffects !== undefined) {
            mech.mechEff = mechJSON.mechanicEffects.map(mechFromJSON);
        }
        if (mechJSON.choices !== undefined) {
            mech.choices = mechJSON.choices.map((choiceArr) => choiceArr.map(mechFromJSON));
        }
    }
    dispatchUpdatedMech(mech);
    return mech.id;
}
