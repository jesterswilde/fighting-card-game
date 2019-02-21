import { h } from 'preact';
import { Deck } from '../../deckViewer/interface';
import HandCard from '../game/card/handCard';
import Filter from './filter';
import { Card } from '../../interfaces/card';
import { DeckViewerFilter } from '../../deckViewer/interface'

interface Props extends Deck {
    back: () => void
    isLoading: boolean
    filters: DeckViewerFilter[]
}

export default ({ isLoading, cards = [], description, name, back, filters }: Props) => {
    if (isLoading) {
        return <h3>
            Loading...
        </h3>
    }
    return <div class="card-list">
        <h3>{name}</h3>
        <div class='description'>{description}</div>
        <Filter />
        <div class='cards'>
            {cards
            .filter((card)=>cardFilters(card, filters))
            .map((card, i) => {
                return <div key={card.name + i}>
                    <HandCard {...card} />
                </div>
            })}
        </div>
        <button onClick={back} class='btn btn-primary mt-3 mb-3'>Back To Decks</button>
    </div>
}

const cardFilters = (card: Card, filters: DeckViewerFilter[]) => {
    return filters.every(({ axis, player }) => {
        if (axis !== -1) {
            const hasAxis = card.requirements.find((req) => req.axis === axis)
            if (hasAxis === undefined) return false;
            if (player !== -1){
                return hasAxis.player === player; 
            }
        }
        return true;
    })
}