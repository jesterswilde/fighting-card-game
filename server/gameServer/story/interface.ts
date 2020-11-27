import { AxisEnum, PlayerEnum } from "../../shared/card";
import { StateMod } from "../lobby/interface";

export interface StoryInfo{
    battleID: string,
    playerVitals: Vitals,
}

export interface Vitals{
    health: number,
    deckList?: string[],
}

export interface StoryBattle{
    id: string
    name: string
    enemy: Vitals
    startingPositions: StateMod[]
}