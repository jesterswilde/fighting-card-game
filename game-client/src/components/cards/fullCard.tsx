import { h } from 'preact';
import { Card } from '../../shared/card';
import Requirement from '../game/card/Requirement';
import Optional from '../game/card/Optional';
import Effect from '../game/card/effect';

interface Props {
    card: Card
    shouldFlip?: boolean
}

export default ({ card, shouldFlip }: Props) => {
    return <div class="full-card">
        <div class="title-bar">
            <div class="requirements"> {card.requirements.map((req, i) => <div key={i}><Requirement requirement={req} shouldFlip={shouldFlip} /></div>)}</div>
            <div class="title"> {card.name}</div>
        </div>
        <div class="optional">
            {card.optional.map((opt, i)=> <div key={i}><Optional shouldFlip={shouldFlip} effects={opt.effects} requirements={opt.requirements} /></div>)}
        </div>
        <div class="effects">
            {card.effects.map((eff, i )=> <div key={i}><Effect effect={eff} shouldFlip={shouldFlip} /></div>)}
        </div>
    </div>
}