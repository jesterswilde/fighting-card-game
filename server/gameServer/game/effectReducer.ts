import { Mechanic } from "../../cards/CardInterfaces";
import { GameState } from "../interfaces/stateInterface";
import { MechanicEnum } from "../interfaces/cardInterface";

const reduceMechanics = (mechanics: Mechanic[], state: GameState) =>{
    mechanics.forEach((mech)=> reduceMechanic(mech, state)); 
}

const reduceMechanic = (mechanic: Mechanic, state: GameState) => {

}

const reduceBlock = (mechanic: Mechanic, state: GameState) =>{

}
const reduceBuff = (mechanic: Mechanic, state: GameState) =>{
    
}
const reduceCripple = (mechanic: Mechanic, state: GameState) =>{
    
}
const reduceFocus = (mechanic: Mechanic, state: GameState) =>{
    
}
const reduceLock = (mechanic: Mechanic, state: GameState) =>{
    
}
const reducePredict = (mechanic: Mechanic, state: GameState) =>{
    
}
const reduceReflex = (mechanic: Mechanic, state: GameState) =>{
    
}
const reduceTelegraph = (mechanic: Mechanic, state: GameState) =>{
    
}

const mechanicRouter: { [name: string]: (mechanic: Mechanic, state: GameState) => void } = {
    [MechanicEnum.BLOCK]: reduceBlock,
    [MechanicEnum.BUFF]: reduceBuff,
    [MechanicEnum.CRIPPLE]: reduceCripple,
    [MechanicEnum.FOCUS]: reduceFocus,
    [MechanicEnum.LOCK]: reduceLock,
    [MechanicEnum.PREDICT]: reducePredict,
    [MechanicEnum.REFLEX]: reduceReflex,
    [MechanicEnum.TELEGRAPH]: reduceTelegraph
}