"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    AxisEnum["NOT_ANTICIPATING"] = "Not Anticipating";
    AxisEnum["CLOSER"] = "Closer";
    AxisEnum["FURTHER"] = "Further";
    AxisEnum["BLOODIED"] = "Bloodied";
    AxisEnum["FRESH"] = "Fresh";
    AxisEnum["MOTION"] = "Motion";
    AxisEnum["DISTANCE"] = "Distance";
    AxisEnum["POISE"] = "Poise";
    AxisEnum["LOSE_POISE"] = "Lose Poise";
    AxisEnum["STANCE"] = "Stance";
})(AxisEnum = exports.AxisEnum || (exports.AxisEnum = {}));
var MechanicEnum;
(function (MechanicEnum) {
    MechanicEnum["TELEGRAPH"] = "Telegraph";
    MechanicEnum["FOCUS"] = "Focus";
    MechanicEnum["PREDICT"] = "Predict";
    MechanicEnum["PARRY"] = "Parry";
    MechanicEnum["BLOCK"] = "Block";
    MechanicEnum["LOCK"] = "Lock";
    MechanicEnum["REFLEX"] = "Reflex";
    MechanicEnum["BUFF"] = "Buff";
    MechanicEnum["CRIPPLE"] = "Cripple";
    MechanicEnum["PICK_ONE"] = "Pick One";
    MechanicEnum["FORCEFUL"] = "Forceful";
    MechanicEnum["ENHANCE"] = "Enhance";
    MechanicEnum["CLUTCH"] = "Clutch";
    MechanicEnum["SETUP"] = "Setup";
})(MechanicEnum = exports.MechanicEnum || (exports.MechanicEnum = {}));
exports.getMechDisplay = (mech) => {
    const defaultValue = { state: true, value: true };
    if (mech === undefined) {
        return defaultValue;
    }
    const comp = MechanicDisplay[mech];
    if (comp) {
        return comp;
    }
    return defaultValue;
};
const MechanicDisplay = {
    [MechanicEnum.TELEGRAPH]: { req: true, eff: true },
    [MechanicEnum.FOCUS]: { req: true, eff: true },
    [MechanicEnum.PREDICT]: { eff: true },
    [MechanicEnum.BUFF]: { valueString: true, eff: true },
    [MechanicEnum.ENHANCE]: { valueString: true, eff: true },
    [MechanicEnum.BLOCK]: { value: true },
    [MechanicEnum.PARRY]: { value: true },
    [MechanicEnum.LOCK]: { state: true, value: true },
    [MechanicEnum.REFLEX]: {},
    [MechanicEnum.CRIPPLE]: { valueString: true },
    [MechanicEnum.PICK_ONE]: { pick: true },
    [MechanicEnum.FORCEFUL]: { value: true, eff: true },
    [MechanicEnum.CLUTCH]: { value: true },
    [MechanicEnum.SETUP]: { value: true },
};
var PlayerEnum;
(function (PlayerEnum) {
    PlayerEnum[PlayerEnum["PLAYER"] = 0] = "PLAYER";
    PlayerEnum[PlayerEnum["OPPONENT"] = 1] = "OPPONENT";
    PlayerEnum[PlayerEnum["BOTH"] = 2] = "BOTH";
})(PlayerEnum = exports.PlayerEnum || (exports.PlayerEnum = {}));
