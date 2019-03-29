import { h } from 'preact';
import { StoreState } from '../state/store';
import Game from './game';
import DeckViewer from './deckViewer';
import StyleViewer from './styleViewer'; 
import '../listeners';
import { cleanConnect } from '../util';
import Landing from './landing';
import Nav from './nav'; 
import User from './login/user'; 

interface Props {
    showGame: boolean,
    showDeckViewer: boolean,
    showStyleViewer: boolean,
    showUserViewer: boolean,
    prepend?: string[],
    remainingPath?: string[]
}

const selector = (state: StoreState): Props => {
    const path = state.path.pathArr as string[] || [];
    const [root, ...remainingPath] = path;
    console.log('root', state.path.pathArr)
    return {
        showGame: root === 'game',
        showDeckViewer: root === 'decks',
        showStyleViewer: root === 'styles',
        showUserViewer: root === 'user',
        prepend: [root],
        remainingPath
    }
}

const App = ({ showDeckViewer, showStyleViewer, showUserViewer, showGame, prepend, remainingPath }: Props) => {
    if (showGame) {
        return <Game />
    }
    return <div>
        <Nav />
        {showDeckViewer && <DeckViewer pathPrepend={prepend} path={remainingPath} />}
        {showStyleViewer && <StyleViewer pathPrepend={prepend} path={remainingPath} />}
        {showUserViewer && <User path={remainingPath} />}
        {!showDeckViewer && ! showStyleViewer && ! showUserViewer && <Landing />}
    </div>
}

export default cleanConnect(selector, App);
