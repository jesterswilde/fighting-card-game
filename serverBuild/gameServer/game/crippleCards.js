"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardInterface_1 = require("../interfaces/cardInterface");
exports.getCrippleCard = (name) => {
    return crippledObj[name];
};
const crippledObj = {
    "Crippled Leg": {
        name: "Crippled Leg",
        requirements: [{ axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.PLAYER }],
        effects: [{ axis: cardInterface_1.AxisEnum.PRONE, player: cardInterface_1.PlayerEnum.PLAYER }, { axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.PLAYER, amount: 3 }],
        optional: []
    },
    "Crippled Chest": {
        name: "Crippled Chest",
        requirements: [{ axis: cardInterface_1.AxisEnum.STANDING, player: cardInterface_1.PlayerEnum.PLAYER }],
        effects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.PLAYER, amount: 10 }],
        optional: []
    }
};
