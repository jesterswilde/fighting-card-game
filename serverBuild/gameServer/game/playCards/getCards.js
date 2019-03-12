"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const util_1 = require("../../util");
exports.getCardByName = (name) => {
    const card = crippledObj[name];
    if (card === undefined) {
        return util_1.makeBlankCard();
    }
    return Object.assign({}, card);
};
const crippledObj = {
    "Everything": {
        name: "Crippled Everything",
        requirements: [],
        effects: [{ axis: card_1.AxisEnum.DAMAGE, player: card_1.PlayerEnum.PLAYER, amount: 3000 }],
        optional: [],
        isFaceUp: true
    },
    "Leg": {
        name: "Crippled Leg",
        requirements: [{ axis: card_1.AxisEnum.MOVING, player: card_1.PlayerEnum.PLAYER }],
        effects: [{ axis: card_1.AxisEnum.PRONE, player: card_1.PlayerEnum.PLAYER }, { axis: card_1.AxisEnum.DAMAGE, player: card_1.PlayerEnum.PLAYER, amount: 3 }],
        optional: [],
        isFaceUp: true
    },
    "Chest": {
        name: "Crippled Chest",
        requirements: [{ axis: card_1.AxisEnum.STANDING, player: card_1.PlayerEnum.PLAYER }],
        effects: [{ axis: card_1.AxisEnum.DAMAGE, player: card_1.PlayerEnum.PLAYER, amount: 10 }],
        optional: [],
        isFaceUp: true
    }
};
