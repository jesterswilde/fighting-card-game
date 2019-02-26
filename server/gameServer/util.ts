import { Card, StatePiece, AxisEnum, PlayerEnum, Mechanic, MechanicEnum } from "./interfaces/cardInterface";
import { GameState, PlayerState, DistanceEnum, StandingEnum, MotionEnum, PoiseEnum, ModifiedAxis } from "./interfaces/stateInterface";
import { STARTING_POISE } from "./gameSettings";

export const getOpponent = (player: number): number =>{
    return player === 1 ? 0 : 1; 
}

export const deepCopy = <T>(obj: T): T => {
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
        queue: [[], []],
        distance: DistanceEnum.FAR,
        decks: [],
        damaged: [],
        hands: [],
        health: [],
        readiedEffects: [],
        modifiedAxis: makeModifiedAxis(),
        sockets:[],
        events:[],
        turnNumber: 0,
        lockedState: {
            distance: null,
            players: [
                {
                    poise: null,
                    motion: null,
                    stance: null
                },{
                    poise: null,
                    motion: null,
                    stance: null
                }
            ]
        }
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

export const makeStateDurations = () => {
    return {
        standing: null,
        motion: null,
        balance: null
    }
}

export const makePlayerState = (): PlayerState => {
    return {
        standing: StandingEnum.STANDING,
        motion: MotionEnum.STILL,
        poise: STARTING_POISE
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
