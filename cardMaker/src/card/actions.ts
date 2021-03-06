import { Card } from './interface';

export enum CardEnum{
    UPDATED_EDITED_CARD = "updatedEditedCard",
    DELETED_BY_NAME = "deletedCard",
    GOT_CARD_LIST = "gotCardList",
    GOT_CARD = 'gotCardJSON',
    UPDATED_CARD_NAME = 'updatedCardName',
    ADDED_OPTIONAL = 'cardAddedOptional',
    ADDED_EFF = 'cardAddedEffect',
    ADDED_REQ = 'cardAddedRequirement',
    CHANGE_CURRENT_CARD = 'changeCurrentCard',
    UPDATE_FILTER = 'cardUpdateFilter',
    CREATE_TAG = 'cardCreateTag',
    DELETE_TAG = 'cardDeleteTag',
    UPDATE_TAG = 'updateTag',
    UPDATE_PRIORITY = 'updatedPriority',
}

export interface UpdatePriorityAction{
    type: CardEnum.UPDATE_PRIORITY,
    priority: number
}

export interface CreateTagAction {
    type: CardEnum.CREATE_TAG,
}

export interface DeleteTagAction {
    type: CardEnum.DELETE_TAG,
    id: number
}

export interface UpdateTagAction{
    type: CardEnum.UPDATE_TAG,
    id: number,
    tag: string
}

export interface UpdateFilterAction{
    type: CardEnum.UPDATE_FILTER,
    filter: string, 
}

export interface CardAddedOptAction{
    type: CardEnum.ADDED_OPTIONAL,
    id: number
}

export interface CardAddedReqAction {
    type: CardEnum.ADDED_REQ,
    id: number
}

export interface CardAddedEffAction{
    type: CardEnum.ADDED_EFF,
    id: number
}

export interface UpdatedCardNameAction{
    type: CardEnum.UPDATED_CARD_NAME,
    name: string
}

export interface GotCardListAction{
    type: CardEnum.GOT_CARD_LIST,
    cardList: string[]
}

export interface UpdatedEditedCardAction{
    type: CardEnum.UPDATED_EDITED_CARD,
    card: Card
}

export interface DeletedCardAction{
    type: CardEnum.DELETED_BY_NAME,
    cardName: string
}  

export type CardActions = UpdatedEditedCardAction | DeletedCardAction | GotCardListAction | 
UpdatedCardNameAction | CardAddedEffAction | CardAddedOptAction | CardAddedReqAction | UpdateFilterAction |
CreateTagAction | UpdateTagAction | DeleteTagAction | UpdatePriorityAction; 