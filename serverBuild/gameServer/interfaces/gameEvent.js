"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventType;
(function (EventType) {
    EventType["PLAYED_CARD"] = "PlayedCard";
    EventType["MECHANIC"] = "MechanicActivation";
    EventType["REVEAL_PREDICTION"] = "RevealPrediction";
    EventType["GAME_OVER"] = "GameOver";
    EventType["REFLEX"] = "Reflex";
    EventType["USED_FORCEFUL"] = "Forceful";
    EventType["PICKED_ONE"] = "PickedOne";
    EventType["HAS_PREDICTION"] = "HasPrediction";
})(EventType = exports.EventType || (exports.EventType = {}));
var EventEffectType;
(function (EventEffectType) {
    EventEffectType[EventEffectType["EFFECT"] = 0] = "EFFECT";
    EventEffectType[EventEffectType["CHOICE"] = 1] = "CHOICE";
})(EventEffectType = exports.EventEffectType || (exports.EventEffectType = {}));
/*
export interface FrontEndEffect{
  type: EventEffectType,
  display?: string,
  axis?: AxisEnum
  amount?: number
  player?: PlayerEnum
  isBlocked?: boolean
}*/
