import {h} from 'preact';
import { Card, PlayerEnum } from '../../../interfaces/card';
import Effect from './effect'; 
import Requirement from './requirement';
import Optional from './optional'; 


interface Props extends Card {}

export const playerRouter = {
    [PlayerEnum.PLAYER]: '↓',
    [PlayerEnum.OPPONENT]: '↑',
    [PlayerEnum.BOTH]: '↕'
}

export default ({ name, optional, requirements, effects }: Props)=>{
    return <div class='game-card text-center'>
            <div class='title'>{name}</div>
            <div class='card-section req'>
                {requirements.map((req, i) => <span key={i}><Requirement requirement={req} /></span>)}
            </div>
            <div class='card-section'>
                {optional.map((opt, i) => <span key={i}> <Optional {...opt}  /> </span>)}
            </div>
            <div class='card-section effect'>
                {effects.map((effect, i) => <span key={i}><Effect effect={effect} /></span>)}
            </div>
        </div>
}