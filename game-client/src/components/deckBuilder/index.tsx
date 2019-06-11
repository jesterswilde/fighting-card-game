import { h, Component } from 'preact';
import { StoreState } from '../../state/store';
import { FightingStyleDescription } from '../../fightingStyles/interface';
import { getFightingStyles } from '../../fightingStyles/dispatch';import { DeckDescription } from '../../deckViewer/interface';
import DeckList from './deckList';
import DeckViewer from './deckViewer';
import { EditingDeck } from '../../deckBuilder/interface';
import { connect } from 'preact-redux';
import { dispatchToPathString } from '../../path/dispatch';
import { dispatchChoseDeck } from '../../deckBuilder/dispatch';
import { DeckViewerFilter } from '../../filters/interface';

interface SelectorProps {
    styleDecriptions: FightingStyleDescription[]
    decks: DeckDescription[]
    isLoadingDecks: boolean,
    deck: EditingDeck,
    isLoggedIn: boolean,
    canUpdate: boolean,
    filters: DeckViewerFilter[],
    showingUnusedStyles: boolean,
}

interface ExternalProps {
    path: string[],
}

interface Props extends ExternalProps, SelectorProps { }


const selector = (state: StoreState): SelectorProps => {
    return {
        isLoggedIn: Boolean(state.user.token),
        styleDecriptions: state.fightingStyle.styleDescriptions,
        decks: state.deckEditor.allDecks,
        isLoadingDecks: !Array.isArray(state.deckEditor.allDecks),
        deck: state.deckEditor.deck,
        canUpdate: state.deckEditor.canUpdate,
        filters: state.filter.filters,
        showingUnusedStyles: state.deckEditor.showingUnusedStyles
    }
}

class DeckEditor extends Component<Props, {}>{
    componentDidMount() {
        const [deckID] = this.props.path; 
        const shouldLoadDeck = !this.props.deck || this.props.deck.id.toString() !== deckID; 
        if(deckID && shouldLoadDeck){
            dispatchChoseDeck(Number(deckID));
        } 
        getFightingStyles()
    }
    render({ filters, isLoadingDecks, showingUnusedStyles, decks = [], path, styleDecriptions, deck, isLoggedIn, canUpdate }) {
        const [root, ...remainingPath] = path;
        if (!isLoggedIn) {
            <MustLogIn />
        }
        if (isLoadingDecks) {
            return <div>Loading ...</div>
        }
        if (root) {
            return <DeckViewer showingUnusedStyles={showingUnusedStyles} filters={filters} canUpdate={canUpdate} styleDescriptions={styleDecriptions} deck={deck} />
        }
        return <DeckList decks={decks} />
    }
}

const MustLogIn = () => {
    return <div class="main">
        In order to make decks you must be logged in. Create an account or log in. 
        <div>
            <a class="link" onClick={()=>dispatchToPathString('/user/login')}>Login</a>
        </div>
        <div>
            <a class="link" onClick={()=> dispatchToPathString('/user/create')}>Create Account</a>
        </div>
    </div>
}

export default connect(selector)(DeckEditor)