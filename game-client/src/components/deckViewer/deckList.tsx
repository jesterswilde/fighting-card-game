import { h } from 'preact';
import { DeckDescription } from '../../deckViewer/interface';
import DeckItem from './deckItem'

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
            <DeckItem deck={deck} action={(chosenDeck)=> chooseDeck(chosenDeck.name)} />
        ))}
    </div>
}