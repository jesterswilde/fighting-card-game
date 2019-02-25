import { h } from 'preact';
import { Card } from '../../interfaces/card';
import { dispatchPickedCard } from '../../hand/dispatch'
import HandCard from './card/handCard'
import Viewer from './card/viewer'; 
import { StoreState } from '../../state/store';
import { connect } from 'preact-redux';
import { cleanConnect } from '../../util';

interface Props {
    hand: Card[]
    showFullCard: boolean
}

const selector = (state: StoreState): Props=>{
    return {
        hand: state.hand.cards,
        showFullCard: state.gameDisplay.showFullCard
    }
}

const Hand = ({ hand, showFullCard }: Props) => {
    return <div>
        <div class='card-container'>
            {hand.map((card, i) => {
                const key = card === undefined ? 'blank' : card.name;
                return <div
                    class='inline'
                    key={key}
                    onClick={() => dispatchPickedCard(i)}
                >
                    { showFullCard && <Viewer {...card} />}
                    { showFullCard || <HandCard {...card} />}
                </div>
            })}
        </div>
    </div>
}

export default cleanConnect(selector, Hand); 