import { h } from 'preact';
import { GameState, PredictionState, PredictionEnum } from '../../game/interface';
import Effect from './card/effect';
import { Mechanic } from '../../shared/card';
import { Arrow, Icon } from '../../images'

interface Prediction {
    isMine: boolean
    prediction?: PredictionEnum
    mechanics: Mechanic[]
}

interface Props {
    predictions: Prediction[],
}

const selector = (state: GameState): Props => {
    const predictions = state.predictions || [];
    return {
        predictions: predictions.map((pred, player) => {
            if(!pred) return null; 
            return {
                isMine: player === state.player,
                prediction: pred.prediction,
                mechanics: pred.mechanics
            }
        })
    }
}

const Prediction = ({ predictions }: Props) => {
    if (predictions.length > 0) {
        return <div class='predictions'>
            <div class="title">Predictions: </div>
            {predictions.map((pred, i) => {
                if(!pred) return null; 
                const isMine = pred.isMine ? '' : 'opponent'
                return <div class={'prediction ' + isMine} key={i}>
                    {pred.prediction && <div class="guess">Prediction: {pred.prediction}</div>}
                    {pred.mechanics.map((mech, i) => {
                        return <div key={i}><Effect effect={mech} shouldFlip={!pred.isMine} /> </div>
                    })}
                </div>
            })}
        </div>
    } else {
        return <div></div>
    }
}

export default (props: GameState) => {
    return Prediction(selector(props));
}