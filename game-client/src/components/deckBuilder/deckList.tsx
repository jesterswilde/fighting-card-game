import { h } from 'preact'; 
import { DeckDescription } from '../../deckViewer/interface';

interface Props{
    decks: DeckDescription[]
}

export default ({decks}: Props)=>{
    return decks.map(({name, description, })=>{
        <div class="deck-list">
            <div class="name">{name}</div>
            <div class="description">{description}</div>
        </div>
    })
}