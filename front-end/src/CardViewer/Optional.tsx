import * as React from 'react'; 
import { RequirementEffect } from 'src/Logic/CardInterface';
import Requirement from './Requirement';
import Effect from './Effect';


export default (props: RequirementEffect)=>{
    return <div className="ml-3 card seperate">
        <div>
            {props.requirements.map((req, i)=> <Requirement key={i} requirement={req}/>)}
        </div>
        <div className="h-divier" />
        <div className="ml-3">
            {props.effects.map((eff, i)=> <Effect key={i} effect={eff}/>)}
        </div>
    </div>
}