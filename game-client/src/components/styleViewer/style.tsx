import { h } from 'preact';
import HandCard from '../game/card/handCard';
import { FightingStyle } from '../../fightingStyles/interface';

interface Props extends FightingStyle {
    back: () => void
    isLoading: boolean
}


export default ({ isLoading, cards = [], description, identity, strengths, name, back }: Props) => {
    if (isLoading) {
        return <h3>
            Loading...
        </h3>
    }
    return <div class="card-list">
        <h3>{name}</h3>
        <div class='description'>{description}</div>
        <div class='identity'>{identity}</div>
        <div class='strengths'>{strengths}</div>
        <div class='cards'>
            {cards.map((card, i) => {
                if (card === null) {
                    return <div> Null Card</div>
                }
                return <div key={card.name + i}>
                    <HandCard {...card} />
                </div>
            })}
        </div>
        <button onClick={back} class='btn btn-primary mt-3 mb-3'>Back To Decks</button>
    </div>
}
