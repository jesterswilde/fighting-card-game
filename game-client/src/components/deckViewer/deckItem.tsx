import { h } from 'preact'
import { DeckDescription } from '../../deckViewer/interface';

interface Props {
    deck: DeckDescription
    action: (deck: DeckDescription) => void
}

export default ({ deck, action }: Props) => {
    const { name, description, id } = deck;
    return <div class="mb-3 ml-2 deck-choice" onClick={() => action(deck)}>
        <h3 class="name">{name}</h3>
        <div class="ml-2">{description}</div>
    </div >
}