import { EventAction, EventEffect, FrontEndEffect, FrontendEvent } from "../../gameServer/interfaces/gameEvent"
import { HappensEnum } from "../../gameServer/interfaces/stateInterface"
import { getOpponent, deepCopy } from "../../gameServer/util"
import { PlayerEnum } from "../../shared/card"
import { getAxisGroup, SortAxisEnum } from "../../shared/sortOrder"

export const eventsToFrontend = (events: EventAction[][]): FrontendEvent[][]=>{
    return events.map(eventPair =>{
        let standingEffs: EventEffect[][] = [[],[]]
        let hasStanding = false
        let motionEffs: EventEffect[][] = [[],[]]
        let hasMotion = false
        const resultEffs = [[],[]]
        eventPair.forEach((e, i)=>{
            if(!e)
            return null
            e.effects.forEach(effect=>{
            const axisGroup = getAxisGroup(effect.effect.axis)
            if(axisGroup === SortAxisEnum.STANDING){
                standingEffs[i].push(effect)
                hasStanding = true 
            }
            else if(axisGroup === SortAxisEnum.MOTION){
                motionEffs[i].push(effect)
                hasMotion = true
            }
            else resultEffs[i].push(effect)
            })
        })
        if(hasStanding){
            standingEffs = standingEffs.map(breakApartArray)
            fillSmallerWithNull(standingEffs)
            standingEffs.forEach((effs, i)=> resultEffs[i].unshift(...effs))
        }
        if(hasMotion){
            motionEffs = motionEffs.map(breakApartArray)
            fillSmallerWithNull(motionEffs)
            motionEffs.forEach((effs, i)=> resultEffs[i].unshift(...motionEffs[i]))
        }
        return eventPair.map((e, i) =>{
            const frontendEvent: FrontendEvent = deepCopy(e) as unknown as FrontendEvent
            frontendEvent.effects = resultEffs[i].map(toFrontendEffect)
            return frontendEvent;
      })
    })
  }
  
  const toFrontendEffect = (effect: EventEffect): FrontEndEffect=>{
    if(effect === null)
      return null
    return {
      axis: effect.effect.axis,
      amount: effect.effect.amount,
      isBlocked: effect.happensTo.some(happens => happens === HappensEnum.BLOCKED),
      player: effect.effect.player
    }
  }
  
  const breakApartArray = (effects: EventEffect[], player: number)=>{
    const result: EventEffect[] = []
    const opponent = getOpponent(player)
    effects.forEach(effect=>{
      if(needToBeBroken(effect))
        result.push(...breakApartEffect(effect, player, opponent))
      else 
        result.push(effect)
    })
    return result; 
  }
  
  const needToBeBroken = (effect: EventEffect)=>{
    if(effect.effect.player === PlayerEnum.BOTH && effect.happensTo[0] !== effect.happensTo[1])
      return true
    return false
  }
  
  const breakApartEffect = (effect: EventEffect, player: number, opponent: number)=>{
    let replacements:EventEffect[]
    const meEvent = deepCopy(effect)
    meEvent.happensTo[opponent] = HappensEnum.NEVER_AFFECTED
    meEvent.effect.player = PlayerEnum.PLAYER
    const themEvent = deepCopy(effect)
    themEvent.happensTo[player] = HappensEnum.NEVER_AFFECTED
    themEvent.effect.player = PlayerEnum.OPPONENT
    if(effect.happensTo[player] === HappensEnum.BLOCKED)
      replacements = [meEvent, themEvent]
    else
      replacements = [themEvent, meEvent]
    return replacements
  }
  
  const fillSmallerWithNull = (effects: EventEffect[][]) =>{
    let biggerIndex = effects[0].length > effects[1].length ? 1 : 0
    let smallerIndex = biggerIndex === 0 ? 1 : 0 
    while(effects[smallerIndex].length < effects[biggerIndex].length)
      effects[smallerIndex].push(null) 
  }