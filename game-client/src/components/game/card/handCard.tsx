import { h } from 'preact';
import { Card } from '../../../shared/card';
import Optional from './optional';
import Effect from './effect'
import Requirement from './Requirement';
import { splitEffects } from '../../../util';
import { Tooltip, TooltipStyles } from 'react-lightweight-tooltip';

interface Props extends Card { }

const HandCard = (card: Props) => {
    const { name, optional, effects, requirements, tags = [], priority } = card;
    const { effects: effOnly, mechanics } = splitEffects(effects);
    return <div class='game-card text-center'>
        <div class='title'><div/><div>{name}</div> <div class="priority">{renderPriority(priority)}</div> </div>
        <div class='card-section req'>
            {requirements.map((req, i) => <div key={i}><Requirement requirement={req} /></div>)}
        </div>
        <div class="tags">{tags.map(({ value }, i) => <div key={i}>{value}</div>)}</div>
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

const renderPriority = (priority: number) => {
    return <Tooltip content={"Priority: When 2 cards say conflicting things, the one with the higher number wins"} styles={priorityStyle}>
            {priority}
    </Tooltip>
}

const priorityStyle: TooltipStyles = {
    wrapper: {
        cursor: 'default',
    },
    tooltip: { minWidth: '80px', whiteSpace: "nowrap" }, arrow: {}, gap: {}, content: { zIndex: 100 }
}

export default HandCard; 