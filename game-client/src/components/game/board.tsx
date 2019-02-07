import { h } from 'preact';
import { getUUID } from '../../util';
import { Card } from '../../interfaces/card';
import CardComp from './card/viewer';
import QueueCard from './card/queueCard'

interface Props {
    queue: Card[][]
    player: number
    currentPlayer: number
}


export default (props: Props) => {
    const { queue = [], player, currentPlayer } = props;
    return <div class='board'>
        <h2>Board</h2>
        <div class='card-container'>
            {renderBoard(queue, player, currentPlayer)}
        </div>
    </div>

}

const renderBoard = (queue: Card[][] = [], identity: number, currentPlayer: number) => {
    return queue.map((cards = [], i) => {
        return <div key={i + JSON.stringify(cards)}>
            {cards.map((card, i) => {
                return <div class='text-center queue-card' key={card.name}>
                    <QueueCard {...card} identity={identity}/>
                </div>
            })}
        </div>
    });
}