import { Card } from "../shared/card";
import { writeFile, readFile, readdir, unlink } from "fs";
import * as path from "path";

export let allCards: { [name: string]: Card } = {};

export const makeCardsObj = async (): Promise<{ [name: string]: Card }> => {
  return new Promise(async (res, rej) => {
    const cardNames = await getCardNames();
    const cardPromises = cardNames.map(cardName => readCardFile(cardName));
    const cards = await Promise.all(cardPromises);
    const cardObj = cards.reduce((obj, card) => {
      obj[card.name] = card;
      return obj;
    }, {});
    res(cardObj);
  });
};
const getCardNames = (): Promise<string[]> => {
  return new Promise((res, rej) => {
    readdir(path.join(__dirname, "..", "..", "cards"), (err, cardNames) => {
      if (err) {
        console.error("Couldn't read folder for cards");
        rej(err);
        return;
      } else {
        res(cardNames);
      }
    });
  });
};
const readCardFile = (fileName: string): Promise<Card> => {
  return new Promise((res, rej) => {
    readFile(
      path.join(__dirname, "..", "..", "cards", fileName),
      { encoding: "utf8" },
      (err, cardData) => {
        if (err) {
          rej(err);
        } else {
          const card: Card = JSON.parse(cardData);
          res(card);
        }
      }
    );
  });
};

//INITIALIZE CARDS OBJ;
makeCardsObj().then(cardsObj => (allCards = cardsObj));

export const removeCard = async (name: string) => {
  delete allCards[name];
  return new Promise((res, rej) => {
    unlink(path.join(__dirname, "..", "..", "cards", name + ".json"), err => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });
  });
};

export const addCard = async (cardObj: Card, index: string | null) => {
  if (index !== null) {
    delete allCards[cardObj.name];
  }
  return new Promise((res, rej) => {
    allCards[cardObj.name] = cardObj;
    writeFile(
      path.join(__dirname, "..", "..", "cards", cardObj.name + ".json"),
      JSON.stringify(cardObj, null, 2),
      err => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      }
    );
  });
};

export const downloadCards = () => {
  writeFile(
    path.join(__dirname, "..", "..", "backup.txt"),
    JSON.stringify(allCards, null, 2),
    err => {
      if (err) {
        console.error(err);
      }
    }
  );
};
