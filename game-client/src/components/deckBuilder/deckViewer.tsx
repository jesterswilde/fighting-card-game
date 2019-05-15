import { h } from 'preact';
import { EditingDeck } from '../../deckBuilder/interfaces';
import { dispatchDEToggleCard } from '../../deckBuilder/dispatch'
import HandCard from '../game/card/handCard';
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
}

interface Props {
    deck: EditingDeck
    cardsObj: { [key: string]: boolean }
}


const checkIfHasCard = (cardName: string, cardsObj: { [key: string]: boolean }) => {
    return cardsObj[cardName];
}

const deckViewer = ({ deck, cardsObj }: Props) => {
    const { cards, possibleCards, styles, name } = deck;
    return <div>
        <input value={name} />
        <div class="styles">
            <h2>Current Styles</h2>
            <ul>
                {styles.map((style, i) => <li key={style + i}>{style}</li>)}
            </ul>
        </div>
        <div class="cards">
            {possibleCards.map((card, i) => {
                const hasCard = checkIfHasCard(card.name, cardsObj)
                return <div
                    class={'card ' + hasCard ? '' : 'greyed'}
                    onClick={() => dispatchDEToggleCard(card.name, hasCard)}
                >
                    <HandCard {...card} />
                </div>
            })}
        </div>
    </div>
}

export default (props: ExternalProps) => {
    const cardsObj = props.deck.cards.reduce((obj, name) => {
        obj[name] = true;
        return obj;
    }, {});
    return deckViewer({
        ...props,
        cardsObj
    })
}
