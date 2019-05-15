import { h, Component } from 'preact';
import { StoreState } from '../../state/store';
import { FightingStyleDescription } from '../../fightingStyles/interface';
import { dispatchGetFightingStyles } from '../../fightingStyles/dispatch';
import { dispatchGetDeckList } from '../../deckViewer/dispatch';
import { DeckDescription } from '../../deckViewer/interface';


interface SelectorProps {
    styleDecriptions: FightingStyleDescription[]
    decks: DeckDescription[]
    isLoadingDecks: boolean,
}

interface ExternalProps {
    path: string[],
    pathPrepend: string[],
}

interface Props extends ExternalProps, SelectorProps { }


const selector = (state: StoreState): SelectorProps => {
    return {
        styleDecriptions: state.fightingStyle.styleDescriptions,
        decks: state.deckEditor.allDecks,
        isLoadingDecks: !Array.isArray(state.deckEditor.allDecks),
    }
}

class DeckEditor extends Component<Props, {}>{
    componentDidMount() {
        if (!this.props.styleDecriptions) {
            dispatchGetFightingStyles()
        }
        dispatchGetDeckList();
    }
    render({ isLoadingDecks, decks = [], path }) {
        if (isLoadingDecks) {
            return <div>Loading ...</div>
        }
        const root = path[0]; 
        if(root === 'decks'){
            return <div>deckList</div>
        }
        if(root === 'deck'){
            return <div>deckViewer</div>
        }
        if(root === 'styles'){
            return <div>stylePicker</div>
        }
    }
}