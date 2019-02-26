import { h } from 'preact';
import { Deck } from '../../deckViewer/interface';
import HandCard from '../game/card/handCard';
import Filter from './filter';
import { DeckViewerFilter } from '../../deckViewer/interface'
import { filterInvalidCards } from '../../deckViewer/filter';

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
            {filterInvalidCards(cards, filters)
                .map((card, i) => {
                    return <div key={card.name + i}>
                        <HandCard {...card} />
                    </div>
                })}
        </div>
        <button onClick={back} class='btn btn-primary mt-3 mb-3'>Back To Decks</button>
    </div>
}
