"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const stateInterface_1 = require("../../interfaces/stateInterface");
const gameSettings_1 = require("../../gameSettings");
const util_1 = require("../../util");
const errors_1 = require("../../errors");
const poise_1 = require("../poise");
exports.canPlayCard = (card, state) => {
    if (card === undefined) {
        throw errors_1.ErrorEnum.NO_CARD;
    }
    const opponent = card.player === 1 ? 0 : 1;
    return card.requirements.every((req) => exports.meetsRequirements(req, state, card.player, opponent));
};
exports.canUseOptional = (reqs, player, opponent, state) => {
    return reqs.requirements.every((req) => {
        return exports.meetsRequirements(req, state, player, opponent);
    });
};
exports.mechReqsMet = (mech, opponent, player, state) => {
    const reqs = mech.mechanicRequirements || [];
    return reqs.every((req) => {
        return exports.meetsRequirements(req, state, player, opponent);
    });
};
exports.meetsRequirements = (req, state, player, opponent) => {
    try {
        const checkGlobal = globalAxis[req.axis];
        if (checkGlobal !== undefined) {
            return checkGlobal(state);
        }
        const whoToCheck = util_1.playerEnumToPlayerArray(req.player, player, opponent);
        const checkPlayers = playerAxis[req.axis];
        if (checkPlayers !== undefined) {
            return checkPlayers(whoToCheck, state);
        }
        return false;
    }
    catch (err) {
        console.error(err);
        console.log("Error at state", state.playerStates);
        return false;
    }
};
const globalAxis = {
    [card_1.AxisEnum.GRAPPLED]: (state) => state.distance === stateInterface_1.DistanceEnum.GRAPPLED,
    [card_1.AxisEnum.NOT_GRAPPLED]: (state) => state.distance !== stateInterface_1.DistanceEnum.GRAPPLED,
    [card_1.AxisEnum.CLOSE]: (state) => state.distance === stateInterface_1.DistanceEnum.CLOSE,
    [card_1.AxisEnum.NOT_CLOSE]: (state) => state.distance !== stateInterface_1.DistanceEnum.CLOSE,
    [card_1.AxisEnum.FAR]: (state) => state.distance === stateInterface_1.DistanceEnum.FAR,
    [card_1.AxisEnum.NOT_FAR]: (state) => state.distance !== stateInterface_1.DistanceEnum.FAR
};
const playerAxis = {
    [card_1.AxisEnum.NOT_ANTICIPATING]: (check, state) => check.every((i) => poise_1.hasPoise(stateInterface_1.PoiseEnum.NOT_ANTICIPATING, i, state)),
    [card_1.AxisEnum.STANDING]: (check, state) => check.every((i) => state.playerStates[i].standing === stateInterface_1.StandingEnum.STANDING),
    [card_1.AxisEnum.PRONE]: (check, state) => check.every((i) => state.playerStates[i].standing === stateInterface_1.StandingEnum.PRONE),
    [card_1.AxisEnum.STILL]: (check, state) => check.every((i) => state.playerStates[i].motion === stateInterface_1.MotionEnum.STILL),
    [card_1.AxisEnum.MOVING]: (check, state) => check.every((i) => state.playerStates[i].motion === stateInterface_1.MotionEnum.MOVING),
    [card_1.AxisEnum.BALANCED]: (check, state) => check.every((i) => poise_1.hasPoise(stateInterface_1.PoiseEnum.BALANCED, i, state)),
    [card_1.AxisEnum.ANTICIPATING]: (check, state) => check.every((i) => poise_1.hasPoise(stateInterface_1.PoiseEnum.ANTICIPATING, i, state)),
    [card_1.AxisEnum.UNBALANCED]: (check, state) => check.every((i) => poise_1.hasPoise(stateInterface_1.PoiseEnum.UNBALANCED, i, state)),
    [card_1.AxisEnum.BLOODIED]: (check, state) => check.every((i) => state.health[i] <= gameSettings_1.BLOODIED_HP),
    [card_1.AxisEnum.DAMAGE]: (check, state) => check.every((i) => state.damaged[i]),
};
