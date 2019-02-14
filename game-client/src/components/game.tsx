import { h } from 'preact';
import { GameState } from '../game/interface';
import { StoreState } from '../state/store';
import { HandState } from '../hand/interface';
import Board from './game/board';
import Hand from './game/hand';
import Predict from './game/predictChoices';
import StateMachine from './game/stateMachine'; 
import Prediction from './game/predictions'
import PickOne from './game/pickOne'; 
import Forceful from './game/forceful'; 
import Events from './game/events'; 
import { GameDisplayEnum } from '../gameDisplay/interface';
import { cleanConnect } from '../util';

interface Props {
    game: GameState,
    hand: HandState
    screen: GameDisplayEnum
    shouldDisplayEvents: boolean
}

const selector = (state: StoreState): Props => {
    const { game, hand, gameDisplay } = state;
    return { game, hand, screen: gameDisplay.screen, shouldDisplayEvents: state.events.isDisplaying};
}

const game = ({ game, screen, shouldDisplayEvents }: Props) => {
    const { currentPlayer, queue, player} = game;
    return <div>
        {shouldDisplayEvents && <Events />}
        <h2>Game</h2>
        <StateMachine />
        <Prediction {...game}/>
        <Board  player={player} currentPlayer={currentPlayer} queue={queue}/>
        {screen === GameDisplayEnum.NORMAL && <Hand />}
        {screen === GameDisplayEnum.PREDICT && <Predict />}
        {screen === GameDisplayEnum.PICK_ONE && <PickOne />}
        {screen === GameDisplayEnum.FORCEFUL && <Forceful />}
    </div>
}

export default cleanConnect(selector, game); 