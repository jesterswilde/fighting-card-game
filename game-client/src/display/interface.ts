
export interface DisplayState{
    url: string,
    screen: ScreenEnum
}

export enum ScreenEnum {
    CHOOSE_DECK,
    LOOKING_FOR_GAME,
    CONNECTING,
    GAME_STARTED
}