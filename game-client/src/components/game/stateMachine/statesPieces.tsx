import {h} from 'preact'; 
import { AxisEnum } from '../../../shared/card';
import { printMotion, printStanding, printDistance } from '../../../util';
import { MotionEnum, StandingEnum, GameState, DistanceEnum } from '../../../game/interface';
import { Icon } from '../../../images';

interface Props extends GameState {
    playerIndex: number
}


export const Block = ({ block, playerIndex }: Props, ) => {
    return <div class="state-piece-container-sml distance ">
        <div>Block</div>
        <div>{block[playerIndex]}</div>
    </div>
}

export const Health = ({ health, playerIndex }: Props) => {
    return <div class='state-piece-container-sml distance sml'>
        <div>Health</div>
        <div>
            {health[playerIndex]}
        </div>
    </div>

}

export const Motion = ({ playerIndex = 0, stateDurations = [], playerStates = [] }: Props) => {
    const { motion } = playerStates[playerIndex];
    const { motion: duration } = stateDurations[playerIndex];
    return <div class='state-piece-container'>
        <div class='state-piece-title motion'>{printMotion(motion)}</div>
        <div class='state-pieces'>
            <div class={`state-piece motion ${motion === MotionEnum.STILL ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.STILL} />
            </div>
            <div class={`state-piece motion ${motion === MotionEnum.MOVING ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.MOVING} /> {duration}
            </div>
        </div>
    </div>
}


export const Standing = ({ playerStates = [], stateDurations = [], playerIndex = 0 }: Props) => {
    const { standing } = playerStates[playerIndex];
    const { standing: duration } = stateDurations[playerIndex];
    return <div class='state-piece-container'>
        <div class='state-piece-title standing'>{printStanding(standing)}</div>
        <div class='state-pieces'>
            <div class={`state-piece standing ${standing === StandingEnum.STANDING ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.STANDING} />
            </div>
            <div class={`state-piece standing ${standing === StandingEnum.PRONE ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.PRONE} /> {duration}
            </div>
        </div>
    </div>
}

export const Distance = ({ distance }: Props) => {
    return <div class='state-piece-container'>
        <div class='state-piece-title distance'>Distance: {printDistance(distance)}</div>
        <div class='state-pieces'>
            <div class={`state-piece distance ${distance === DistanceEnum.GRAPPLED ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.GRAPPLED} />
            </div>
            <div class={`state-piece distance ${distance === DistanceEnum.CLOSE ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.CLOSE} />
            </div>
            <div class={`state-piece distance ${distance === DistanceEnum.FAR ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.FAR} />
            </div>
        </div>
    </div>
}