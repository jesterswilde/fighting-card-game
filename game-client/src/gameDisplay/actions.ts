
export enum GameDisplayActionEnum {
    SHOULD_PREDICT = 'shouldPredict'
}

export interface ShouldPredictAction {
    type: GameDisplayActionEnum.SHOULD_PREDICT
}

export type ScreenDisplayActions = ShouldPredictAction;