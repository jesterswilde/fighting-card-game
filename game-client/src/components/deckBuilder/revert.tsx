import { h } from 'preact';
import { dispatchUpdateDeck, dispatchRevertDeck } from '../../deckBuilder/dispatch';

export default () => {
    return <div class="revert">
        <button
            class="btn-primary btn"
            onClick={dispatchUpdateDeck}
        >Update</button>
        <button
            class="btn"
            onClick={dispatchRevertDeck}
        >Revert</button>
    </div>

}