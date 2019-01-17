import { Card, StatePiece, AxisEnum, MechanicEnum, PlayerEnum } from "../interfaces/cardInterface";
import { GameState, DistanceEnum, StandingEnum, MotionEnum, BalanceEnum } from "../interfaces/stateInterface";
import { BLOODIED_HP } from "../gameSettings";

export const canPlayCard = (card: Card, state: GameState): boolean => {
    const opponent = state.currentPlayer === 0 ? 1 : 0;
    return card.requirements.every((req) => meetsRequirements(req, state, state.currentPlayer, opponent));
}

export const meetsRequirements = (req: StatePiece, state: GameState, player: number, opponent: number): boolean => {
    const checkGlobal = globalAxis[req.axis];
    if (checkGlobal !== undefined) {
        return checkGlobal(state);
    }
    let whoToCheck: number[];
    if (req.player === PlayerEnum.PLAYER) {
        whoToCheck = [player];
    }
    else if (req.player === PlayerEnum.OPPONENT) {
        whoToCheck = [opponent];
    }
    else {
        whoToCheck = [player, opponent];
    }
    const checkPlayers = playerAxis[req.axis];
    if (checkPlayers !== undefined) {
        return checkPlayers(whoToCheck, state);
    }
    return false;
}

const globalAxis: { [axis: string]: (state: GameState) => boolean } = {
    [AxisEnum.GRAPPLED]: (state: GameState) => state.distance === DistanceEnum.GRAPPLED,
    [AxisEnum.NOT_GRAPPLED]: (state: GameState) => state.distance !== DistanceEnum.GRAPPLED,
    [AxisEnum.CLOSE]: (state: GameState) => state.distance === DistanceEnum.CLOSE,
    [AxisEnum.NOT_CLOSE]: (state: GameState) => state.distance !== DistanceEnum.CLOSE,
    [AxisEnum.FAR]: (state: GameState) => state.distance === DistanceEnum.FAR,
    [AxisEnum.NOT_FAR]: (state: GameState) => state.distance !== DistanceEnum.FAR
}

const playerAxis: { [axis: string]: (check: number[], state: GameState) => boolean } = {
    [AxisEnum.STANDING]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].standing === StandingEnum.STANDING),
    [AxisEnum.PRONE]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].standing === StandingEnum.PRONE),
    [AxisEnum.STILL]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].motion === MotionEnum.STILL),
    [AxisEnum.MOVING]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].motion === MotionEnum.MOVING),
    [AxisEnum.BALANCED]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].balance === BalanceEnum.BALANCED || state.playerStates[i].balance === BalanceEnum.ANTICIPATING),
    [AxisEnum.ANTICIPATING]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].balance === BalanceEnum.ANTICIPATING),
    [AxisEnum.UNBALANCED]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].balance === BalanceEnum.BALANCED || state.playerStates[i].balance === BalanceEnum.UNBALANCED),
    [AxisEnum.BLOODIED]: (check: number[], state: GameState) => check.every((i) => state.health[i] <= BLOODIED_HP),
    [AxisEnum.DAMAGE]: (check: number[], state: GameState) => check.every((i) => state.damaged[i]),
}