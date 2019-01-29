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
import further from './further.png';
import closer from './closer.png';
import { playerEnumToPlayerArray } from '../../../serverBuild/gameServer/util';
import ReactTooltip from 'react-tooltip';

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
    [AxisEnum.FURTHER]: further
}

const classRouter: { [name: string]: string } = {
    [AxisEnum.GRAPPLED]: 'distance',
    [AxisEnum.CLOSE]: 'distance',
    [AxisEnum.FAR]: 'distance',
    [AxisEnum.CLOSER]: 'distance',
    [AxisEnum.FURTHER]: 'distance',
    [AxisEnum.MOVING]: 'motion',
    [AxisEnum.STILL]: 'motion',
    [AxisEnum.STANDING]: 'standing',
    [AxisEnum.PRONE]: 'standing',
    [AxisEnum.BALANCED]: 'balance',
    [AxisEnum.ANTICIPATING]: 'balance',
    [AxisEnum.UNBALANCED]: 'balance',
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




export const Icon = ({ name }: { name: string }) => (
    <div class='inline'>
        <div class={`inline axis-bg ${classRouter[name]}`}>
            <img data-tip={name} data-for={'icon-tooltip'} class='axis-icon' src={iconRouter[name]} />
        </div>
    </div>
)
