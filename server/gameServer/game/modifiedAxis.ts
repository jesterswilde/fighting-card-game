import { Mechanic, Card, AxisEnum } from "../interfaces/cardInterface";
import { GameState, DistanceEnum, BalanceEnum, MotionEnum, StandingEnum } from "../interfaces/stateInterface";
import { playerEnumToPlayerArray } from "../util";

export const markAxisChange = (mechanic: Mechanic, card: Card, state: GameState) => {
    const players = playerEnumToPlayerArray(mechanic.player, state.currentPlayer, card.opponent); 
    switch(mechanic.axis){
        case AxisEnum.UNBALANCED:
        case AxisEnum.BALANCED:
        case AxisEnum.ANTICIPATING:
            checkBalance(mechanic, players, state);
            break;
        case AxisEnum.MOVING:
        case AxisEnum.STILL: 
            checkMotion(mechanic, players, state);
        case AxisEnum.STANDING:
        case AxisEnum.PRONE:
            checkStanding(mechanic, players, state); 
        case AxisEnum.CLOSE:
        case AxisEnum.CLOSER:
        case AxisEnum.GRAPPLED:
        case AxisEnum.FAR:
        case AxisEnum.FURTHER:
            checkDistance(mechanic, state); 
    }
}

const checkBalance = (mechanic: Mechanic, players: number[], state: GameState) => {
    players.forEach((player) => {
        if (state.playerStates[player].balance === BalanceEnum.ANTICIPATING) {
            if (mechanic.axis === AxisEnum.UNBALANCED) {
                state.modifiedAxis.balance = true;
            }
        }
        else if (state.playerStates[player].balance === BalanceEnum.BALANCED) {
            if (mechanic.axis !== AxisEnum.BALANCED) {
                state.modifiedAxis.balance = true;
            }
        }
        else if (state.playerStates[player].balance === BalanceEnum.UNBALANCED) {
            if (mechanic.axis !== AxisEnum.UNBALANCED) {
                state.modifiedAxis.balance = true;
            }
        }
    })
}

const checkMotion = (mechanic: Mechanic, players: number[], state: GameState) => {
    players.forEach((player) => {
        if (state.playerStates[player].motion === MotionEnum.MOVING) {
            if (mechanic.axis === AxisEnum.STILL) {
                state.modifiedAxis.motion = true;
            }
        }
        if (state.playerStates[player].motion === MotionEnum.STILL) {
            if (mechanic.axis === AxisEnum.MOVING) {
                state.modifiedAxis.motion = true;
            }
        }
    })
}
const checkStanding = (mechanic: Mechanic, players: number[], state: GameState) => {
    players.forEach((player) => {
        if (state.playerStates[player].standing === StandingEnum.STANDING) {
            if (mechanic.axis === AxisEnum.PRONE) {
                state.modifiedAxis.standing = true;
            }
        }
        if (state.playerStates[player].standing === StandingEnum.PRONE) {
            if (mechanic.axis === AxisEnum.STANDING) {
                state.modifiedAxis.standing = true;
            }
        }
    })
}
const checkDistance = (mechanic: Mechanic, state: GameState) => {
    if (state.distance === DistanceEnum.CLOSE) {
        if (mechanic.axis === AxisEnum.GRAPPLED || mechanic.axis === AxisEnum.FAR ||
            mechanic.axis === AxisEnum.FURTHER || mechanic.axis === AxisEnum.CLOSER) {
            state.modifiedAxis.distance = true;
        }
    }
    if (state.distance === DistanceEnum.GRAPPLED) {
        if (mechanic.axis === AxisEnum.CLOSE || mechanic.axis === AxisEnum.FAR ||
            mechanic.axis === AxisEnum.FURTHER) {
            state.modifiedAxis.distance = true;
        }
    }
    if (state.distance === DistanceEnum.FAR) {
        if (mechanic.axis === AxisEnum.GRAPPLED || mechanic.axis === AxisEnum.CLOSE ||
            mechanic.axis === AxisEnum.CLOSER) {
            state.modifiedAxis.distance = true;
        }
    }
}