import { CardState } from "./interface";
import { ActionType } from '../state/actions';
import { CardEnum, DeletedCardAction } from './actions';
import { omit } from 'lodash';
import { DeletedMechanicActon, MechanicActionEnum } from '../mechanic/actions';
import { filterIfHas } from '../utils';
import { DeleteStatePieceAction, StatePieceEnum } from '../statePiece/actions';
import { DeletedOptionalAction, OptionalEnum } from '../optional/action';

export const cardReducer = (state: CardState = makeCardState(), action: ActionType): CardState => {
    switch (action.type) {
        case CardEnum.UPDATED_EDITED_CARD:
            return { ...state, editingCard: action.card }
        case CardEnum.DELETED_BY_NAME:
            return deletedCard(state, action);
        case CardEnum.GOT_CARD_LIST:
            return { ...state, cardNames: action.cardList }
        case MechanicActionEnum.DELETED:
            return deletedMechanic(state, action);
        case StatePieceEnum.DELETED:
            return deletedStatePiece(state, action);
        case OptionalEnum.DELETED:
            return deletedOptional(state, action);
        default:
            return state;
    }
}

export const deletedOptional = (state: CardState, action: DeletedOptionalAction): CardState => {
    if (state.editingCard !== null) {
        if (state.editingCard.optional === undefined) {
            return state;
        }
        const filtered = filterIfHas(state.editingCard.optional, action.id);
        if (filtered !== state.editingCard.optional) {
            const editingCard = { ...state.editingCard };
            editingCard.optional = filtered;
            return { ...state, editingCard }
        }
    }
    return state
}

export const deletedStatePiece = (state: CardState, action: DeleteStatePieceAction): CardState => {
    if (state.editingCard !== null) {
        if (state.editingCard.requirements === undefined) {
            return state;
        }
        const filtered = filterIfHas(state.editingCard.requirements, action.id);
        if (filtered !== state.editingCard.requirements) {
            const editingCard = { ...state.editingCard };
            editingCard.requirements = filtered;
            return { ...state, editingCard }
        }
    }
    return state
}

export const deletedMechanic = (state: CardState, action: DeletedMechanicActon): CardState => {
    let card = state.editingCard;
    if (card !== null) {
        let filtered = filterIfHas(card.effects, action.id);
        if (card.effects !== undefined && filtered !== card.effects) {
            card = { ...card, effects: filtered };
            return { ...state, editingCard: card }
        }
        filtered = filterIfHas(card.effects, action.id);
        if (card.optional !== undefined && filtered !== card.optional) {
            card = { ...card, optional: filtered };
            return { ...state, editingCard: card };
        }
    }
    return state;
}

const deletedCard = (state: CardState, action: DeletedCardAction): CardState => {
    const cardNames = omit(state.cardNames, action.cardName);
    return { ...state, cardNames }
}

const makeCardState = (): CardState => {
    return {
        editingCard: null,
        cardNames: []
    }
}