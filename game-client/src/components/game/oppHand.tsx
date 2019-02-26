import { h } from 'preact';
import { StoreState } from '../../state/store';
import { cleanConnect, nRange } from '../../util';

interface Props {
    cards: number[]
}

const selector = (state: StoreState): Props => {
    const num = state.hand.opponentCards;
    if (num === null) {
        return { cards: [] }
    }
    const cards = nRange(num); 
    return { cards }
}

const oppCards = ({ cards }: Props) => {
    return <div class="card-container">
        {cards.map((card)=><div key={card} class="game-card opp">
            </div>)}
    </div>
}

export default cleanConnect(selector, oppCards); 