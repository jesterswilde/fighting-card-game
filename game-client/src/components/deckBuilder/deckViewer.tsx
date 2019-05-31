import { h, Component } from 'preact';
import { EditingDeck } from '../../deckBuilder/interface';
import { FightingStyleDescription } from '../../fightingStyles/interface';
import { dispatchDEToggleCard } from '../../deckBuilder/dispatchEditDeck';
import StyleList from './styleList';
import { Card } from '../../shared/card';
import Revert from './revert';
import { debounce, bind } from 'decko';
import { dispatchChangeDeckName } from '../../deckBuilder/dispatch';
import FullCard from '../cards/fullCard';
import Filter from '../filter';
import { DeckViewerFilter } from '../../filters/interface';
import { filterInvalidCards } from '../../filters/util';
/*
    Deck Name -edit-
    -----------------
    |Fighting Styles|
    | -  -  -  -  - |
    |Style List     |
    -----------------
    |Card tile view |
    |               |
    -----------------

    If style list is empty, it starts expanded with all possible styles
    Each style has a check box to enable / disable
    Each style can be dropped down to view it's description
    Each style has can be clicked on to go view that style's card list
    If you already have 3 style selected, you can not select any more until you de-select

    
    Card tile view will tell you how many cards your deck has and how many are possible
    Card tile view shows all possible cards from among the chose fight style's card pool
    Unselected cards are transparent

    Behind the scenes, we will keep all cards in your deck, even if you deselect a style. 
    So if you remove a style that had cards chosen from it. Then put it back in, those cards will still be there. 
    THese cards will be removed once you confirm updates. 

    There should be a fixed component at the bottom that will allow you to update the server. 
    This component is only visible if you have made changes. 
*/


interface ExternalProps {
    deck: EditingDeck
    styleDescriptions: FightingStyleDescription[]
    canUpdate: boolean,
    filters: DeckViewerFilter[]
}

interface Props {
    deck: EditingDeck
    cardsObj: { [key: string]: boolean }
    styleDescriptions: FightingStyleDescription[]
    canUpdate: boolean
    filters: DeckViewerFilter[]
}

interface State {
    hoverCard: Card
}

class DeckViewer extends Component<Props, State>{
    state = {
        hoverCard: null
    }
    @debounce(30)
    handleNameChange(e: Event) {
        const el = e.target as HTMLInputElement;
        dispatchChangeDeckName(el.value);
    }
    render({ deck, cardsObj, styleDescriptions, canUpdate, filters }: Props, { hoverCard }: State) {
        if (!deck) {
            return <div>
                Loading...
            </div>
        }
        const { possibleCards, name } = deck;
        return <div class='deck-builder pad-bottom'>
            <div class="deck-name section">
                <label for="deck-name">Deck Name</label>
                <input id="deck-name" value={name} onChange={this.handleNameChange} />
            </div>
            <StyleList deck={deck} allStyles={styleDescriptions} />
            <Filter />
            <div class='deck'>
                {Object.keys(possibleCards).map((style, i) => {
                    const cards = possibleCards[style];
                    return <div class="cards-section section" key={style}>
                        <h3 class="style">{style}</h3>
                        <div class="cards">
                            {filterInvalidCards(cards, filters)
                                .map((card) => this.RenderCard({ card, cardsObj }))}
                        </div>
                    </div>
                })}
            </div>
            {canUpdate && <Revert />}
        </div>
    }
    @bind
    RenderCard({ card, cardsObj }: { card: Card, cardsObj: { [key: string]: boolean } }) {
        const hasCard = card ? cardsObj[card.name] : false;
        return <div
            key={card.name}
            class={(hasCard ? '' : 'greyed')}
            onClick={() => dispatchDEToggleCard(card.name, hasCard)}
        >
            <FullCard card={card} />
        </div>
    }
}



export default (props: ExternalProps) => {
    const cards = !props.deck ? [] : props.deck.cards;
    const cardsObj = cards.reduce((obj, name) => {
        obj[name] = true;
        return obj;
    }, {});
    //@ts-ignore
    return <DeckViewer {...props} cardsObj={cardsObj} />

}
