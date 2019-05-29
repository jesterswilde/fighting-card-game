import { h } from 'preact';
import Effect from './effect'
import Requirement from './Requirement';
import Optional from './optional';
import { Card, Mechanic, getMechDisplay } from '../../../shared/card'

interface Props extends Card {
    identity: number
}

const FullQueueCard = ({ identity, name, requirements = [], effects = [], optional = [], player }: Props) => {
    const shouldFlip = identity !== player;
    return <div>
        <div>{name}</div>
        <div class='card-section req'>
            {requirements.map((req, i) => <span key={i}><Requirement requirement={req} shouldFlip={shouldFlip} /></span>)}
        </div>
        <div class='card-section'>
            {optional.map((opt, i) => <span key={i}> <Optional {...opt} shouldFlip={shouldFlip} greyUnusable={true} /> </span>)}
        </div>
        <div class='card-section effect'>
            {effects.map((effect, i) => <span key={i}><Effect shouldFlip={shouldFlip} effect={effect} /></span>)}
        </div>
    </div>
}

export default FullQueueCard; 