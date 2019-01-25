import { ScreenEnum } from "./interface";

export enum DisplayActionEnum{
    SWITCH_SCREEN = 'switchScreen'
}

export interface SwitchScreenAction {
    type: DisplayActionEnum.SWITCH_SCREEN,
    screen: ScreenEnum
}

export type DisplayActions = SwitchScreenAction;