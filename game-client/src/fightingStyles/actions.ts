import { FightingStyle, FightingStyleDescription } from "./interface";

export enum FightingStyleEnum{
    LOADING_STYLE = 'loadingFightingStyle',
    GOT_STYLE = "gotFightingStyle",
    LOADING_STYLE_NAMES = 'loadingFightingStyleNames',
    GOT_STYLE_NAMES = "gotFightingStyleNames"
}

export interface LoadingFightingStyleAction{
    type: FightingStyleEnum.LOADING_STYLE
}

export interface GotFightingStyleAction {
    type: FightingStyleEnum.GOT_STYLE,
    style: FightingStyle
}

export interface LoadingFightingStyleNames{
    type: FightingStyleEnum.LOADING_STYLE_NAMES
}

export interface GotFightingStyleDescriptions {
    type: FightingStyleEnum.GOT_STYLE_NAMES,
    styleDescriptions: FightingStyleDescription[]
}

export type FightingStyleActions = GotFightingStyleAction | GotFightingStyleDescriptions | LoadingFightingStyleAction | LoadingFightingStyleNames;