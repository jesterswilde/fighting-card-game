import { h } from 'preact';
import { Card } from '../../interfaces/card';
import { dispatchPickedCard } from '../../hand/dispatch'
import CardViewer from './card/viewer'

interface Props {
    hand: Card[]
}

export default ({ hand }: Props) => {
    return <div>
        <h2>Hand</h2>
        <div class='coard-container'>
            {hand.map((card, i) => {
                const key = card === undefined ? 'blank' : card.name;
                return <div
                    class='inline'
                    key={key}
                    onClick={() => dispatchPickedCard(i)}
                > <CardViewer card={card} /></div>
            })}
        </div>
    </div>
}