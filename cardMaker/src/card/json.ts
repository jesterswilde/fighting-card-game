import { CardJSON } from '../interfaces/cardJSON';
import { dispatchUpdateEditedCard, dispatchCardAddReq, dispatchCardAddEff, dispatchCardAddOpt } from './dispatch';
import { Card, makeDefaultCard } from './interface';
import { mechFromJSON } from '../mechanic/json';
import { statePieceFromJSON } from '../statePiece/json';
import { optionalFromJSON } from '../optional/json';
import { getID } from '../utils';

export const cardCreateReq = ()=>{
    const id = statePieceFromJSON();
    dispatchCardAddReq(id); 
}

export const cardCreateEff = ()=>{
    const id = mechFromJSON(); 
    dispatchCardAddEff(id); 
}

export const cardCreateOpt = ()=>{
    const id = optionalFromJSON(); 
    dispatchCardAddOpt(id); 
}

export const cardFromJSON = (cardJSON: CardJSON | null) => {
    if (cardJSON === null) {
        dispatchUpdateEditedCard(makeDefaultCard());
        return;
    }
    const card = {} as Card;
    card.requirements = cardJSON.requirements.map(statePieceFromJSON)
    card.optional = cardJSON.optional.map(optionalFromJSON);
    card.effects = cardJSON.effects.map(mechFromJSON);
    card.name = cardJSON.name;
    if(cardJSON.tags === undefined){
        card.tagObjs = []
    }else{
        card.tagObjs = cardJSON.tags.map((tagObj)=> {
            if(tagObj.id === undefined){
                return {...tagObj, id: getID()}
            }
            return tagObj; 
        });
    }
    dispatchUpdateEditedCard(card);
}

