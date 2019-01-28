import { h } from 'preact';
import { GameState, DistanceEnum, PlayerState, MotionEnum, PlayerStateDuration, StandingEnum, BalanceEnum } from '../../game/interface';
import { StoreState } from '../../state/store';
import { connect } from 'preact-redux';
import { Icon } from '../../images';
import { AxisEnum } from '../../interfaces/card';

interface Props extends GameState { };

interface CompProps extends Props {
    playerIndex: number
}

const selector = (state: StoreState): Props => {
    return state.game;
}


const StateMachine = (props: Props) => {
    const { player } = props;
    const opponent = player === 0 ? 1 : 0;
    if (props.playerStates === undefined) {
        return null
    }

    return <div class='state-machine'>
        <div class='state-row'>
            <Standing {...props} playerIndex={opponent} />
            <Motion {...props} playerIndex={opponent} />
            <Balance {...props} playerIndex={player} />
        </div>
        <div class='state-row'>
            <Distance {...props} />
            <Health {...props} />
        </div>
        <div class='state-row'>
            <Standing {...props} playerIndex={player} />
            <Motion {...props} playerIndex={player} />
            <Balance {...props} playerIndex={player} />
        </div>
    </div>
}

const Health = ({ health, player }: Props) => {
    const opponent = player === 0 ? 1 : 0;
    return <div class='center-it state-piece-container'>{health[player]} Health {health[opponent]}</div>

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

const Balance = ({ playerStates = [], stateDurations = [], playerIndex = 0 }: CompProps) => {
    const { balance } = playerStates[playerIndex];
    const { balance: duration } = stateDurations[playerIndex];
    return <div class='state-piece-container'>
        <div class='state-piece-title balance'>Balance</div>
        <div class='state-pieces'>
            <div class={`state-piece balance ${balance === BalanceEnum.UNBALANCED ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.UNBALANCED} />
            </div>
            <div class={`state-piece balance ${balance === BalanceEnum.BALANCED ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.BALANCED} />
            </div>
            <div class={`state-piece balance ${balance === BalanceEnum.ANTICIPATING ? '' : 'inactive'}`}>
                <Icon name={AxisEnum.ANTICIPATING} />
            </div>
        </div>
    </div>
}



export default connect(selector)(StateMachine); 