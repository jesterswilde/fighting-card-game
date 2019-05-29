import { h } from 'preact';
import Requirement from './requirement';
import Effect from './effect';
import { Optional } from '../../shared/card';

interface Props extends Optional {
    greyUnusable?: boolean
    shouldFlip?: boolean
}

export default (props: Props) => {
    const unusuable = !props.canPlay;
    return <div className={`optional mechanic ${unusuable ? 'unusable' : ''}`}>
        <div>
            <b>Optional:</b>
        </div>
        <div>
            <div class="req-parent">
                {props.requirements.map((req, i) => <span key={i}><Requirement shouldFlip={props.shouldFlip} requirement={req} /></span>)}
            </div>
                <div class='h-divider' />
            <div class="eff-parent">
                {props.effects.map((eff, i) => <span key={i}><Effect effect={eff} shouldFlip={props.shouldFlip} /></span>)}
            </div>
        </div>
    </div>
}