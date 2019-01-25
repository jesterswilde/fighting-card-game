import { h } from 'preact';
import { getUUID } from '../../util';
import { Card } from '../../interfaces/card';
import CardComp from './card/viewer';

interface Props {
    queue: Card[][]
    player: number
    currentPlayer: number
}

const NUM_PLAYERS = 2;
const MAX_QUEUE_LENGTH = 3;

export const Thing = () => {
    return <h2> Thing </h2>
}

export const Board = (props: Props) => {
    const { queue = [], player, currentPlayer } = props;
    return <div class='board'>
        <h2>Board</h2>
        <div class='card-container'>
            {renderBoard(queue, player, currentPlayer)}
        </div>
    </div>

}

const renderBoard = (queue: Card[][] = [], playerNum: number, currentPlayer: number) => {
    console.log('rednerinb oard');
    return queue.map((cards = [], i) => {
        return <div key={i + JSON.stringify(cards)}>
            {cards.map((card, i) => {
                return <div class='text-center queue-card' key={card.name}>
                    {card.name}
                </div>
            })}
        </div>
    });
}