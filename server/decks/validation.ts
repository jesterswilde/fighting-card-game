import { deckRepo } from "../db";
import { DBUser } from "../db/entities/user";
import { allCards } from "../cards/Cards";
import { ErrorEnum } from "../error";
import { getFightingStyleByName } from "../styles";


//All styles offer a pool of cards. This makes sure that any card they submit is valid. 
export const areCardsInStyles = (styleNames: string[], cards: string[]) => {
    const stylesObj = [...styleNames, 'Generic'].map((name) => getFightingStyleByName(name))
        .filter((style) => style !== null)
        .reduce((styleObj, style) => {
            style.cards.forEach((cardName) => {
                const card = allCards[cardName];
                if (card) {
                    styleObj[cardName] = card;
                }
            });
            return styleObj;
        }, {})
    return cards.every((cardName) => stylesObj[cardName] !== undefined && stylesObj[cardName] !== null);
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