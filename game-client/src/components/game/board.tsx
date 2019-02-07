import { h } from 'preact';
import { Card } from '../../interfaces/card';
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
            {renderBoard(queue, player)}
        </div>
    </div>

}

const renderBoard = (queue: Card[][] = [], identity: number) => {
    return queue.map((cards = [], i) => {
        const opponent = cards[0] && cards[0].player !== identity;
        return <div key={i + JSON.stringify(cards)} class={!opponent? 'played-by-me' : ''}>
            {cards.map((card, i) => {
                return <div class={`text-center queue-card ${opponent? 'opponent' : ''}`} key={card.name}>
                    <QueueCard {...card} identity={identity}/>
                </div>
            })}
        </div>
    });
}