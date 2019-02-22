import { CardJSON, StatePieceJSON, RequirementEffectJSON, MechanicJSON } from 'src/interfaces/cardJSON';
import { dispatchUpdateEditedCard } from './dispatch';
import { Card } from './interface';
import { getID } from 'src/utils';
import { dispatchUpdatedStatePiece } from 'src/statePiece/dispatch';
import { StatePiece } from 'src/statePiece/interface';
import { Optional } from 'src/optional/interface';
import { dispatchUpdateOptional } from 'src/optional/dispatch';
import { Mechanic } from 'src/mechanic/interface';
import { dispatchUpdatedMechanic } from 'src/mechanic/dispatch';

export const editJSONCard = (cardJSON: CardJSON) => {
    const card = {} as Card;
    card.requirements = cardJSON.requirements.map(handleStatePiece)
    card.optional = cardJSON.optional.map(handleOptional); 
    card.effects = cardJSON.effects.map(hanldeMehcanic); 
    dispatchUpdateEditedCard(card); 
}

const handleStatePiece = (pieceJSON: StatePieceJSON): number => {
    const piece = { ...pieceJSON } as StatePiece;
    if (piece.id === undefined) {
        piece.id = getID();
    }
    dispatchUpdatedStatePiece(piece.id, piece);
    return piece.id;
}

const hanldeMehcanic = (mechJSON: MechanicJSON): number => {
    const mech = {} as Mechanic;
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
    if (mechJSON.player !== undefined) {
        mech.player = mechJSON.player;
    }
    if (mechJSON.mechanicRequirements !== undefined) {
        mech.mechReq = mechJSON.mechanicRequirements.map(handleStatePiece);
    }
    if (mechJSON.mechanicEffects !== undefined) {
        mech.mechEff = mechJSON.mechanicEffects.map(hanldeMehcanic);
    }
    if (mechJSON.choices !== undefined) {
        mech.choices = mechJSON.choices.map((choiceArr) => choiceArr.map(hanldeMehcanic));
    }
    dispatchUpdatedMechanic(mech.id, mech);
    return mech.id;
}

const handleOptional = (optJSON: RequirementEffectJSON): number => {
    const optional = {} as Optional;
    if (optJSON.id !== undefined) {
        optional.id = optJSON.id;
    } else {
        optional.id = getID();
    }
    optional.requirements = optJSON.requirements.map(handleStatePiece);
    optional.effects = optJSON.effects.map(hanldeMehcanic);
    dispatchUpdateOptional(optional.id, optional);
    return optional.id;
}