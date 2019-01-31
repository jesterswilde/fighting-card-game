import {h} from 'preact'; 
import {Mechanic, Card} from '../../interfaces/card'
import {StoreState} from '../../state/store'
import HandCard from './card/handCard'; 
import { dispatchDidPickOne } from '../../game/dispatch';
import { connect } from 'preact-redux';

interface Props {
    choices: Card[]
}

const selector = (state: StoreState): Props=>{
    const choices = state.game.choices.map((choice, i)=>{
        const card: Card = {
            name: `Choice ${i}`,
            requirements: [],
            optional: [],
            effects: choice,
        }
        return card; 
    })
    return {choices}; 
}

const PickOne = ({choices}: Props)=>{
    return <div>
        Pick One 
        <div>
            {choices.map((choice, i)=>{
                return <div
                    class="inline"
                    onClick={()=>dispatchDidPickOne(i)}
                >
                <HandCard {...choice}/>
                </div>
            })}
        </div>
    </div>
}

export default connect(selector)(PickOne); 