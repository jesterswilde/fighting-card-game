import { MechanicJSON } from '../interfaces/cardJSON';
import { Mechanic, makeDefaultMechanic } from './interface';
import { getID } from '../utils';
import { dispatchUpdatedMech, dispatchMechAddChoice, dispatchMechAddReq, dispatchMechAddEff } from './dispatch';
import { statePieceFromJSON } from '../statePiece/json';

export const mechAddChoice = (id?: number, choiceIndex?: number) => {
    if(id === undefined || choiceIndex === undefined) return; 
    const choiceId = mechFromJSON();
    dispatchMechAddChoice(id, choiceIndex, choiceId);
}

export const mechAddReq = (id?: number) => {
    if(id === undefined) return;
    const reqId = statePieceFromJSON();
    dispatchMechAddReq(id, reqId);
}

export const mechAddEff = (id?: number) => {
    if(id === undefined) return; 
    const effId = mechFromJSON();
    dispatchMechAddEff(id, effId);
}

export const mechFromJSON = (mechJSON?: MechanicJSON): number => {
    let mech: Mechanic;
    console.log('mechJSON',mechJSON); 
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
