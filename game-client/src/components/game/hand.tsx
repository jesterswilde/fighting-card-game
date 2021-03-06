import { h } from 'preact';
import { Card } from '../../shared/card';
import { dispatchPickedCard } from '../../hand/dispatch'
import HandCard from '../cards/fullCard'
import Viewer from './card/viewer';
import { StoreState } from '../../state/store';
import { cleanConnect } from '../../util';

interface Props {
    hand: Card[]
    showFullCard: boolean
}

const selector = (state: StoreState): Props => {
    let hand: Card[];
    if (state.hand.showHand) {
        hand = state.hand.hands[state.game.player] || []
    }else{
        hand = [];
    }
    return {
        hand,
        showFullCard: state.gameDisplay.showFullCard
    }
}

const Hand = ({ hand, showFullCard }: Props) => {
    return <div class='card-container player'>
            {hand.map((card, i) => {
                const key = card === undefined ? 'blank' : card.name;
                return <div
                    class='inline'
                    key={key}
                    onClick={() => dispatchPickedCard(i)}
                >
                    {showFullCard && <Viewer {...card} />}
                    {showFullCard || <HandCard card={card} />}
                </div>
            })}
        </div>
}

export default cleanConnect(selector, Hand); 