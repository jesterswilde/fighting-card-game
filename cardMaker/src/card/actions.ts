import { Card } from './interface';

export enum CardEnum{
    UPDATED_EDITED_CARD = "updatedEditedCard",
    DELETED_BY_NAME = "deletedCard",
    GOT_CARD_LIST = "gotCardList",
    GOT_CARD = 'gotCardJSON',
    UPDATED_CARD_NAME = 'updatedCardName',
    ADDED_OPTIONAL = 'cardAddedOptional',
    ADDED_EFF = 'cardAddedEffect',
    ADDED_REQ = 'cardAddedRequirement'
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
UpdatedCardNameAction | CardAddedEffAction | CardAddedOptAction | CardAddedReqAction; 