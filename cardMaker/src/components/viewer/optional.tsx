import * as React from 'react'; 
import { RequirementEffectJSON } from '../../interfaces/cardJSON';
import Requirement from './requirement';
import Effect from './effect'; 

export default (props: RequirementEffectJSON)=>{
    return <div className="ml-3 card seperate">
        <div>
            {props.requirements.map((req)=> <Requirement key={req.id} requirement={req}/>)}
        </div>
        <div className="h-divier" />
        <div className="ml-3">
            {props.effects.map((eff)=> <Effect key={eff.id} effect={eff}/>)}
        </div>
    </div>
}