import { Card, AxisEnum, PlayerEnum } from "../interfaces/cardInterface";
import { makeBlankCard } from "../util";

export const getCardByName = (name: string): Card=>{
    const card = crippledObj[name]
    if(card === undefined){
        return makeBlankCard(); 
    }
    return card; 
}


const crippledObj: { [name: string]: Card } = {
    "Leg": {
        name: "Crippled Leg",
        requirements: [{ axis: AxisEnum.MOVING, player: PlayerEnum.PLAYER }],
        effects: [{ axis: AxisEnum.PRONE, player: PlayerEnum.PLAYER }, { axis: AxisEnum.DAMAGE, player: PlayerEnum.PLAYER, amount: 3 }],
        optional: []
    },
    "Chest": {
        name: "Crippled Chest",
        requirements: [{ axis: AxisEnum.STANDING, player: PlayerEnum.PLAYER }],
        effects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.PLAYER, amount: 10 }],
        optional: []
    }
}