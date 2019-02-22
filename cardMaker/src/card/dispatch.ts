import { Card } from "./interface";
import { CardEnum, DeletedCardAction, UpdatedEditedCardAction, GotCardListAction } from './actions';
import { store } from '../state/store';
import { hostURL } from '../utils';

export const dispatchUpdateEditedCard = (card: Card) => {
    const action: UpdatedEditedCardAction = {
        type: CardEnum.UPDATED_EDITED_CARD,
        card
    }
    store.dispatch(action);
}

export const dispatchDeletedCard = async (cardName: string) => {
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

export const dispatchGetCardList = async() => {
    const cardList = await getCardList(); 
    const action: GotCardListAction = {
        type: CardEnum.GOT_CARD_LIST,
        cardList
    }
    store.dispatch(action); 
}

const getCardList = async()=>{
    try{
        const response = await fetch(hostURL + 'cards');
        const cardsObj: { [name: string]: string } = await response.json();
        const cardList = Object.keys(cardsObj).sort().map((name) => cardsObj[name]);
        return cardList; 
    }catch(err){
        return []; 
    }
}

