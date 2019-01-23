import { Card, StatePiece, AxisEnum, PlayerEnum, Mechanic, MechanicEnum } from "./interfaces/cardInterface";
import { GameState, PlayerState, DistanceEnum, StandingEnum, MotionEnum, BalanceEnum, ModifiedAxis } from "./interfaces/stateInterface";

export const deepCopy = (obj: any) => {
    if (null == obj || "object" != typeof obj) return obj;
    const copy = obj.constructor();
    for (const attr in obj) {
        if (typeof obj[attr] === 'object') {
            copy[attr] = deepCopy(obj[attr]);
        } else {
            copy[attr] = obj[attr];
        }
    }
    return copy;
}

export const makeBlankCard = (): Card => {
    return {
        requirements: [],
        effects: [],
        name: 'blankCard',
        optional: [],
    }
}

export const makeRequirement = (): StatePiece => {
    return {
        axis: AxisEnum.CLOSE,
        player: PlayerEnum.BOTH,
        amount: 0,
    };
}

export const makeMechanic = (): Mechanic => {
    return {
        axis: AxisEnum.FAR,
        player: PlayerEnum.OPPONENT,
        mechanic: null,
        amount: 0
    }
}

export const makeGameState = (): GameState => {
    return {
        currentPlayer: 0,
        playerStates: [makePlayerState(), makePlayerState()],
        stateDurations: [makeStateDurations(), makeStateDurations()],
        block: [0, 0],
        queues: [[], []],
        distance: DistanceEnum.FAR,
        decks: [],
        damaged: [],
        hands: [],
        health: [],
        readiedEffects: [],
        modifiedAxis: makeModifiedAxis()
    }
}

export const makeModifiedAxis = (): ModifiedAxis => {
    return {
        balance: false,
        distance: false,
        motion: false,
        standing: false
    }
}

const makeStateDurations = () => {
    return {
        standing: null,
        motion: null,
        balance: null
    }
}

const makePlayerState = (): PlayerState => {
    return {
        standing: StandingEnum.STANDING,
        motion: MotionEnum.STILL,
        balance: BalanceEnum.BALANCED
    }
}

export const playerEnumToPlayerArray = (playerEnum: PlayerEnum, player: number, opponent: number): number[] => {
    let whoToCheck: number[];
    if (playerEnum === PlayerEnum.PLAYER) {
        whoToCheck = [player];
    }
    else if (playerEnum === PlayerEnum.OPPONENT) {
        whoToCheck = [opponent];
    }
    else {
        whoToCheck = [player, opponent];
    }
    return whoToCheck
}
