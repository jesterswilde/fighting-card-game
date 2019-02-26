import { h } from 'preact';
import { Card } from '../../shared/card';
import QueueCard from './card/queueCard'
import { dispatchSwitchCardDisplayMode } from '../../game/dispatch';
import FullQueueCard from './card/fullQueueCard';
import { dispatchDisplayEventHistory } from '../../events/dispatch';

interface Props {
    queue: Card[][]
    player: number
    currentPlayer: number
}


export default (props: Props) => {
    const { queue = [], player, currentPlayer } = props;
    return <div class='board'>
        <div class='card-container'>
            {renderBoard(queue, player)}
        </div>
    </div>

}
const cardNames = (cards: Card[]) => {
    return cards.reduce((total, current) => total + "-" + current.name, '')
}
const renderBoard = (queue: Card[][] = [], identity: number) => {
    return queue.map((cards = [], i) => {
        const myQueueSlot = cards[0] && cards[0].player !== identity;
        const key = cardNames(cards);
        return <div key={key} class={!myQueueSlot ? 'played-by-me' : ''}>
        <div class='history-btn'>
            <button onClick={()=>dispatchDisplayEventHistory(i)}>H</button>
        </div>
            {cards.map((card, j) => {
                const opponent = card.player !== identity; 
                return <div key={card.name}>
                    <div
                        class={`text-center queue-card ${opponent ? 'opponent' : ''}`}
                        onClick={() => dispatchSwitchCardDisplayMode(i, j)}
                    >
                        <div class={card.showFullCard? '' : 'collapsed'}>
                            <FullQueueCard {...card} identity={identity} />
                        </div>
                        <div class={card.showFullCard? 'collapsed' : ''}>
                            <QueueCard {...card} identity={identity} />
                        </div>
                    </div>

                </div>
            })}
        </div>
    });
}