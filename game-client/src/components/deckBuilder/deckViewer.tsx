import { h, Component } from 'preact';
import { EditingDeck } from '../../deckBuilder/interface';
import HandCard from '../game/card/handCard';
import { FightingStyleDescription } from '../../fightingStyles/interface';
import { dispatchDEToggleCard } from '../../deckBuilder/dispatchEditDeck';
import StyleList from './styleList';
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
    allStyles: FightingStyleDescription[]
}

interface Props {
    deck: EditingDeck
    cardsObj: { [key: string]: boolean }
    allStyles: FightingStyleDescription[]
}


const checkIfHasCard = (cardName: string, cardsObj: { [key: string]: boolean }) => {
    return cardsObj[cardName];
}

class DeckViewer extends Component<Props, {}>{
    render({ deck, cardsObj, allStyles }: Props) {
        if (!deck) {
            return <div>
                Loading...
            </div>
        }
        const { cards, possibleCards, styles, name } = deck;
        return <div class='deck-builder'>
            <input value={name} />
            <StyleList deck={deck} styles={allStyles} />
            <div class='deck'>
                {Object.keys(possibleCards).map((style, i) => {
                    const cards = possibleCards[style];
                    return <div class="card-list style-section" key={style}>
                        <h3>{style}</h3>
                        <div class="cards">
                            {cards.map((card) => {
                                const hasCard = checkIfHasCard(card.name, cardsObj)
                                return <div
                                    key={card.name}
                                    class={'card ' + hasCard ? '' : 'greyed'}
                                    onClick={() => dispatchDEToggleCard(card.name, hasCard)}
                                >
                                    <HandCard {...card} />
                                </div>
                            })}
                        </div>
                    </div>
                })}
            </div>
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
