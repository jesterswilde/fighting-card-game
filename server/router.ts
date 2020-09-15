import { Router } from "express";
import { addCard, allCards, removeCard, downloadCards } from "./cards/Cards";
import { sortCard } from "./shared/sortOrder";
import { getFightingStyles, getFightingStyleByName } from "./styles";
import { userRouter } from "./users/router";
import { decksRouter } from "./decks/router";

const isProduction = process.env.PRODUCTION == "production"; 

const router = Router();

router.use("/users", userRouter);
router.use("/decks", decksRouter);


router.get("/cards", (req, res) => {
  const cardList = Object.keys(allCards);
  res.status(200).send(cardList);
});
router.get("/card/:name", (req, res) => {
  const card = allCards[req.params.name];
  res.status(200).send(card || null);
});
router.get("/styles", (req, res) => {
  res.status(200).send(getFightingStyles());
});
router.get("/styles/:style", (req, res) => {
  const styleName = req.params.style;
  const style = getFightingStyleByName(styleName);
  if (style) {
    res.status(200).send(style);
  } else {
    res.status(418).send();
  }
});


router.post("/card", (req, res) => {
  if(isProduction)
    res.status(401).send();
  const { index, ...card } = req.body;
  sortCard(card);
  addCard(card, card.index);
  res.status(201).send();
});
router.delete("/card", async (req, res) => {
  if(isProduction)
    res.status(401).send();
  try {
    await removeCard(req.body.name);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(400).send();
  }
});

export default router;
