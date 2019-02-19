import { h } from 'preact';
import { GameState, DistanceEnum, PlayerState, MotionEnum, PlayerStateDuration, StandingEnum, BalanceEnum } from '../../game/interface';
import { StoreState } from '../../state/store';
import { Icon } from '../../images';
import { AxisEnum } from '../../interfaces/card';
import { cleanConnect } from '../../util';
import Poise from './stateMachine/poise'; 

interface Props extends GameState { };

interface CompProps extends Props {
    playerIndex: number
}

const selector = (state: StoreState): Props => {
    return state.game;
}


const StateMachine = (props: Props): JSX.Element => {
    const { player } = props;
    const opponent = player === 0 ? 1 : 0;
    if (props.playerStates === undefined) {
        return null;
    }

    return <div class='state-machine'>
        <div class='state-row'>
            <Standing {...props} playerIndex={opponent} />
            <Motion {...props} playerIndex={opponent} />
            <Health {...props} playerIndex={opponent} />
            <Block {...props} playerIndex={opponent} />
        </div>
        <div class='state-row'>
            <Poise {...props} playerIndex={opponent} />
        </div>
        <div class='state-row'>
            <div class='state-title state-piece-container-sml'>State</div>
            <Distance {...props} />
        </div>
        <div class='state-row'>
            <Standing {...props} playerIndex={player} />
            <Motion {...props} playerIndex={player} />
            <Health {...props} playerIndex={player} />
            <Block {...props} playerIndex={player} />
        </div>
        <div class='state-row'>
            <Poise {...props} playerIndex={player} />
        </div>
    </div>
}

const Block = ({ block, playerIndex }: CompProps, ) => {
    return <div class="state-piece-container-sml distance ">
        <div>Block</div>
        <div>{block[playerIndex]}</div>
    </div>
}

const Health = ({ health, playerIndex }: CompProps) => {
    return <div class='state-piece-container-sml distance sml'>
        <div>Health</div>
        <div>
            {health[playerIndex]}
        </div>
    </div>

}

const Distance = ({ distance }: Props) => {
    return <div class='state-piece-container'>
        <div class='state-piece-title distance'>Distance</div>
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


const Motion = ({ playerIndex = 0, stateDurations = [], playerStates = [] }: CompProps) => {
    const { motion } = playerStates[playerIndex];
    const { motion: duration } = stateDurations[playerIndex];
    return <div class='state-piece-container'>
        <div class='state-piece-title motion'>Motion</div>
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


const Standing = ({ playerStates = [], stateDurations = [], playerIndex = 0 }: CompProps) => {
    const { standing } = playerStates[playerIndex];
    const { standing: duration } = stateDurations[playerIndex];
    return <div class='state-piece-container'>
        <div class='state-piece-title standing'>Standing</div>
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


export default cleanConnect(selector, StateMachine); 
