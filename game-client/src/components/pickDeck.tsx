import { h } from 'preact';
import { StoreState } from "../state/store";
import { connect } from "preact-redux";
import { dispatchPickedDeck } from "../deck/dispatch";

interface Props {
    decks: string[]
}

const selector = (state: StoreState): Props => {
    return { decks: state.deck.deckChoices };
}

const PickDeck = ({ decks }: Props) => {
    if(decks){
        return <div>
        <h1>Choose Deck</h1>
        {decks.map((deck, i) => (
            <button
                key={i}
                onClick={() => dispatchPickedDeck(i)}
                class='btn btn-primary'
            >
                {deck}
            </button>
        ))}
    </div>
    }
    return <div>
        <h2>Waiting For Opponent To Pick Deck</h2>
    </div>
}


export default connect(selector)(PickDeck); 