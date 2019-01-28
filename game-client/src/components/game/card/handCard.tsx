import {h} from 'preact'; 
import { Card } from '../../../interfaces/card';
import Optional from './optional'; 
import Effect from './effect'

interface Props extends Card{}

const HandCard = (card: Props)=>{
    const { name, optional , effects } = card;
    return <div class='game-card text-center'>
            <div class='title'>{name}</div>
            <div class='card-section'>
                {optional.filter(({canPlay})=> canPlay)
                    .map((opt, i) => <span key={i}> <Optional {...opt} hideReqs={true}  /> </span>)}
            </div>
            <div class='card-section effect'>
                {effects.map((effect, i) => <span key={i}><Effect effect={effect} /></span>)}
            </div>
        </div>
}

export default HandCard; 