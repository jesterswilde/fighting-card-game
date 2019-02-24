import { makeDefaultCard } from "./interface";
import { CardEnum, DeletedCardAction, UpdatedEditedCardAction, GotCardListAction, UpdatedCardNameAction, CardAddedReqAction, CardAddedEffAction, CardAddedOptAction, UpdateFilterAction, CreateTagAction, DeleteTagAction, UpdateTagAction } from './actions';
import { store } from '../state/store';
import { hostURL } from '../utils';
import { CardJSON } from '../interfaces/cardJSON';
import { cardFromJSON } from './json';
import { PathActionEnum, ToPathStringAction } from '../path/actions';
import { dispatchToPathArray } from '../path/dispatch';

export const dispatchCreateTag = ()=>{
    const action: CreateTagAction = {
        type: CardEnum.CREATE_TAG
    }
    store.dispatch(action); 
}

export const dispatchDeleteTag = (id?: number)=>{
    if(id === undefined) return; 
    const action: DeleteTagAction = {
        type: CardEnum.DELETE_TAG,
        id
    }
    store.dispatch(action); 
}

export const dispatchUpdateTag = (id?: number, tag = '')=>{
    if(id === undefined) return; 
    const action: UpdateTagAction = {
        type: CardEnum.UPDATE_TAG,
        id,
        tag
    }
    store.dispatch(action); 
}

export const dispatchUpdateCardFilter = (filter: string)=>{
    const action: UpdateFilterAction = {
        type: CardEnum.UPDATE_FILTER,
        filter
    }
    store.dispatch(action); 
}

export const dispatchChangeCurrentCard = async (direction: number) => {
    const cardName = getName(direction);
    if (cardName) {
        const cardJSON = await getCard(cardName);
        cardFromJSON(cardJSON);
        goToCard(cardName); 
    }
}

const goToCard = (cardName: string)=>{
    const { path:{pathArr} } = store.getState();
    const newPath = [...pathArr]; 
    newPath[2] = cardName; 
    dispatchToPathArray(newPath); 
}

const getName = (direction: number) => {
    const { card: cardState } = store.getState();
    const index = cardState.cardNames.indexOf(cardState.editingCard.name);
    if (index >= 0) {
        let nextindex = index + direction;
        if (nextindex < 0) {
            nextindex = cardState.cardNames.length - 1;
        }
        if (nextindex >= cardState.cardNames.length) {
            nextindex = 0;
        }
        return cardState.cardNames[nextindex];
    }
    return null;
}

export const dispatchCardAddReq = (id: number) => {
    const action: CardAddedReqAction = {
        type: CardEnum.ADDED_REQ,
        id
    }
    store.dispatch(action)
}

export const dispatchCardAddEff = (id: number) => {
    const action: CardAddedEffAction = {
        type: CardEnum.ADDED_EFF,
        id
    }
    store.dispatch(action)
}

export const dispatchCardAddOpt = (id: number) => {
    const action: CardAddedOptAction = {
        type: CardEnum.ADDED_OPTIONAL,
        id
    }
    store.dispatch(action)
}

export const dispatchMakeBlankCard = () => {
    const pathAction: ToPathStringAction = {
        type: PathActionEnum.TO_PATH_STRING,
        path: '/edit'
    }
    dispatchUpdateEditedCard();
    store.dispatch(pathAction);
}

export const dispatchUpdatedCardName = (name: string) => {
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

const deleteCard = async (name: string) => {
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
    let cardList = await getCardList();
    cardList = cardList.sort();  
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

