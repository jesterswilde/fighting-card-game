"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../../../shared/card");
const stateInterface_1 = require("../../interfaces/stateInterface");
const util_1 = require("../../util");
exports.markAxisChange = (mechanic, card, state) => {
    const players = util_1.playerEnumToPlayerArray(mechanic.player, card.player, card.opponent);
    switch (mechanic.axis) {
        case card_1.AxisEnum.MOVING:
        case card_1.AxisEnum.STILL:
            checkMotion(mechanic, players, state);
        case card_1.AxisEnum.STANDING:
        case card_1.AxisEnum.PRONE:
            checkStanding(mechanic, players, state);
        case card_1.AxisEnum.CLOSE:
        case card_1.AxisEnum.CLOSER:
        case card_1.AxisEnum.GRAPPLED:
        case card_1.AxisEnum.FAR:
        case card_1.AxisEnum.FURTHER:
            checkDistance(mechanic, state);
    }
};
const checkMotion = (mechanic, players, state) => {
    players.forEach((player) => {
        if (state.playerStates[player].motion === stateInterface_1.MotionEnum.MOVING) {
            if (mechanic.axis === card_1.AxisEnum.STILL) {
                state.modifiedAxis.motion = true;
            }
        }
        if (state.playerStates[player].motion === stateInterface_1.MotionEnum.STILL) {
            if (mechanic.axis === card_1.AxisEnum.MOVING) {
                state.modifiedAxis.motion = true;
            }
        }
    });
};
const checkStanding = (mechanic, players, state) => {
    players.forEach((player) => {
        if (state.playerStates[player].standing === stateInterface_1.StandingEnum.STANDING) {
            if (mechanic.axis === card_1.AxisEnum.PRONE) {
                state.modifiedAxis.standing = true;
            }
        }
        if (state.playerStates[player].standing === stateInterface_1.StandingEnum.PRONE) {
            if (mechanic.axis === card_1.AxisEnum.STANDING) {
                state.modifiedAxis.standing = true;
            }
        }
    });
};
const checkDistance = (mechanic, state) => {
    if (state.distance === stateInterface_1.DistanceEnum.CLOSE) {
        if (mechanic.axis === card_1.AxisEnum.GRAPPLED || mechanic.axis === card_1.AxisEnum.FAR ||
            mechanic.axis === card_1.AxisEnum.FURTHER || mechanic.axis === card_1.AxisEnum.CLOSER) {
            state.modifiedAxis.distance = true;
        }
    }
    if (state.distance === stateInterface_1.DistanceEnum.GRAPPLED) {
        if (mechanic.axis === card_1.AxisEnum.CLOSE || mechanic.axis === card_1.AxisEnum.FAR ||
            mechanic.axis === card_1.AxisEnum.FURTHER) {
            state.modifiedAxis.distance = true;
        }
    }
    if (state.distance === stateInterface_1.DistanceEnum.FAR) {
        if (mechanic.axis === card_1.AxisEnum.GRAPPLED || mechanic.axis === card_1.AxisEnum.CLOSE ||
            mechanic.axis === card_1.AxisEnum.CLOSER) {
            state.modifiedAxis.distance = true;
        }
    }
};
