import { StoreState } from "./state/store";
import { connect } from 'preact-redux';
import { DistanceEnum, StandingEnum, MotionEnum } from "./game/interface";
import { Mechanic, getMechDisplay } from "./shared/card";

export let HOST_URL = '/api';
if (location.host.split(':')[0] === 'localhost') {
    HOST_URL = 'http://localhost:8080/api'
}

export const splitEffects = (mechs: Mechanic[])=>{
    return mechs.reduce((result, mech)=>{
        const {eff} = getMechDisplay(mech.mechanic); 
        if(eff){
            result.mechanics.push(mech); 
        }else{
            result.effects.push(mech); 
        }
        return result; 
    },{effects:[], mechanics:[]})
}

export const nRange = (n: number) => {
    return Array.apply(null, { length: n }).map(Number.call, Number)
}

export const cleanConnect = <T>(selector: (state: StoreState) => T, comp: (props: T) => JSX.Element) => {
    return connect(selector)(comp) as unknown as () => JSX.Element;
}

let uuid = 0;
export const getUUID = (obj: { [index: string]: any }) => {
    if (obj.uuid === undefined) {
        obj.uuid = uuid;
        uuid++;
    }
    return obj.uuid;
}

export const printDistance = (distance: DistanceEnum) => {
    const result = distanceRouter[distance];
    return result || null;
}
const distanceRouter = {
    [DistanceEnum.CLOSE]: "Close",
    [DistanceEnum.FAR]: "Far",
    [DistanceEnum.GRAPPLED]: "Grappled"
}

export const printStanding = (standing: StandingEnum) => {
    const result = standingRouter[standing];
    return result || null;
}

const standingRouter = {
    [StandingEnum.PRONE]: "Prone",
    [StandingEnum.STANDING]: "Standing"
}

export const printMotion = (motion: MotionEnum) => {
    const result = motionRouter[motion];
    return result || null;
}
const motionRouter = {
    [MotionEnum.MOVING]: "Moving",
    [MotionEnum.STILL]: "Still"
}