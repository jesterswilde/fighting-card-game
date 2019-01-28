import { h } from 'preact';
import Requirement from './requirement';
import Effect from './effect';
import { Optional } from '../../../interfaces/card';

interface Props extends Optional {
    hideReqs?: boolean
}

export default (props: Props) => {
    return <div className="optional">
        {!props.hideReqs && <div><div>
            {props.requirements.map((req, i) => <span key={i}><Requirement requirement={req} /></span>)}
        </div>
            <div class='h-divider' /></div>
        }
        <div>
            {props.effects.map((eff, i) => <span key={i}><Effect effect={eff} /></span>)}
        </div>
    </div>
}