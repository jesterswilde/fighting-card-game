import { h } from 'preact';
import { Card } from '../../shared/card';
import QueueCard from './card/queueCard'
import { dispatchSwitchCardDisplayMode } from '../../game/dispatch';
import FullQueueCard from './card/fullQueueCard';
import { dispatchDisplayEventHistory } from '../../events/dispatch';

interface Props {
    queue: Card[][][]
    player: number
    currentPlayer: number
}


export default (props: Props) => {
    const { queue = [], player } = props;
    return <div class='board'>
        <div class='card-container'>
            {renderBoard(queue, player)}
        </div>
    </div>

}
const cardNames = (cards: Card[] = []) => {
    return cards.reduce((total, current) => total + "-" + current.id, '')
}
const cardPlayerKey = (cardsByPlayer: Card[][] = []) => {
    return cardsByPlayer.reduce((total, cards) => total + cardNames(cards), '')
}
const renderBoard = (queue: Card[][][] = [], identity: number) => {
    return queue.map((cardByPlayer = [], i) => {
        const key = cardPlayerKey(cardByPlayer);
        return <div key={key}>
            <div class='history-btn'>
                <button onClick={() => dispatchDisplayEventHistory(i)}>H</button>
            </div>
            {cardByPlayer.map((cards, j) => {
                return cards.map((card, k) => {
                    const opponent = card.player !== identity ? 'opponent' : '';
                    const shouldAnimate = ((card.telegraphs && card.telegraphs.length > 0) || (card.focuses && card.focuses.length > 0)) ? 'has-effects' : '';
                    return <div key={card.id}>
                        <div
                            class={`text-center queue-card ${opponent} ${shouldAnimate}`}
                            onClick={() => dispatchSwitchCardDisplayMode(i, j, k)}
                        >
                            <div class={card.showFullCard ? '' : 'collapsed'}>
                                <FullQueueCard {...card} identity={identity} />
                            </div>
                            <div class={(card.showFullCard ? 'collapsed' : '') + ' ongoing'}>
                                <QueueCard {...card} identity={identity} />
                            </div>
                        </div>
                    </div>
                })
            })}
        </div>
    });
}