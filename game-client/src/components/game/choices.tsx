import {h} from 'preact'; 
import { dispatchMadePrediction } from "../../game/dispatch";
import { PredictionEnum } from "../../game/interface";
import { GameDisplayEnum } from "../../gameDisplay/interface";
import { StoreState } from "../../state/store";
import {connect} from 'preact-redux'; 

interface Props {
    display: GameDisplayEnum
}

const selector = (state: StoreState):Props=>{
    return {
        display: state.gameDisplay.screen
    }
}

const Choices = ({display}: Props)=>{
    console.log('got displays',display); 
    switch(display){
        case GameDisplayEnum.PREDICT:
            return <div><Prediction /></div>
        default:
            return <span></span>
    }
}

const Prediction = ()=>{
    console.log('prediction'); 
    return <div>
        <h2>Make Prediction</h2>
        <button
            class="btn btn-primary"
            onClick={()=>dispatchMadePrediction(PredictionEnum.DISTANCE)} >
                Distance
        </button>
        <button
            class="btn btn-primary"
            onClick={()=>dispatchMadePrediction(PredictionEnum.BALANCE)} >
                Balance
        </button>
        <button
            class="btn btn-primary"
            onClick={()=>dispatchMadePrediction(PredictionEnum.MOTION)} >
                Motion
        </button>
        <button
            class="btn btn-primary"
            onClick={()=>dispatchMadePrediction(PredictionEnum.STANDING)} >
                Standing
        </button>
        <button
            class="btn btn-primary"
            onClick={()=>dispatchMadePrediction(PredictionEnum.NONE)} >
                None
        </button>
    </div>
            
}

export default connect(selector)(Choices); 