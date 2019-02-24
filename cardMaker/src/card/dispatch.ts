import { makeDefaultCard } from "./interface";
import { CardEnum, DeletedCardAction, UpdatedEditedCardAction, GotCardListAction, UpdatedCardNameAction, CardAddedReqAction, CardAddedEffAction, CardAddedOptAction } from './actions';
import { store } from '../state/store';
import { hostURL } from '../utils';
import { CardJSON } from '../interfaces/cardJSON';
import { cardFromJSON } from './json';
import { PathActionEnum, ToPathStringAction } from '../path/actions';

export const dispatchCardAddReq = (id: number)=>{
    const action: CardAddedReqAction = {
        type: CardEnum.ADDED_REQ,
        id
    }
    store.dispatch(action)
}

export const dispatchCardAddEff = (id: number)=>{
    const action: CardAddedEffAction = {
        type: CardEnum.ADDED_EFF,
        id
    }
    store.dispatch(action)
}

export const dispatchCardAddOpt = (id: number)=>{
    const action: CardAddedOptAction = {
        type: CardEnum.ADDED_OPTIONAL,
        id
    }
    store.dispatch(action)
}

export const dispatchMakeBlankCard = ()=>{
    const pathAction: ToPathStringAction = {
        type: PathActionEnum.TO_PATH_STRING,
        path: '/edit'
    }
    dispatchUpdateEditedCard(); 
    store.dispatch(pathAction);
}

export const dispatchUpdatedCardName = (name: string)=>{
    const action: UpdatedCardNameAction = {
        type: CardEnum.UPDATED_CARD_NAME,
        name
    }
    store.dispatch(action); 
}

export const dispatchGetCard = async (cardName: string) => {
    const cardJSON = await getCard(cardName); 
    cardFromJSON(cardJSON); 
}

const getCard = async (cardName: string) => {
    try {
        const response = await fetch(hostURL + 'card/' + cardName);
        const card: CardJSON = await response.json();
        return card; 
    } catch (err) {
        return null;
    }
}

export const dispatchUpdateEditedCard = (card = makeDefaultCard()) => {
    const action: UpdatedEditedCardAction = {
        type: CardEnum.UPDATED_EDITED_CARD,
        card
    }
    store.dispatch(action);
}

export const dispatchDeleteCard = async (cardName: string) => {
    await deleteCard(cardName);
    const action: DeletedCardAction = {
        type: CardEnum.DELETED_BY_NAME,
        cardName,
    }
    store.dispatch(action);

}

const deleteCard = async (cardName: string) => {
    try {
        await fetch(hostURL + 'card', {
            body: JSON.stringify({ name }),
            headers: {
                "Content-Type": "application/json",
            },
            method: 'DELETE',
        })
    }
    catch (err) {
        console.error(err);
    }
}

export const dispatchGetCardList = async () => {
    const cardList = await getCardList();
    const action: GotCardListAction = {
        type: CardEnum.GOT_CARD_LIST,
        cardList
    }
    store.dispatch(action);
}

const getCardList = async () => {
    try {
        const response = await fetch(hostURL + 'cards');
        const cardsObj: { [name: string]: string } = await response.json();
        const cardList = Object.keys(cardsObj).sort().map((name) => cardsObj[name]);
        return cardList;
    } catch (err) {
        return [];
    }
}

