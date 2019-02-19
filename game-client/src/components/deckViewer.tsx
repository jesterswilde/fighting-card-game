import {h, Component} from 'preact'; 
import { DeckDescription, Deck } from '../deckViewer/interface';
import { StoreState } from '../state/store';
import {dispatchGetDeckList, dispatchGetDeckWithName} from '../deckViewer/dispatch'
import Cards from './deckViewer/cards'
import { dispatchToPathArray } from '../path/dispatch';
import { connect } from 'preact-redux';
import DeckList from './deckViewer/deckList';

interface SelectorProps{
    deckList: DeckDescription[],
    deck: Deck,
    isLoadingDeckList: boolean,
    isLoadingDeck: boolean
}

interface ExternalProps{
    path: string[],
    pathPrepend: string[],
}

interface Props extends SelectorProps, ExternalProps{
}

const selector = (state: StoreState): SelectorProps=>{
    return {
        isLoadingDeck: state.deckViewer.isLoadingDeck,
        isLoadingDeckList: state.deckViewer.isLoadingDeckList,
        deckList: state.deckViewer.deckList,
        deck: state.deckViewer.deck
    }
}

class DeckViewer extends Component<Props>{
    componentDidMount = ()=>{
        dispatchGetDeckList(); 
        if(this.props.path.length > 0){
            const deckName = this.props.path[1];
            if(deckName){
                dispatchGetDeckWithName(deckName); 
            }
        }

    }
    render = ()=>{ 
        const {path, pathPrepend, deck, deckList, isLoadingDeck, isLoadingDeckList} = this.props
        const viewingDeck = path.length > 0; 
        if(viewingDeck){
            return <Cards isLoading={isLoadingDeck} {...deck} back={()=>dispatchToPathArray(pathPrepend)} />
        }else{
            return <DeckList decks={deckList} isLoading={isLoadingDeckList} chooseDeck={this.chooseDeck}  />
        }
    }
    chooseDeck = (name: string)=>{
        dispatchToPathArray([...this.props.pathPrepend, 'deck', name]);
        dispatchGetDeckWithName(name); 
    }
}

export default connect(selector)(DeckViewer) as unknown as (props: ExternalProps)=> JSX.Element