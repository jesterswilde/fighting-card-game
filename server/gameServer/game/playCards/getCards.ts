import { Card, AxisEnum, PlayerEnum } from "../../../shared/card";
import { makeBlankCard } from "../../util";

export const getCardByName = (name: string): Card=>{
    const card = crippledObj[name]
    if(card === undefined){
        return makeBlankCard(); 
    }
    return {...card}; 
}


const crippledObj: { [name: string]: Card } = {
    "Everything":{
        name: "Crippled Everything",
        requirements: [],
        effects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.PLAYER, amount: 3000 }],
        optional: [],
        isFaceUp: true
    },
    "Leg": {
        name: "Crippled Leg",
        requirements: [{ axis: AxisEnum.MOVING, player: PlayerEnum.PLAYER }],
        effects: [{ axis: AxisEnum.PRONE, player: PlayerEnum.PLAYER }, { axis: AxisEnum.DAMAGE, player: PlayerEnum.PLAYER, amount: 3 }],
        optional: [],
        isFaceUp: true
    },
    "Chest": {
        name: "Crippled Chest",
        requirements: [{ axis: AxisEnum.STANDING, player: PlayerEnum.PLAYER }],
        effects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.PLAYER, amount: 10 }],
        optional: [],
        isFaceUp: true
    }
}