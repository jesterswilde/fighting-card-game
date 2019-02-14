
export enum GameDisplayActionEnum {
    SHOULD_PREDICT = 'shouldPredict',
    SET_HAND_CARD_DISPLAY = 'setHandCardDisplay',
    PICK_FORCE = 'pickForce'
}

export interface SetHandCardDisplayAction{
    type: GameDisplayActionEnum.SET_HAND_CARD_DISPLAY,
    value: boolean
}

export interface ShouldPredictAction {
    type: GameDisplayActionEnum.SHOULD_PREDICT
}

export type ScreenDisplayActions = ShouldPredictAction | SetHandCardDisplayAction;