import { h } from 'preact';
import { playerRouter } from './viewer';
import { StatePiece } from '../../../shared/card';
import {Icon, Arrow} from '../../../images/index'; 

interface Props{
    requirement : StatePiece
    shouldFlip?: boolean
}

export default (props: Props)=>(
    <div class='inline'>
    <Arrow player={props.requirement.player} shouldFlip={props.shouldFlip}/> <Icon name={props.requirement.axis} />
    </div>
)