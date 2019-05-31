import { h } from 'preact';
import { Card, Mechanic, getMechDisplay } from '../../shared/card';
import Requirement from './requirement';
import Optional from './optional';
import Effect from './effect';

interface Props {
    card: Card
    shouldFlip?: boolean
}


const splitDisplays = (effects: Mechanic[]) => {
    const icons: Mechanic[] = [];
    const mechs: Mechanic[] = [];
    effects.forEach((eff) => {
        const display = getMechDisplay(eff.mechanic);
        if (display.eff || display.pick) {
            mechs.push(eff);
        } else {
            icons.push(eff);
        }
    })
    return [icons, mechs]
}


export default ({ card, shouldFlip }: Props) => {
    const [icons, mechs] = splitDisplays(card.effects);
    const titleChange = card.name.length > 12 ? " small" : '';
    const mechSize = mechs.length >= 3 ? ' small' : ''; 
    return <div class="full-card">
        <div class="title-bar">
            <div class={"title" + titleChange}> {card.name}</div>
            <div class="requirements"> {card.requirements.map((req, i) => <div key={i}><Requirement requirement={req} shouldFlip={shouldFlip} /></div>)}</div>
        </div>
        <div class="effects">
            {icons.map((eff, i) => <div key={i}><Effect effect={eff} shouldFlip={shouldFlip} /></div>)}
        </div>
        <div class={"effects" + mechSize}>
            {card.optional.map((opt, i) => <div key={i}><Optional shouldFlip={shouldFlip} effects={opt.effects} requirements={opt.requirements} /></div>)}
            {mechs.map((eff, i) => <div key={i}><Effect effect={eff} shouldFlip={shouldFlip} /></div>)}
        </div>
        <div class='priority'>
            {card.priority}
        </div>

    </div>
}

