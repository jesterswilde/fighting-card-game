import { h } from 'preact';
import { GameState, PredictionState, PredictionEnum } from '../../game/interface';
import Effect from './card/effect';

interface Props {
    predictions?: PredictionState[],
    isMyPrediction: boolean
}

const selector = (state: GameState): Props => {
    let isMyPrediction = false;
    if (state.predictions) {
        isMyPrediction = state.predictions[0].player === state.player
    }
    return {
        predictions: state.predictions,
        isMyPrediction
    }
}

const Prediction = ({ predictions, isMyPrediction }: Props) => {
    if (predictions) {
        if (isMyPrediction) {
            return <div>
                <h3>My Prediction</h3>
                {renderPrediction(predictions)}
            </div>
        } else {
            return <div>
                <h3> Opponents Prediction</h3>
                {renderPrediction(predictions)}
            </div>
        }
    } else {
        return <div>No Prediction</div>
    }
}

const renderPrediction = (predictions: PredictionState[]) => {
    return predictions.map(({prediction, mechanics}) => {
        return <div>
            {prediction !== undefined && predictionRouter[prediction]}
            {mechanics.map((eff) => <Effect effect={eff} />)}
        </div>
    });
};

const predictionRouter = {
    [PredictionEnum.BALANCE]: 'Balance',
    [PredictionEnum.DISTANCE]: 'Distance',
    [PredictionEnum.MOTION]: 'Motion',
    [PredictionEnum.STANDING]: 'Standing',
    [PredictionEnum.NONE]: 'None'
}

export default (props: GameState) => {
    return Prediction(selector(props));
}