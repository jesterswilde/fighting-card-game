import { Card } from './interface';

export enum CardEnum{
    UPDATED_EDITED_CARD = "updatedEditedCard",
    DELETED_BY_NAME = "deletedCard",
    GOT_CARD_LIST = "gotCardList"
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

export type CardActions = UpdatedEditedCardAction | DeletedCardAction | GotCardListAction; 