import { h } from 'preact';
import { DeckDescription } from '../../deckViewer/interface';
import { dispatchAppendPath } from '../../path/dispatch';
import { dispatchCreateDeck, dispatchChoseDeck } from '../../deckBuilder/dispatch';
import DeckItem from '../deckViewer/deckItem';

interface Props {
    decks: DeckDescription[]
}

export default ({ decks }: Props) => {
    return <div class="main">
        <h2>Decks</h2>
        {decks.map((deck) => {
            return <DeckItem key={deck.id} deck={deck} action={(chosenDeck) => {
                {
                    dispatchChoseDeck(chosenDeck.id); 
                    dispatchAppendPath(chosenDeck.id.toString())
                }
            }} />
        })}
        <button class="make-button" onClick={dispatchCreateDeck}>New Deck</button>
    </div>
}