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
var BalanceEnum;
(function (BalanceEnum) {
    BalanceEnum[BalanceEnum["BALANCED"] = 0] = "BALANCED";
    BalanceEnum[BalanceEnum["UNBALANCED"] = 1] = "UNBALANCED";
    BalanceEnum[BalanceEnum["ANTICIPATING"] = 2] = "ANTICIPATING";
})(BalanceEnum = exports.BalanceEnum || (exports.BalanceEnum = {}));
var StandingEnum;
(function (StandingEnum) {
    StandingEnum[StandingEnum["PRONE"] = 0] = "PRONE";
    StandingEnum[StandingEnum["STANDING"] = 1] = "STANDING";
})(StandingEnum = exports.StandingEnum || (exports.StandingEnum = {}));
var MotionEnum;
(function (MotionEnum) {
    MotionEnum[MotionEnum["STILL"] = 0] = "STILL";
    MotionEnum[MotionEnum["MOVING"] = 1] = "MOVING";
})(MotionEnum = exports.MotionEnum || (exports.MotionEnum = {}));
var DistanceEnum;
(function (DistanceEnum) {
    DistanceEnum[DistanceEnum["GRAPPLED"] = 0] = "GRAPPLED";
    DistanceEnum[DistanceEnum["CLOSE"] = 1] = "CLOSE";
    DistanceEnum[DistanceEnum["FAR"] = 2] = "FAR";
})(DistanceEnum = exports.DistanceEnum || (exports.DistanceEnum = {}));
