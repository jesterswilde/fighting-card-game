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
    filters: DeckViewerFilter[],
    showingUnusedStyles: boolean
}

interface Props {
    deck: EditingDeck
    cardsObj: { [key: string]: boolean }
    styleDescriptions: FightingStyleDescription[]
    canUpdate: boolean
    filters: DeckViewerFilter[]
    showingUnusedStyles: boolean
    totalCards: number
    maxCards: number
}


class DeckViewer extends Component<Props>{
    @debounce(30)
    handleNameChange(e: Event) {
        const el = e.target as HTMLInputElement;
        dispatchChangeDeckName(el.value);
    }
    render({ totalCards, maxCards, showingUnusedStyles, deck, styleDescriptions, canUpdate }: Props) {
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
            <StyleList totalCards={totalCards} maxCards={maxCards} showingUnusedStyles={showingUnusedStyles} deck={deck} allStyles={styleDescriptions} />
            <Filter />
            <div class='deck'>
                {Object.keys(possibleCards).map((style, i) => {
                    return this.RenderStyle(style); 
                })}
            </div>
            {canUpdate && <Revert />}
        </div>
    }
    @bind
    RenderStyle(style: string) {
        const { possibleCards, cards } = this.props.deck;
        const styleCards = possibleCards[style];
        const maxCards = styleCards.length; 
        const cardsObj = styleCards.reduce((obj, card) => {
            obj[card.name] = true;
            return obj
        }, {})
        const usedCards = cards.reduce((count, name) => {
            if (cardsObj[name]) {
                return count + 1;
            } return count;
        }, 0)
        return <div class="cards-section section" key={style}>
            <div class="split-title">
                <h3 class="style">{style}</h3>
                <h4>Cards: {usedCards}/{maxCards}</h4>
            </div>
            <div class="cards">
                {filterInvalidCards(styleCards, this.props.filters)
                    .map((card) => this.RenderCard({ card, cardsObj: this.props.cardsObj }))}
            </div>
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
    let totalCards: number;
    let maxCards: number
    if (props.deck) {
        totalCards = props.deck.cards.length;
        const possibleCards = props.deck.possibleCards;
        maxCards = Object.keys(possibleCards).reduce((max, style) => possibleCards[style].length + max, 0);
    } else {
        totalCards = 0;
        maxCards = 0;
    }
    return <DeckViewer {...props} cardsObj={cardsObj} totalCards={totalCards} maxCards={maxCards} />

}
