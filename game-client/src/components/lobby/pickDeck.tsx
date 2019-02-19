import { h, PreactDOMAttributes } from 'preact';
import { StoreState } from "../../state/store";
import { dispatchPickedDeck } from "../../lobby/dispatch";
import { DeckChoice } from '../../lobby/interfaces';
import { cleanConnect } from '../../util';

interface Props {
    decks: DeckChoice[]
}

const selector = (state: StoreState): Props => {
    console.log(state);
    return { decks: state.lobby.deckChoices };
}

const PickDeck = ({ decks }: Props) => {
    if (decks) {
        return <div class='container mt-3'>
            <h1 class='mb-3 mt-3'>Choose Deck</h1>
            {decks.map((deck, i) => (
                <div class="mb-3 ml-2 deck-choice" onClick={() => dispatchPickedDeck(i)}>
                    <h3>{deck.name}</h3>
                    <div class='ml-2'>{deck.description}</div>

                </div>
            ))}
        </div>
    }
    return <div>
        <h2>Waiting For Opponent To Pick Deck</h2>
    </div>
}


export default cleanConnect(selector, PickDeck); 