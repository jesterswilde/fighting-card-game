"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
