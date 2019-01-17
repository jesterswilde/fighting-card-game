import * as React from 'react'; 
import { StatePiece } from 'src/Logic/CardInterface';
import {playerRouter as pr} from '../Logic/Util'; 

interface Props{
    requirement: StatePiece
}

export default (props: Props)=>{
    return <span className="mr-3">
        { pr[props.requirement.player]} {props.requirement.axis}
    </span>
}