import * as React from 'react'; 
import { playerRouter as pr } from '../../utils';
import { StatePieceJSON } from '../../interfaces/cardJSON';

interface Props{
    requirement: StatePieceJSON
}

export default (props: Props)=>{
    console.log(props); 
    return <span className="mr-3">
        { pr[props.requirement.player]} {props.requirement.axis}
    </span>
}