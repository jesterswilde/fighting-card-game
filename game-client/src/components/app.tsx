import { h } from 'preact';
import { StoreState } from '../state/store'
import Game from './game';
import DeckViewer from './deckViewer'
import '../listeners';
import { cleanConnect } from '../util';
import Landing from './landing';
import Nav from './nav'; 

interface Props {
    showGame: boolean,
    showDeckViewer: boolean,
    prepend?: string[],
    remainingPath?: string[]
}

const selector = (state: StoreState): Props => {
    const path = state.path.pathArr as string[] || [];
    const [blank, root, ...remainingPath] = path;
    return {
        showGame: path[1] === 'game',
        showDeckViewer: path[1] === 'decks',
        prepend: [blank, root],
        remainingPath
    }
}

const App = ({ showDeckViewer, showGame, prepend, remainingPath }: Props) => {
    if (showGame) {
        return <Game />
    }
    return <div>
        <Nav />
        {showDeckViewer && <DeckViewer pathPrepend={prepend} path={remainingPath} />}
        {!showDeckViewer && <Landing />}
    </div>
}

export default cleanConnect(selector, App);
