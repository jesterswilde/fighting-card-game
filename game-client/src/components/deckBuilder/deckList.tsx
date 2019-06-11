import { h, Component } from 'preact';
import { DeckDescription } from '../../deckViewer/interface';
import { dispatchAppendPath } from '../../path/dispatch';
import { dispatchCreateDeck, dispatchChoseDeck, dispatchDeleteDeck, dispatchGetDecks } from '../../deckBuilder/dispatch';
import DeckItem from '../deckViewer/deckItem';

interface Props {
    decks: DeckDescription[]
}

export default class DeckList extends Component<Props> {
    componentDidMount() {
        dispatchGetDecks();
    }
    render({ decks }: Props) {
        return <div class="main deck-builder-list">
            <h2>Decks</h2>
            {decks.map((deck) => {
                return <div key={deck.id} class='deck-item'>
                    <DeckItem deck={deck} action={(chosenDeck) => {
                        {
                            dispatchChoseDeck(chosenDeck.id);
                            dispatchAppendPath(chosenDeck.id.toString())
                        }
                    }} />
                    <button
                        class='btn delete'
                        onClick={() => dispatchDeleteDeck(deck.id)}
                    >
                        Delete
                </button>
                </div>

            })}
            <button class="make-button" onClick={dispatchCreateDeck}>New Deck</button>
        </div>
    }
}
