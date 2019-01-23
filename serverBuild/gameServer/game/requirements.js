"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardInterface_1 = require("../interfaces/cardInterface");
const stateInterface_1 = require("../interfaces/stateInterface");
const gameSettings_1 = require("../gameSettings");
const util_1 = require("../util");
exports.canPlayCard = (card, state) => {
    const { opponent } = card;
    return card.requirements.every((req) => exports.meetsRequirements(req, state, state.currentPlayer, opponent));
};
exports.canUseOptional = (reqs, opponent, state) => {
    return reqs.requirements.every((req) => {
        return exports.meetsRequirements(req, state, state.currentPlayer, opponent);
    });
};
exports.meetsRequirements = (req, state, player, opponent) => {
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
};
const globalAxis = {
    [cardInterface_1.AxisEnum.GRAPPLED]: (state) => state.distance === stateInterface_1.DistanceEnum.GRAPPLED,
    [cardInterface_1.AxisEnum.NOT_GRAPPLED]: (state) => state.distance !== stateInterface_1.DistanceEnum.GRAPPLED,
    [cardInterface_1.AxisEnum.CLOSE]: (state) => state.distance === stateInterface_1.DistanceEnum.CLOSE,
    [cardInterface_1.AxisEnum.NOT_CLOSE]: (state) => state.distance !== stateInterface_1.DistanceEnum.CLOSE,
    [cardInterface_1.AxisEnum.FAR]: (state) => state.distance === stateInterface_1.DistanceEnum.FAR,
    [cardInterface_1.AxisEnum.NOT_FAR]: (state) => state.distance !== stateInterface_1.DistanceEnum.FAR
};
const playerAxis = {
    [cardInterface_1.AxisEnum.STANDING]: (check, state) => check.every((i) => state.playerStates[i].standing === stateInterface_1.StandingEnum.STANDING),
    [cardInterface_1.AxisEnum.PRONE]: (check, state) => check.every((i) => state.playerStates[i].standing === stateInterface_1.StandingEnum.PRONE),
    [cardInterface_1.AxisEnum.STILL]: (check, state) => check.every((i) => state.playerStates[i].motion === stateInterface_1.MotionEnum.STILL),
    [cardInterface_1.AxisEnum.MOVING]: (check, state) => check.every((i) => state.playerStates[i].motion === stateInterface_1.MotionEnum.MOVING),
    [cardInterface_1.AxisEnum.BALANCED]: (check, state) => check.every((i) => state.playerStates[i].balance === stateInterface_1.BalanceEnum.BALANCED || state.playerStates[i].balance === stateInterface_1.BalanceEnum.ANTICIPATING),
    [cardInterface_1.AxisEnum.ANTICIPATING]: (check, state) => check.every((i) => state.playerStates[i].balance === stateInterface_1.BalanceEnum.ANTICIPATING),
    [cardInterface_1.AxisEnum.UNBALANCED]: (check, state) => check.every((i) => state.playerStates[i].balance === stateInterface_1.BalanceEnum.UNBALANCED),
    [cardInterface_1.AxisEnum.BLOODIED]: (check, state) => check.every((i) => state.health[i] <= gameSettings_1.BLOODIED_HP),
    [cardInterface_1.AxisEnum.DAMAGE]: (check, state) => check.every((i) => state.damaged[i]),
};
