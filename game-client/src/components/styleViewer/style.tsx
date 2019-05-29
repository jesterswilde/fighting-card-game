import { h } from 'preact';
import HandCard from '../cards/fullCard';
import { FightingStyle } from '../../fightingStyles/interface';
import Revert from './revert'; 
import {dispatchPopPath as back} from '../../path/dispatch'

interface Props extends FightingStyle {
    isLoading: boolean
    isEditingDeck?: boolean
}


export default ({ isLoading, cards = [], isEditingDeck, description, identity, strengths, name }: Props) => {
    if (isLoading) {
        return <h3>
            Loading...
        </h3>
    }
    return <div class="cards-section pad-bottom">
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
                    <HandCard card={card} />
                </div>
            })}
        </div>
        {!isEditingDeck && <button onClick={back} class='btn back-btn'>Back To Decks</button>}
        {isEditingDeck && <Revert />}
    </div>
}
