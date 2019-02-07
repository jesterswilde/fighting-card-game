import { h } from 'preact';
import Requirement from './requirement';
import Effect from './effect';
import { Optional } from '../../../interfaces/card';

interface Props extends Optional {
    greyUnusable?: boolean
}

export default (props: Props) => {
    const unusuable = !props.canPlay;
    return <div className={`optional ${unusuable ? 'unusable' : ''}`}>
        <div>
            {props.requirements.map((req, i) => <span key={i}><Requirement requirement={req} /></span>)}
        </div>
            <div class='h-divider' />
        <div>
            {props.effects.map((eff, i) => <span key={i}><Effect effect={eff} /></span>)}
        </div>
    </div>
}