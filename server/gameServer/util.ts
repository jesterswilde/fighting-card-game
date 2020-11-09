import { GameState, PlayerState, DistanceEnum, StandingEnum, MotionEnum, ModifiedAxis } from "./interfaces/stateInterface";
import { STARTING_POISE } from "./gameSettings";
import { Card, AxisEnum, PlayerEnum, Mechanic, MechanicEnum, Effect, Requirement } from "../shared/card";

export const getOpponent = (player: number): number => {
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
        mechanics: []
    }
}

export const makeRequirement = (): Requirement => {
    return {
        axis: AxisEnum.CLOSE,
        player: PlayerEnum.BOTH,
    };
}

export const makeEffect = (): Effect => {
    return {
        axis: AxisEnum.FAR,
        player: PlayerEnum.OPPONENT,
        amount: 0
    }
}
/*
export const makeTestingGameState = (): GameState => {
    return {
        agents: [],
        numPlayers: 2,
        playerStates: [makePlayerState(), makePlayerState()],
        stateDurations: [makeStateDurations(), makeStateDurations()],
        parry: [0, 0],
        block: [0, 0],
        queue: [[], []],
        pickedCards: [],
        distance: DistanceEnum.FAR,
        decks: [],
        damaged: [],
        hands: [],
        tagModification: [{}, {}],
        tagsPlayed: [{},{}],
        health: [],
        readiedEffects: [],
        readiedDamageEffects: [],
        modifiedAxis: [makeModifiedAxis(),makeModifiedAxis()],
        events: [],
        setup: [0,0],
        pendingSetup: [0,0],
        turnNumber: 0,
        cardUID: 0,
        predictions: [],
        pendingPredictions: [],
    }
}*/

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
/** returns an array where the first index is an array of all elements that matche the filter, and the second doesn't. Both will return empty arrays if no matches (not null) */
export const splitArray = <T>(arr: T[], filter: (value: T) => boolean): [T[], T[]] => {
    const matches = arr.filter(filter);
    const noMatch = arr.filter((value) => !filter(value));
    return [matches, noMatch];
}

export const uniqByReverse = <T>(arr: T[], by: (value: T) => string | number): T[] => {
    const values: { [key: number]: boolean } = {};
    const reverseArr: T[] = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        const item = arr[i];
        const key = by(item);
        if (!values[key]) {
            values[key] = true;
            reverseArr.push(item);
        }
    }
    return reverseArr.reverse();
}