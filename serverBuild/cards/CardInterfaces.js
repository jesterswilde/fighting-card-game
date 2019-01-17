"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MechanicEnum;
(function (MechanicEnum) {
    MechanicEnum["TELEGRAPH"] = "Telegraph";
    MechanicEnum["FOCUS"] = "Focus";
    MechanicEnum["PREDICT"] = "Predict";
    MechanicEnum["BLOCK"] = "Block";
    MechanicEnum["LOCK"] = "Lock";
    MechanicEnum["REFLEX"] = "Reflex";
})(MechanicEnum = exports.MechanicEnum || (exports.MechanicEnum = {}));
exports.MechanicHasChildren = {
    [MechanicEnum.TELEGRAPH]: true,
    [MechanicEnum.FOCUS]: true,
    [MechanicEnum.PREDICT]: true,
    [MechanicEnum.BLOCK]: false,
    [MechanicEnum.LOCK]: false,
    [MechanicEnum.REFLEX]: false
};
var AxisEnum;
(function (AxisEnum) {
    AxisEnum["DAMAGE"] = "Damage";
    AxisEnum["PRONE"] = "Prone";
    AxisEnum["STANDING"] = "Standing";
    AxisEnum["MOVING"] = "Moving";
    AxisEnum["STILL"] = "Still";
    AxisEnum["GRAPPLED"] = "Grappled";
    AxisEnum["NOT_GRAPPLED"] = "Not Grappled";
    AxisEnum["CLOSE"] = "Close";
    AxisEnum["NOT_CLOSE"] = "Not Close";
    AxisEnum["FAR"] = "Far";
    AxisEnum["NOT_FAR"] = "Not Far";
    AxisEnum["BALANCED"] = "Balanced";
    AxisEnum["UNBALANCED"] = "Unbalanced";
    AxisEnum["ANTICIPATING"] = "Anticipating";
})(AxisEnum = exports.AxisEnum || (exports.AxisEnum = {}));
var PlayerEnum;
(function (PlayerEnum) {
    PlayerEnum[PlayerEnum["PLAYER"] = 0] = "PLAYER";
    PlayerEnum[PlayerEnum["OPPONENT"] = 1] = "OPPONENT";
    PlayerEnum[PlayerEnum["BOTH"] = 2] = "BOTH";
})(PlayerEnum = exports.PlayerEnum || (exports.PlayerEnum = {}));
