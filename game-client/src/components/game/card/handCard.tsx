import { h } from 'preact';
import { Card } from '../../../shared/card';
import Optional from './optional';
import Effect from './effect'
import Requirement from './Requirement';
import { splitEffects } from '../../../util';

interface Props extends Card { }

const HandCard = (card: Props) => {
    const { name, optional, effects, requirements } = card;
    const { effects: effOnly, mechanics } = splitEffects(effects);
    console.log(effOnly, mechanics); 
    return <div class='game-card text-center'>
        <div class='title'>{name}</div>
        <div class='card-section req'>
            {requirements.map((req, i) => <div key={i}><Requirement requirement={req} /></div>)}
        </div>
        <div class='card-section '>
            {optional.map((opt, i) => <div key={i}> <Optional {...opt} greyUnusable={true} /> </div>)}
        </div>
        <div class='card-section effect'>
            <div>
                {effOnly.map((effect, i) => <div key={i}><Effect effect={effect} /></div>)}
            </div>
            <div>
                {mechanics.map((effect, i) => <div key={i}><Effect effect={effect} /></div>)}
            </div>
        </div>
    </div>
}

export default HandCard; 