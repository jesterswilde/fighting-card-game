"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cardInterface_1 = require("../interfaces/cardInterface");
const stateInterface_1 = require("../interfaces/stateInterface");
const util_1 = require("../util");
exports.markAxisChange = (mechanic, card, state) => {
    const players = util_1.playerEnumToPlayerArray(mechanic.player, state.currentPlayer, card.opponent);
    switch (mechanic.axis) {
        case cardInterface_1.AxisEnum.UNBALANCED:
        case cardInterface_1.AxisEnum.BALANCED:
        case cardInterface_1.AxisEnum.ANTICIPATING:
            checkBalance(mechanic, players, state);
            break;
        case cardInterface_1.AxisEnum.MOVING:
        case cardInterface_1.AxisEnum.STILL:
            checkMotion(mechanic, players, state);
        case cardInterface_1.AxisEnum.STANDING:
        case cardInterface_1.AxisEnum.PRONE:
            checkStanding(mechanic, players, state);
        case cardInterface_1.AxisEnum.CLOSE:
        case cardInterface_1.AxisEnum.CLOSER:
        case cardInterface_1.AxisEnum.GRAPPLED:
        case cardInterface_1.AxisEnum.FAR:
        case cardInterface_1.AxisEnum.FURTHER:
            checkDistance(mechanic, state);
    }
};
const checkBalance = (mechanic, players, state) => {
    players.forEach((player) => {
        if (state.playerStates[player].balance === stateInterface_1.BalanceEnum.ANTICIPATING) {
            if (mechanic.axis === cardInterface_1.AxisEnum.UNBALANCED) {
                state.modifiedAxis.balance = true;
            }
        }
        else if (state.playerStates[player].balance === stateInterface_1.BalanceEnum.BALANCED) {
            if (mechanic.axis !== cardInterface_1.AxisEnum.BALANCED) {
                state.modifiedAxis.balance = true;
            }
        }
        else if (state.playerStates[player].balance === stateInterface_1.BalanceEnum.UNBALANCED) {
            if (mechanic.axis !== cardInterface_1.AxisEnum.UNBALANCED) {
                state.modifiedAxis.balance = true;
            }
        }
    });
};
const checkMotion = (mechanic, players, state) => {
    players.forEach((player) => {
        if (state.playerStates[player].motion === stateInterface_1.MotionEnum.MOVING) {
            if (mechanic.axis === cardInterface_1.AxisEnum.STILL) {
                state.modifiedAxis.motion = true;
            }
        }
        if (state.playerStates[player].motion === stateInterface_1.MotionEnum.STILL) {
            if (mechanic.axis === cardInterface_1.AxisEnum.MOVING) {
                state.modifiedAxis.motion = true;
            }
        }
    });
};
const checkStanding = (mechanic, players, state) => {
    players.forEach((player) => {
        if (state.playerStates[player].standing === stateInterface_1.StandingEnum.STANDING) {
            if (mechanic.axis === cardInterface_1.AxisEnum.PRONE) {
                state.modifiedAxis.standing = true;
            }
        }
        if (state.playerStates[player].standing === stateInterface_1.StandingEnum.PRONE) {
            if (mechanic.axis === cardInterface_1.AxisEnum.STANDING) {
                state.modifiedAxis.standing = true;
            }
        }
    });
};
const checkDistance = (mechanic, state) => {
    if (state.distance === stateInterface_1.DistanceEnum.CLOSE) {
        if (mechanic.axis === cardInterface_1.AxisEnum.GRAPPLED || mechanic.axis === cardInterface_1.AxisEnum.FAR ||
            mechanic.axis === cardInterface_1.AxisEnum.FURTHER || mechanic.axis === cardInterface_1.AxisEnum.CLOSER) {
            state.modifiedAxis.distance = true;
        }
    }
    if (state.distance === stateInterface_1.DistanceEnum.GRAPPLED) {
        if (mechanic.axis === cardInterface_1.AxisEnum.CLOSE || mechanic.axis === cardInterface_1.AxisEnum.FAR ||
            mechanic.axis === cardInterface_1.AxisEnum.FURTHER) {
            state.modifiedAxis.distance = true;
        }
    }
    if (state.distance === stateInterface_1.DistanceEnum.FAR) {
        if (mechanic.axis === cardInterface_1.AxisEnum.GRAPPLED || mechanic.axis === cardInterface_1.AxisEnum.CLOSE ||
            mechanic.axis === cardInterface_1.AxisEnum.CLOSER) {
            state.modifiedAxis.distance = true;
        }
    }
};
