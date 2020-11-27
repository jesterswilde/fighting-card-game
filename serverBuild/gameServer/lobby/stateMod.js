"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePlayerStateWithMods = exports.healthFromMod = void 0;
const card_1 = require("../../shared/card");
const gameSettings_1 = require("../gameSettings");
const stateInterface_1 = require("../interfaces/stateInterface");
const util_1 = require("../util");
exports.healthFromMod = (mods) => {
    let health = mods?.health?.map(val => val ?? gameSettings_1.STARTING_HEALTH);
    if (!health)
        health = [gameSettings_1.STARTING_HEALTH, gameSettings_1.STARTING_HEALTH];
    return health;
};
exports.makePlayerStateWithMods = (mods) => {
    const playerStates = [makePlayerState(), makePlayerState()];
    let distance = stateInterface_1.DistanceEnum.CLOSE;
    mods?.startingPositions?.forEach(sMod => {
        if (isDistance(sMod.axis))
            distance = axisToDistance[sMod.axis];
        else {
            const playerIndices = util_1.playerEnumToPlayerArray(sMod.player, 0, 1);
            if (sMod.axis == card_1.AxisEnum.PRONE)
                playerIndices.forEach(i => playerStates[i].standing = stateInterface_1.StandingEnum.PRONE);
            else if (sMod.axis == card_1.AxisEnum.MOVING)
                playerIndices.forEach(i => playerStates[i].motion = stateInterface_1.MotionEnum.MOVING);
            else if (sMod.axis == card_1.AxisEnum.POISE)
                playerIndices.forEach(i => playerStates[i].poise += sMod.value);
        }
    });
    return { playerStates, distance };
};
const isDistance = (axis) => axis == card_1.AxisEnum.CLOSE || axis == card_1.AxisEnum.FAR || axis == card_1.AxisEnum.GRAPPLED;
const axisToDistance = {
    [card_1.AxisEnum.FAR]: stateInterface_1.DistanceEnum.FAR,
    [card_1.AxisEnum.CLOSE]: stateInterface_1.DistanceEnum.CLOSE,
    [card_1.AxisEnum.GRAPPLED]: stateInterface_1.DistanceEnum.GRAPPLED
};
const makePlayerState = () => {
    return {
        standing: stateInterface_1.StandingEnum.STANDING,
        motion: stateInterface_1.MotionEnum.STILL,
        poise: gameSettings_1.STARTING_POISE
    };
};
