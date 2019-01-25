import { h } from 'preact';
import { AxisEnum, PlayerEnum } from "../interfaces/card";
import grapple from './grapple.png';
import close from './close.png';
import far from './far.png';
import moving from './moving.png';
import still from './still.png';
import standing from './standing.png';
import prone from './prone.png';
import balanced from './balanced.png';
import anticipating from './anticipating.png';
import unbalanced from './unbalanced.png';
import upArrow from './upArrow.png'; 
import downArrow from './downArrow.png';
import bothArrow from './bothArrow.png';
import damage from './damage.png'

const playerRouter: {[name: number]: string} ={
    [PlayerEnum.PLAYER]: downArrow,
    [PlayerEnum.OPPONENT]: upArrow,
    [PlayerEnum.BOTH]: bothArrow, 
}

const iconRouter: { [name: string]: string } = {
    [AxisEnum.GRAPPLED]: grapple,
    [AxisEnum.CLOSE]: close,
    [AxisEnum.FAR]: far,
    [AxisEnum.MOVING]: moving,
    [AxisEnum.STILL]: still,
    [AxisEnum.STANDING]: standing,
    [AxisEnum.PRONE]: prone,
    [AxisEnum.BALANCED]: balanced,
    [AxisEnum.ANTICIPATING]: anticipating,
    [AxisEnum.UNBALANCED]: unbalanced,
    [AxisEnum.DAMAGE]: damage,
}

const classRouter: { [name: string]: string } = {
    [AxisEnum.GRAPPLED]: 'distance',
    [AxisEnum.CLOSE]: 'distance',
    [AxisEnum.FAR]: 'distance',
    [AxisEnum.MOVING]: 'motion',
    [AxisEnum.STILL]: 'motion',
    [AxisEnum.STANDING]: 'standing',
    [AxisEnum.PRONE]: 'standing',
    [AxisEnum.BALANCED]: 'balance',
    [AxisEnum.ANTICIPATING]: 'balance',
    [AxisEnum.UNBALANCED]: 'balance',
    [AxisEnum.DAMAGE]: 'damage',
}

export const Arrow =({player}: {player:number})=>(
    <div class='inline'>
        <img class='player-icon' src={playerRouter[player]} />
    </div>
)


export const Icon = ({ name }: { name: string }) => (
    <div class={`inline axis-bg ${classRouter[name]}`}>
        <img class='axis-icon' src={iconRouter[name]} />
    </div>
)
