"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameEvent_1 = require("../../gameServer/interfaces/gameEvent");
const stateInterface_1 = require("../../gameServer/interfaces/stateInterface");
const util_1 = require("../../gameServer/util");
const card_1 = require("../../shared/card");
exports.eventsToFrontend = (events) => {
    return events.map(eventPair => {
        return eventPair.map((eventAction, i) => {
            const effects = breakApartArray(eventAction.effects, i)
                .map(eff => toFrontendEffect(eff));
            const frontendEvent = util_1.deepCopy(eventAction);
            frontendEvent.effects = effects;
            return frontendEvent;
        });
        /*
        let standingEffs: EventEffect[][] = [[],[]]
        let hasStanding = false
        let motionEffs: EventEffect[][] = [[],[]]
        let hasMotion = false
        const resultEffs = [[],[]]
        eventPair.forEach((e, i)=>{
            if(!e)
            return null
            e.effects.forEach(effect=>{
            const axisGroup = getAxisGroup(effect.effect.axis)
            if(axisGroup === SortAxisEnum.STANDING){
                standingEffs[i].push(effect)
                hasStanding = true
            }
            else if(axisGroup === SortAxisEnum.MOTION){
                motionEffs[i].push(effect)
                hasMotion = true
            }
            else resultEffs[i].push(effect)
            })
        })
        if(hasStanding){
            standingEffs = standingEffs.map(breakApartArray)
            fillSmallerWithNull(standingEffs)
            standingEffs.forEach((effs, i)=> resultEffs[i].unshift(...effs))
        }
        if(hasMotion){
            motionEffs = motionEffs.map(breakApartArray)
            fillSmallerWithNull(motionEffs)
            motionEffs.forEach((effs, i)=> resultEffs[i].unshift(...motionEffs[i]))
        }
        return eventPair.map((e, i) =>{
            const frontendEvent: FrontendEvent = deepCopy(e) as unknown as FrontendEvent
            frontendEvent.effects = resultEffs[i].map(toFrontendEffect)
            return frontendEvent;
      })*/
    });
};
const toFrontendEffect = (effect) => {
    if (effect === null)
        return null;
    if (effect.type === gameEvent_1.EventEffectType.EFFECT) {
        return {
            type: gameEvent_1.EventEffectType.EFFECT,
            axis: effect.effect.axis,
            amount: effect.effect.amount,
            isBlocked: effect.happensTo.some(happens => happens === stateInterface_1.HappensEnum.BLOCKED),
            player: effect.effect.player
        };
    }
    else {
        return {
            type: gameEvent_1.EventEffectType.CHOICE,
            display: effect.display
        };
    }
};
const breakApartArray = (effects = [], player) => {
    const result = [];
    const opponent = util_1.getOpponent(player);
    effects.forEach(effect => {
        if (effect === null || effect.type !== gameEvent_1.EventEffectType.EFFECT) {
            result.push(effect);
        }
        else if (needToBeBroken(effect))
            result.push(...breakApartEffect(effect, player, opponent));
        else
            result.push(effect);
    });
    return result;
};
const needToBeBroken = (effect) => {
    if (effect.effect.player === card_1.PlayerEnum.BOTH && effect.happensTo[0] !== effect.happensTo[1])
        return true;
    return false;
};
const breakApartEffect = (effect, player, opponent) => {
    let replacements;
    const meEvent = util_1.deepCopy(effect);
    meEvent.happensTo[opponent] = stateInterface_1.HappensEnum.NEVER_AFFECTED;
    meEvent.effect.player = card_1.PlayerEnum.PLAYER;
    const themEvent = util_1.deepCopy(effect);
    themEvent.happensTo[player] = stateInterface_1.HappensEnum.NEVER_AFFECTED;
    themEvent.effect.player = card_1.PlayerEnum.OPPONENT;
    if (effect.happensTo[player] === stateInterface_1.HappensEnum.BLOCKED)
        replacements = [meEvent, themEvent];
    else
        replacements = [themEvent, meEvent];
    return replacements;
};
const fillSmallerWithNull = (effects) => {
    let biggerIndex = effects[0].length > effects[1].length ? 1 : 0;
    let smallerIndex = biggerIndex === 0 ? 1 : 0;
    while (effects[smallerIndex].length < effects[biggerIndex].length)
        effects[smallerIndex].push(null);
};
