import { h } from 'preact';
import { GameState } from '../../game/interface';
import { StoreState } from '../../state/store';
import { HandState } from '../../hand/interface';
import Board from './board';
import Hand from './hand';
import Predict from './predictChoices';
import PlayerState from './stateMachine/playerStates'; 
import Prediction from './predictions'
import PickOne from './pickOne'; 
import Forceful from './forceful'; 
import Events from './events'; 
import { GameDisplayEnum } from '../../gameDisplay/interface';
import { cleanConnect } from '../../util';

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
    const { currentPlayer, queue, player, hasGameState} = game;
    console.log(game); 
    if(!hasGameState){
        return null; 
    }
    return <div>
        {shouldDisplayEvents && <Events />}
        <Prediction {...game}/>
        <Board  player={player} currentPlayer={currentPlayer} queue={queue}/>
        {screen === GameDisplayEnum.NORMAL && <Hand />}
        {screen === GameDisplayEnum.PREDICT && <Predict />}
        {screen === GameDisplayEnum.PICK_ONE && <PickOne />}
        {screen === GameDisplayEnum.FORCEFUL && <Forceful />}
        <PlayerState {...game} identity={player}/>
    </div>
}

export default cleanConnect(selector, game); 