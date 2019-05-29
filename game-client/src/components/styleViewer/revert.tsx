import { h } from 'preact';
import { dispatchUpdateDeck, dispatchRevertDeck } from '../../deckBuilder/dispatch';
import { dispatchFromStyleToDeckEdit } from '../../fightingStyles/dispatch';

export default () => {
    return <div class="revert">
        <button
            class="btn"
            onClick={dispatchFromStyleToDeckEdit}
        >Return To Deck</button>
    </div>

}