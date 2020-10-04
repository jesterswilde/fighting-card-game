"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Cards_1 = require("./cards/Cards");
const styles_1 = require("./styles");
const router_1 = require("./users/router");
const router_2 = require("./decks/router");
const isProduction = process.env.PRODUCTION == "production";
const router = express_1.Router();
router.use("/users", router_1.userRouter);
router.use("/decks", router_2.decksRouter);
router.get("/cards", (req, res) => {
    const cardList = Object.keys(Cards_1.allCards);
    res.status(200).send(cardList);
});
router.get("/card/:name", (req, res) => {
    const card = Cards_1.allCards[req.params.name];
    res.status(200).send(card || null);
});
router.get("/styles", (req, res) => {
    res.status(200).send(styles_1.getFightingStyles());
});
router.get("/styles/:style", (req, res) => {
    const styleName = req.params.style;
    const style = styles_1.getFightingStyleByName(styleName);
    if (style) {
        res.status(200).send(style);
    }
    else {
        res.status(418).send();
    }
});
exports.default = router;
