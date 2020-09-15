import { GameState, StandingEnum, MotionEnum, DistanceEnum } from "../../interfaces/stateInterface";
import { AxisEnum } from "../../../shared/card";


export const globalAxis: { [axis: string]: (state: GameState) => void } = {
    [AxisEnum.GRAPPLED]: (state: GameState) => state.distance = DistanceEnum.GRAPPLED,
    [AxisEnum.CLOSE]: (state: GameState) => state.distance = DistanceEnum.CLOSE,
    [AxisEnum.FAR]: (state: GameState) => state.distance = DistanceEnum.FAR,
    [AxisEnum.CLOSER]: (state: GameState) => {
        if (state.distance === DistanceEnum.FAR) {
            state.distance = DistanceEnum.CLOSE;
        } else {
            state.distance = DistanceEnum.GRAPPLED;
        }
    },
    [AxisEnum.FURTHER]: (state: GameState) => {
        if (state.distance === DistanceEnum.GRAPPLED) {
            state.distance = DistanceEnum.CLOSE;
        } else {
            state.distance = DistanceEnum.FAR;
        }
    }
}


export const playerAxis: { [axis: string]: (players: number[], amount: number, state: GameState) => void } = {
    [AxisEnum.POISE]: (players: number[], amount: number, state: GameState) => players.forEach((i) => {
        const { playerStates } = state;
        playerStates[i].poise += amount;
    }),
    [AxisEnum.LOSE_POISE]: (players: number[], amount: number, state: GameState) => players.forEach((i) => {
        const { playerStates } = state;
        playerStates[i].poise -= amount;
    }),
    [AxisEnum.STANDING]: (players: number[], amount: number, state: GameState) => players.forEach((i) => {
        const { stateDurations, playerStates } = state;
        stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== StandingEnum.STANDING);
        playerStates[i].standing = StandingEnum.STANDING
    }),
    [AxisEnum.PRONE]: (players: number[], amount: number, state: GameState) => players.forEach((i) => {
        const { stateDurations, playerStates } = state;
        stateDurations[i].standing = getMaxAmount(stateDurations[i].standing, amount, playerStates[i].standing !== StandingEnum.PRONE)
        state.playerStates[i].standing = StandingEnum.PRONE
    }),
    [AxisEnum.STILL]: (players: number[], amount: number, state: GameState) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => {
            stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== MotionEnum.STILL)
            state.playerStates[i].motion = MotionEnum.STILL
        })
    },
    [AxisEnum.MOVING]: (players: number[], amount: number, state: GameState) => {
        const { stateDurations, playerStates } = state;
        players.forEach((i) => {
            stateDurations[i].motion = getMaxAmount(stateDurations[i].motion, amount, playerStates[i].motion !== MotionEnum.MOVING)
            state.playerStates[i].motion = MotionEnum.MOVING;
        })
    },
    [AxisEnum.DAMAGE]: (players: number[], amount: number, state: GameState) => {
        players.forEach((i) => {
            const parry = state.parry[i];
            if (parry > 0) {
                const remainingDamage = amount - parry;
                if (remainingDamage >= 0) {
                    state.parry[i] = 0;
                    state.health[i] -= remainingDamage;
                } else {
                    state.parry[i] -= amount;
                }
            } else {
                state.health[i] -= amount
            }
        })
    },
}

const getMaxAmount = (currentAmount: number, nextAmount: number, changed: boolean) => {
    //The *2 is a hack for decrement counters
    if (nextAmount === null) {
        return null;
    }
    if (changed) {
        return nextAmount;
    }
    if (currentAmount === null) {
        return null;
    }
    return Math.max(currentAmount, nextAmount);
}