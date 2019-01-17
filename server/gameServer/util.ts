import { Card, StatePiece, AxisEnum, PlayerEnum, Mechanic, MechanicEnum } from "./interfaces/cardInterface";
import { GameState, PlayerState, DistanceEnum, StandingEnum, MotionEnum, BalanceEnum } from "./interfaces/stateInterface";


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
        block: [0, 0],
        queues: [[], []],
        distance: DistanceEnum.FAR,
        decks:[],
        damaged:[],
        hands:[],
        health:[],
        readiedEffects: []
    }
}

const makePlayerState = (): PlayerState => {
    return {
        standing: StandingEnum.STANDING,
        motion: MotionEnum.STILL,
        balance: BalanceEnum.BALANCED
    }
}
