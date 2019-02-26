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
import OppHand from './oppHand'; 
import { GameDisplayEnum } from '../../gameDisplay/interface';
import { cleanConnect } from '../../util';

interface Props {
    game: GameState,
    hand: HandState
    screen: GameDisplayEnum
    shouldDisplayEvents: boolean
    opponent: number
}

const selector = (state: StoreState): Props => {
    const { game, hand, gameDisplay } = state;
    const opponent = game.player === 0 ? 1 : 0;
    return { game, opponent, hand, screen: gameDisplay.screen, shouldDisplayEvents: state.events.isDisplaying };
}

const game = ({ game, screen, opponent, shouldDisplayEvents }: Props) => {
    const { currentPlayer, queue, player, hasGameState } = game;
    if (!hasGameState) {
        return null;
    }
    return <div class="game">
        <div class="opponent-section">
            <OppHand />
            <PlayerState {...game} identity={opponent} />
        </div>
        {shouldDisplayEvents && <Events />}
        <Prediction {...game} />
        <Board player={player} currentPlayer={currentPlayer} queue={queue} />
        <div className="player-section">
            <PlayerState {...game} identity={player} />
            <PlayerHand screen={screen} />
        </div>
    </div>
}

const PlayerHand = ({ screen }: { screen: GameDisplayEnum }) => {
    return <div>
        {screen === GameDisplayEnum.NORMAL && <Hand />}
        {screen === GameDisplayEnum.PREDICT && <Predict />}
        {screen === GameDisplayEnum.PICK_ONE && <PickOne />}
        {screen === GameDisplayEnum.FORCEFUL && <Forceful />}
    </div>
}

export default cleanConnect(selector, game); 