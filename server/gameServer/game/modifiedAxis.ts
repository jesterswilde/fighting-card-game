import { Mechanic, Card, AxisEnum } from "../../shared/card";
import { GameState, DistanceEnum, PoiseEnum, MotionEnum, StandingEnum } from "../interfaces/stateInterface";
import { playerEnumToPlayerArray } from "../util";

export const markAxisChange = (mechanic: Mechanic, card: Card, state: GameState) => {
    const players = playerEnumToPlayerArray(mechanic.player, state.currentPlayer, card.opponent); 
    switch(mechanic.axis){
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