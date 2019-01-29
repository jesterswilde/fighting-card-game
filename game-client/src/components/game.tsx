import { h } from 'preact';
import { GameState } from '../game/interface';
import { StoreState } from '../state/store';
import { connect } from 'preact-redux';
import { HandState } from '../hand/interface';
import {Board} from './game/board';
import Hand from './game/hand';
import Choices from './game/choices';
import StateMachine from './game/stateMachine'; 
import Prediction from './game/predictions'
import { GameDisplayEnum } from '../gameDisplay/interface';
import ReactTooltip from 'react-tooltip'; 

interface Props {
    game: GameState,
    hand: HandState
    screen: GameDisplayEnum
}

const selector = (state: StoreState): Props => {
    const { game, hand, gameDisplay } = state;
    return { game, hand, screen: gameDisplay.screen};
}

const game = ({ game, hand, screen }: Props) => {
    const {currentPlayer, queue, player} = game; 
    return <div>
        <h2>Game</h2>
        <StateMachine />
        <ReactTooltip id='icon-tooltip' effect="solid"></ReactTooltip>
        <Prediction {...game}/>
        <Board  player={player} currentPlayer={currentPlayer} queue={queue}/>
        {screen === GameDisplayEnum.NORMAL && <Hand />}
        {screen !== GameDisplayEnum.NORMAL && <Choices />}
    </div>
}

export default connect(selector)(game); 