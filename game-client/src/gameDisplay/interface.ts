export interface GameDisplayState{
    screen: GameDisplayEnum 
    showFullCard: boolean
}

export enum GameDisplayEnum{
    NORMAL,
    PREDICT
}