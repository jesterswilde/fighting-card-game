import { deckRepo } from "../db";
import { DBUser } from "../db/entities/user";
import { allCards } from "../cards/Cards";
import { ErrorEnum } from "../error";
import { getFightingStyleByName, getAllFightingStylesArr } from "../styles";
import { sortCard } from "../shared/sortOrder";


let styleByCard: {[cardName: string]: string} = null;
const sortCardsByStyle=()=>{
    styleByCard = {}; 
    getAllFightingStylesArr().forEach(style =>{
        style.cards.forEach(cardName =>{
            styleByCard[cardName] = style.name 
        })
    })
}

//All styles offer a pool of cards. This makes sure that any card they submit is valid. 
export const areCardsInStyles = (styleNames: string[], cards: string[]) => {
    if(styleByCard == null)
        sortCardsByStyle(); 
    const stylesSet = new Set([...styleNames, 'Generic'])
    return cards.every((cardName) => stylesSet.has(styleByCard[cardName]));
}

//Just make sure the user owns the deck
export const getValidDeck = async (user: DBUser, deckID: number) => {
    const deck = await deckRepo.findOne({
        where: { id: deckID },
        relations: ['user']
    });
    if (deck.user.id !== user.id) {
        throw ErrorEnum.DOESNT_OWN_DECK;
    }
    return deck;
}