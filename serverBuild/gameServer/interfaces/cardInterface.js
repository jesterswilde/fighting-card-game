"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PredictionEnum;
(function (PredictionEnum) {
    PredictionEnum[PredictionEnum["NONE"] = 0] = "NONE";
    PredictionEnum[PredictionEnum["DISTANCE"] = 1] = "DISTANCE";
    PredictionEnum[PredictionEnum["STANDING"] = 2] = "STANDING";
    PredictionEnum[PredictionEnum["MOTION"] = 3] = "MOTION";
    PredictionEnum[PredictionEnum["BALANCE"] = 4] = "BALANCE";
})(PredictionEnum = exports.PredictionEnum || (exports.PredictionEnum = {}));
var MechanicEnum;
(function (MechanicEnum) {
    MechanicEnum["TELEGRAPH"] = "Telegraph";
    MechanicEnum["FOCUS"] = "Focus";
    MechanicEnum["PREDICT"] = "Predict";
    MechanicEnum["BLOCK"] = "Block";
    MechanicEnum["LOCK"] = "Lock";
    MechanicEnum["REFLEX"] = "Reflex";
    MechanicEnum["BUFF"] = "Buff";
    MechanicEnum["CRIPPLE"] = "Cripple";
})(MechanicEnum = exports.MechanicEnum || (exports.MechanicEnum = {}));
var DisplayEnum;
(function (DisplayEnum) {
    DisplayEnum[DisplayEnum["REQ_EFF"] = 0] = "REQ_EFF";
    DisplayEnum[DisplayEnum["EFF"] = 1] = "EFF";
    DisplayEnum[DisplayEnum["NORMAL"] = 2] = "NORMAL";
    DisplayEnum[DisplayEnum["NAME"] = 3] = "NAME";
    DisplayEnum[DisplayEnum["AMOUNT"] = 4] = "AMOUNT";
    DisplayEnum[DisplayEnum["NONE"] = 5] = "NONE";
})(DisplayEnum = exports.DisplayEnum || (exports.DisplayEnum = {}));
exports.MechanicDisplay = {
    [MechanicEnum.TELEGRAPH]: DisplayEnum.REQ_EFF,
    [MechanicEnum.FOCUS]: DisplayEnum.REQ_EFF,
    [MechanicEnum.PREDICT]: DisplayEnum.EFF,
    [MechanicEnum.BUFF]: DisplayEnum.NORMAL,
    [MechanicEnum.BLOCK]: DisplayEnum.AMOUNT,
    [MechanicEnum.LOCK]: DisplayEnum.NORMAL,
    [MechanicEnum.REFLEX]: DisplayEnum.NONE,
    [MechanicEnum.CRIPPLE]: DisplayEnum.NAME
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
    AxisEnum["CLOSER"] = "Closer";
    AxisEnum["FURTHER"] = "Further";
    AxisEnum["BLOODIED"] = "Bloodied";
})(AxisEnum = exports.AxisEnum || (exports.AxisEnum = {}));
var PlayerEnum;
(function (PlayerEnum) {
    PlayerEnum[PlayerEnum["PLAYER"] = 0] = "PLAYER";
    PlayerEnum[PlayerEnum["OPPONENT"] = 1] = "OPPONENT";
    PlayerEnum[PlayerEnum["BOTH"] = 2] = "BOTH";
})(PlayerEnum = exports.PlayerEnum || (exports.PlayerEnum = {}));
