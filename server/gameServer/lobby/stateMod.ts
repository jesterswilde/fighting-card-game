import { AxisEnum } from "../../shared/card"
import { STARTING_HEALTH, STARTING_POISE } from "../gameSettings"
import { DistanceEnum, MotionEnum, PlayerState, StandingEnum } from "../interfaces/stateInterface"
import { playerEnumToPlayerArray } from "../util"
import { GameMods } from "./interface"

export const healthFromMod = (mods: GameMods): number[]=>{
    let health = mods?.health?.map(val => val ?? STARTING_HEALTH);
    if(!health)
     health = [STARTING_HEALTH, STARTING_HEALTH]
    return health;
}

export const makePlayerStateWithMods = (mods: GameMods): ModdedState =>{
   const playerStates = [makePlayerState(), makePlayerState()] 
   let distance = DistanceEnum.CLOSE;
   mods?.startingPositions?.forEach(sMod=>{
        if(isDistance(sMod.axis))
            distance = axisToDistance[sMod.axis]
        else{
            const playerIndices = playerEnumToPlayerArray(sMod.player, 0, 1); 
            if(sMod.axis == AxisEnum.PRONE)
                playerIndices.forEach(i => playerStates[i].standing = StandingEnum.PRONE)
            else if(sMod.axis == AxisEnum.MOVING)
                playerIndices.forEach(i => playerStates[i].motion = MotionEnum.MOVING)
            else if(sMod.axis == AxisEnum.POISE)
                playerIndices.forEach(i => playerStates[i].poise += sMod.value)
        }
   })
   return {playerStates, distance}
}
const isDistance = (axis: AxisEnum)=> axis == AxisEnum.CLOSE || axis == AxisEnum.FAR || axis == AxisEnum.GRAPPLED
const axisToDistance = {
    [AxisEnum.FAR]: DistanceEnum.FAR,
    [AxisEnum.CLOSE]: DistanceEnum.CLOSE,
    [AxisEnum.GRAPPLED]: DistanceEnum.GRAPPLED
}
const makePlayerState = (): PlayerState => {
    return {
        standing: StandingEnum.STANDING,
        motion: MotionEnum.STILL,
        poise: STARTING_POISE
    }
}

interface ModdedState{
    distance: DistanceEnum
    playerStates: PlayerState[]
}