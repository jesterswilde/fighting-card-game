import { Card, StatePiece, AxisEnum, RequirementEffect, Mechanic } from "../../../shared/card";
import { GameState, DistanceEnum, StandingEnum, MotionEnum, PoiseEnum } from "../../interfaces/stateInterface";
import { BLOODIED_HP } from "../../gameSettings";
import { playerEnumToPlayerArray } from "../../util";
import { ErrorEnum } from "../../errors";
import { hasPoise } from "../poise";

export const canPlayCard = (card: Card, state: GameState): boolean => {
    if(card === undefined){
        throw ErrorEnum.NO_CARD
    }
    const opponent = card.player === 1 ? 0 : 1; 
    return card.requirements.every((req) => meetsRequirements(req, state, card.player, opponent));
}
export const canUseOptional = (reqs: RequirementEffect, player: number, opponent: number, state: GameState): boolean => {
    return reqs.requirements.every((req) => {
        return meetsRequirements(req, state, player, opponent)
    });
}
export const mechReqsMet = (mech: Mechanic, opponent: number, player: number, state: GameState): boolean =>{
    const reqs = mech.mechanicRequirements || []; 
    return reqs.every((req)=>{
        return meetsRequirements(req, state, player, opponent); 
    })
}

export const meetsRequirements = (req: StatePiece, state: GameState, player: number, opponent: number): boolean => {
    try{
        const checkGlobal = globalAxis[req.axis];
        if (checkGlobal !== undefined) {
            return checkGlobal(state);
        }
        const whoToCheck = playerEnumToPlayerArray(req.player, player, opponent); 
        const checkPlayers = playerAxis[req.axis];
        if (checkPlayers !== undefined) {
            return checkPlayers(whoToCheck, state);
        }
        return false;
    }catch(err){
        console.error(err); 
        console.log("Error at state", state.playerStates)
        return false; 
    }
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
    [AxisEnum.NOT_ANTICIPATING]: (check: number[], state: GameState)=> check.every((i)=> hasPoise(PoiseEnum.NOT_ANTICIPATING, i, state)),
    [AxisEnum.STANDING]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].standing === StandingEnum.STANDING),
    [AxisEnum.PRONE]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].standing === StandingEnum.PRONE),
    [AxisEnum.STILL]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].motion === MotionEnum.STILL),
    [AxisEnum.MOVING]: (check: number[], state: GameState) => check.every((i) => state.playerStates[i].motion === MotionEnum.MOVING),
    [AxisEnum.BALANCED]: (check: number[], state: GameState) => check.every((i) => hasPoise(PoiseEnum.BALANCED, i, state)),
    [AxisEnum.ANTICIPATING]: (check: number[], state: GameState) => check.every((i) => hasPoise(PoiseEnum.ANTICIPATING, i, state)),
    [AxisEnum.UNBALANCED]: (check: number[], state: GameState) => check.every((i) => hasPoise(PoiseEnum.UNBALANCED, i, state)),
    [AxisEnum.BLOODIED]: (check: number[], state: GameState) => check.every((i) => state.health[i] <= BLOODIED_HP),

    [AxisEnum.DAMAGE]: (check: number[], state: GameState) => check.every((i) => state.damaged[i]),
}