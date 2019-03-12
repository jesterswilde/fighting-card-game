import { h } from 'preact';
import { StoreState } from '../../state/store';
import { cleanConnect, nRange } from '../../util';
import { Card } from '../../shared/card';
import HandCard from './card/handCard';

interface Props {
    cards: Card[]
}

const selector = (state: StoreState): Props => {
    const opponent = state.game.player === 0 ? 1 : 0;
    const cards = state.hand.hands[opponent];
    if (cards === null || cards === undefined) {
        return { cards: [] }
    }
    return { cards }
}

const oppCards = ({ cards }: Props) => {
    return <div class="card-container opp">
        {cards.map((card, i) => {
            if (card === null) {
                return <div key={i} class="game-card"/>
            }
            return <HandCard shouldFlip={true} {...card}/>
        })}
    </div>
}

export default cleanConnect(selector, oppCards); 