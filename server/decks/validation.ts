import { deckRepo } from "../db";
import { DBUser } from "../db/entities/user";
import { ErrorEnum } from "../error";
import { getAllFightingStylesArr } from "../styles";

let styleByCard: { [cardName: string]: string } = {};
let stylesLoaded = false;
const sortCardsByStyle = () => {
  stylesLoaded = true;
  styleByCard = {};
  getAllFightingStylesArr().forEach((style) => {
    style.cards.forEach((cardName) => {
      styleByCard[cardName] = style.name;
    });
  });
};

//All styles offer a pool of cards. This makes sure that any card they submit is valid.
export const areCardsInStyles = (styleNames: string[], cards: string[]) => {
  if (!stylesLoaded) {
    sortCardsByStyle();
  }
  const stylesSet = new Set([...styleNames, "Generic"]);
  return cards.every((cardName) => stylesSet.has(styleByCard[cardName]));
};

//Just make sure the user owns the deck
export const getValidDeck = async (user: DBUser, deckID: number) => {
  const deck = await deckRepo.findOne({
    where: { id: deckID },
    relations: ["user"],
  });
  if (!deck || deck.user.id !== user.id) {
    throw ErrorEnum.DOESNT_OWN_DECK;
  }
  return deck;
};
