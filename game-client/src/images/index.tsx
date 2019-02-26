/// <reference path='./index.d.tsx'/>
import { h } from 'preact';
import { AxisEnum, PlayerEnum } from "../shared/card";
import grapple from './grapple.png';
import close from './close.png';
import far from './far.png';
import moving from './moving.png';
import notClose from './not_close.png';
import notGrappled from './not_grapple.png';
import notFar from './not_far.png';
import still from './still.png';
import standing from './standing.png';
import prone from './prone.png';
import balanced from './balanced.png';
import anticipating from './anticipating.png';
import unbalanced from './unbalanced.png';
import upArrow from './upArrow.png';
import downArrow from './downArrow.png';
import bothArrow from './bothArrow.png';
import damage from './damage.png';
import further from './further.png';
import closer from './closer.png';
import poise from './poise.png';
import losePoise from './losePoise.png';
import { Tooltip, TooltipStyles } from 'react-lightweight-tooltip';
import { getUUID } from '../util';

const playerRouter: { [name: number]: string } = {
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
    [AxisEnum.CLOSER]: closer,
    [AxisEnum.FURTHER]: further,
    [AxisEnum.POISE]: poise,
    [AxisEnum.LOSE_POISE]: losePoise,
    [AxisEnum.NOT_GRAPPLED]: notGrappled,
    [AxisEnum.NOT_CLOSE]: notClose,
    [AxisEnum.NOT_FAR]: notFar,
}

const classRouter: { [name: string]: string } = {
    [AxisEnum.GRAPPLED]: 'distance',
    [AxisEnum.CLOSE]: 'distance',
    [AxisEnum.FAR]: 'distance',
    [AxisEnum.CLOSER]: 'distance',
    [AxisEnum.FURTHER]: 'distance',
    [AxisEnum.NOT_GRAPPLED]: 'distance',
    [AxisEnum.NOT_CLOSE]: 'distance',
    [AxisEnum.NOT_FAR]: 'distance',
    [AxisEnum.MOVING]: 'motion',
    [AxisEnum.STILL]: 'motion',
    [AxisEnum.STANDING]: 'standing',
    [AxisEnum.PRONE]: 'standing',
    [AxisEnum.BALANCED]: 'balance',
    [AxisEnum.ANTICIPATING]: 'balance',
    [AxisEnum.UNBALANCED]: 'balance',
    [AxisEnum.POISE]: 'balance',
    [AxisEnum.LOSE_POISE]: 'balance',
    [AxisEnum.DAMAGE]: 'damage',
}

export const Arrow = ({ player, shouldFlip }: { player: PlayerEnum, shouldFlip?: boolean }) => {
    if (shouldFlip) {
        if (player === PlayerEnum.OPPONENT) {
            player = PlayerEnum.PLAYER;
        } else if (player === PlayerEnum.PLAYER) {
            player = PlayerEnum.OPPONENT;
        }
    }
    return <div class='inline'>
        <img class='player-icon' src={playerRouter[player]} />
    </div>
}



const iconStyle: TooltipStyles = {
    wrapper:{
        cursor: 'default',
    },
    tooltip:{minWidth: '80px', whiteSpace: "nowrap"}, arrow:{}, gap:{}, content:{zIndex: 100}
}
export const Icon = (props: { name: string }) => {
    const { name } = props;
    const id = String(getUUID(props));
    return <div class='inline'>
        <Tooltip content={name} styles={iconStyle}>
            <div class={`inline axis-bg ${classRouter[name]}`}>
                <img class='axis-icon' src={iconRouter[name]} />
            </div>
        </Tooltip>
    </div>
}
