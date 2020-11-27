"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanceEnum = exports.MotionEnum = exports.StandingEnum = exports.PoiseEnum = exports.PredictionEnum = exports.HappensEnum = void 0;
var HappensEnum;
(function (HappensEnum) {
    HappensEnum[HappensEnum["NEVER_AFFECTED"] = 0] = "NEVER_AFFECTED";
    HappensEnum[HappensEnum["HAPPENS"] = 1] = "HAPPENS";
    HappensEnum[HappensEnum["BLOCKED"] = 2] = "BLOCKED";
})(HappensEnum = exports.HappensEnum || (exports.HappensEnum = {}));
var PredictionEnum;
(function (PredictionEnum) {
    PredictionEnum["NONE"] = "None";
    PredictionEnum["DISTANCE"] = "Distance";
    PredictionEnum["STANDING"] = "Standing";
    PredictionEnum["MOTION"] = "Motion";
})(PredictionEnum = exports.PredictionEnum || (exports.PredictionEnum = {}));
var PoiseEnum;
(function (PoiseEnum) {
    PoiseEnum[PoiseEnum["BALANCED"] = 0] = "BALANCED";
    PoiseEnum[PoiseEnum["UNBALANCED"] = 1] = "UNBALANCED";
    PoiseEnum[PoiseEnum["ANTICIPATING"] = 2] = "ANTICIPATING";
    PoiseEnum[PoiseEnum["NOT_ANTICIPATING"] = 3] = "NOT_ANTICIPATING";
})(PoiseEnum = exports.PoiseEnum || (exports.PoiseEnum = {}));
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
