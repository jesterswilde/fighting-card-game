import {h} from 'preact'; 
import Requirement from './requirement';
import Effect from './effect';
import { RequirementEffect } from '../../../interfaces/card';


export default (props: RequirementEffect)=>{
    return <div className="optional">
        <div>
            {props.requirements.map((req, i)=> <span key={i}><Requirement requirement={req}/></span>)}
        </div>
        <div class='h-divider' />
        <div> 
            {props.effects.map((eff, i)=> <span key={i}><Effect effect={eff}/></span>)}
        </div>
    </div>
}