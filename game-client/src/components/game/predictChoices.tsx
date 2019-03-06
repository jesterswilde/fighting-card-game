import { h } from 'preact';
import { dispatchMadePrediction } from "../../game/dispatch";
import { PredictionEnum } from "../../game/interface";
import { GameDisplayEnum } from "../../gameDisplay/interface";
import { StoreState } from "../../state/store";
import { cleanConnect } from '../../util';
import { Tooltip, TooltipStyles } from 'react-lightweight-tooltip'

interface Props {
    display: GameDisplayEnum
}

const selector = (state: StoreState): Props => {
    return {
        display: state.gameDisplay.screen
    }
}


const tooltipStyle: TooltipStyles = {
    wrapper: {
        cursor: 'default',
        transform: 'translate(200px, 40px)'
    },
    tooltip: { width: '1.5rem'}, arrow: {}, gap: {}, content: { zIndex: 100 }
}

const Choices = ({ display }: Props) => {
    switch (display) {
        case GameDisplayEnum.PREDICT:
            return <div><Prediction /></div>
        default:
            return <span></span>
    }
}

const Prediction = () => {
    return <div class="prediction-wrapper">
        <Tooltip styles={tooltipStyle} content={"Guess correctly what state will be on your opponents card this turn to get prediction effect"}>
            <div class="help">?</div>
        </Tooltip>
        <div class="prediction-choices">
            <h2 class="title">Predict: </h2>
            <div class="prediction-offset">
                <div
                    class="prediction-choice"
                    onClick={() => dispatchMadePrediction(PredictionEnum.DISTANCE)} >
                    Distance
            </div>
                <div class="prediction-offset">
                    <div
                        class="prediction-choice"
                        onClick={() => dispatchMadePrediction(PredictionEnum.MOTION)} >
                        Motion
                </div>
                    <div class="prediction-offset">
                        <div
                            class="prediction-choice"
                            onClick={() => dispatchMadePrediction(PredictionEnum.STANDING)} >
                            Standing
                    </div>
                        <div class="prediction-offset">
                            <div
                                class="prediction-choice"
                                onClick={() => dispatchMadePrediction(PredictionEnum.NONE)} >
                                None
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default cleanConnect(selector, Choices); 