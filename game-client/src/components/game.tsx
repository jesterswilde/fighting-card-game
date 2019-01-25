import { h } from 'preact';
import { GameState } from '../game/interface';
import { Card } from '../interfaces/card';
import { StoreState } from '../state/store';
import { connect } from 'preact-redux';
import { HandState } from '../hand/interface';
import {Thing, Board} from './game/board';
import Hand from './game/hand';

interface Props {
    game: GameState,
    hand: HandState
}

const selector = (state: StoreState): Props => {
    const { game, hand } = state;
    return { game, hand };
}

const game = ({ game:{currentPlayer, queue, player}, hand }: Props) => (
    <div>
        <h2>Game</h2>
        <Board  player={player} currentPlayer={currentPlayer} queue={queue}/>
        <Hand hand={hand.cards} />
    </div>
)

export default connect(selector)(game); 