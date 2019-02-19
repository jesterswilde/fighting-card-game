import { h } from 'preact';
import { DeckDescription } from '../../deckViewer/interface';

interface Props {
    decks: DeckDescription[],
    isLoading: boolean,
    chooseDeck: (name: string) => void
}

export default ({ decks = [], isLoading, chooseDeck }: Props) => {
    if (isLoading) {
        return <div>
            Loading Deck list...
        </div>
    }
    return <div class='container mt-3'>
        <h1 class='mb-3 mt-3'>Choose Deck</h1>
        {decks.map((deck, i) => (
            <div key={deck.name} class="mb-3 ml-2 deck-choice" onClick={() => chooseDeck(deck.name)}>
                <h3>{deck.name}</h3>
                <div class='ml-2'>{deck.description}</div>

            </div>
        ))}
    </div>
}