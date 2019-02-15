import { h } from 'preact';
import { Card } from '../../../interfaces/card';
import Effect from './effect'
import Requirement from './Requirement';
import Optional from './optional';

interface Props extends Card {
    identity: number
}

const FullQueueCard = ({ identity, name, requirements = [], effects = [], optional = [], player }: Props) => {
    const shouldFlip = identity !== player;
    return <div>
        <div>{name}</div>
        <div class='card-section req'>
            {requirements.map((req, i) => <span key={i}><Requirement requirement={req} /></span>)}
        </div>
        <div class='card-section'>
            {optional.map((opt, i) => <span key={i}> <Optional {...opt} greyUnusable={true} /> </span>)}
        </div>
        <div class='card-section effect'>
            {effects.map((effect, i) => <span key={i}><Effect effect={effect} /></span>)}
        </div>
    </div>
}

export default FullQueueCard; 