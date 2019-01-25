import { h } from 'preact';
import { playerRouter } from './viewer';
import { StatePiece } from '../../../interfaces/card';
import {Icon, Arrow} from '../../../images/index.tsx'

interface Props{
    requirement : StatePiece
}

export default (props: Props)=>(
    <div class='inline'>
    <Arrow player={props.requirement.player}/> <Icon name={props.requirement.axis} />
    </div>
)