import { CardState, makeDefaultCard } from "./interface";
import { ActionType } from '../state/actions';
import { CardEnum, DeletedCardAction, UpdatedCardNameAction } from './actions';
import { DeletedMechActon, MechActionEnum } from '../mechanic/actions';
import { filterIfHas, getID } from '../utils';
import { DeleteStatePieceAction, StatePieceEnum } from '../statePiece/actions';
import { DeletedOptionalAction, OptionalEnum } from '../optional/action';

export const cardReducer = (state: CardState = makeCardState(), action: ActionType): CardState => {
    switch (action.type) {
        case CardEnum.UPDATED_EDITED_CARD:
            return { ...state, editingCard: action.card };
        case CardEnum.UPDATE_PRIORITY:
            return {...state, editingCard: {...state.editingCard, priority: action.priority}}
        case CardEnum.UPDATED_CARD_NAME:
            return updateCardName(state, action);
        case CardEnum.DELETED_BY_NAME:
            return deletedCard(state, action);
        case CardEnum.GOT_CARD_LIST:
            return { ...state, cardNames: action.cardList };
        case CardEnum.UPDATE_FILTER:
            return { ...state, filter: action.filter };
        case MechActionEnum.DELETED:
            return deletedMechanic(state, action);
        case StatePieceEnum.DELETED:
            return deletedStatePiece(state, action);
        case OptionalEnum.DELETED:
            return deletedOptional(state, action);
        case CardEnum.ADDED_REQ:
            return { ...state, editingCard: { ...state.editingCard, requirements: [...state.editingCard.requirements, action.id] } };
        case CardEnum.ADDED_EFF:
            return { ...state, editingCard: { ...state.editingCard, effects: [...state.editingCard.effects, action.id] } };
        case CardEnum.CREATE_TAG:
            var tagObjs = [...state.editingCard.tagObjs, { value: '', id: getID() }];
            return { ...state, editingCard: { ...state.editingCard, tagObjs } };
        case CardEnum.DELETE_TAG:
            var tagObjs = state.editingCard.tagObjs.filter(({ id }) => id !== action.id);
            return { ...state, editingCard: { ...state.editingCard, tagObjs } };
        case CardEnum.UPDATE_TAG:
            var tagObjs = state.editingCard.tagObjs.map((tag) => tag.id === action.id ? { ...tag, value: action.tag } : tag);
            return { ...state, editingCard: { ...state.editingCard, tagObjs } };
        case CardEnum.ADDED_OPTIONAL:
            return { ...state, editingCard: { ...state.editingCard, optional: [...state.editingCard.optional, action.id] } };
        default:
            return state;
    }
}

const updateCardName = (state: CardState, action: UpdatedCardNameAction): CardState => {
    let editingCard = state.editingCard;
    if (editingCard === null) {
        editingCard = makeDefaultCard();
    }
    return { ...state, editingCard: { ...editingCard, name: action.name } };
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
            return { ...state, editingCard };
        }
    }
    return state;
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
            return { ...state, editingCard };
        }
    }
    return state
}

export const deletedMechanic = (state: CardState, action: DeletedMechActon): CardState => {
    let card = state.editingCard;
    if (card !== null) {
        let filtered = filterIfHas(card.effects, action.id);
        if (card.effects !== undefined && filtered !== card.effects) {
            card = { ...card, effects: filtered };
            return { ...state, editingCard: card };
        }
    }
    return state;
}

const deletedCard = (state: CardState, action: DeletedCardAction): CardState => {
    const cardNames = state.cardNames.filter((cardName) => cardName !== action.cardName);
    return { ...state, cardNames };
}

const makeCardState = (): CardState => {
    return {
        editingCard: makeDefaultCard(),
        cardNames: [],
        filter: ''
    };
}

