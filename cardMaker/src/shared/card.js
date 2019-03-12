"use strict";
exports.__esModule = true;
var _a;
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
})(MechanicEnum = exports.MechanicEnum || (exports.MechanicEnum = {}));
exports.getMechDisplay = function (mech) {
    var defaultValue = { state: true, value: true };
    if (mech === undefined) {
        return defaultValue;
    }
    var comp = MechanicDisplay[mech];
    if (comp) {
        return comp;
    }
    return defaultValue;
};
var MechanicDisplay = (_a = {},
    _a[MechanicEnum.TELEGRAPH] = { req: true, eff: true },
    _a[MechanicEnum.FOCUS] = { req: true, eff: true },
    _a[MechanicEnum.PREDICT] = { eff: true },
    _a[MechanicEnum.BUFF] = { valueString: true, eff: true },
    _a[MechanicEnum.ENHANCE] = { valueString: true, eff: true },
    _a[MechanicEnum.BLOCK] = { value: true },
    _a[MechanicEnum.PARRY] = { value: true },
    _a[MechanicEnum.LOCK] = { state: true, value: true },
    _a[MechanicEnum.REFLEX] = {},
    _a[MechanicEnum.CRIPPLE] = { valueString: true },
    _a[MechanicEnum.PICK_ONE] = { pick: true },
    _a[MechanicEnum.FORCEFUL] = { value: true, eff: true },
    _a);
var PlayerEnum;
(function (PlayerEnum) {
    PlayerEnum[PlayerEnum["PLAYER"] = 0] = "PLAYER";
    PlayerEnum[PlayerEnum["OPPONENT"] = 1] = "OPPONENT";
    PlayerEnum[PlayerEnum["BOTH"] = 2] = "BOTH";
})(PlayerEnum = exports.PlayerEnum || (exports.PlayerEnum = {}));
