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
import DeckBuilder from './deckBuilder'

interface Props {
    showGame: boolean,
    showDeckViewer: boolean,
    showStyleViewer: boolean,
    showUserViewer: boolean,
    showDeckBuilder: boolean,
    prepend?: string[],
    remainingPath?: string[]
}

const selector = (state: StoreState): Props => {
    const path = state.path.pathArr as string[] || [];
    const [root, ...remainingPath] = path;
    return {
        showGame: root === 'game',
        showDeckViewer: root === 'decks',
        showDeckBuilder: root === 'builder',
        showStyleViewer: root === 'styles',
        showUserViewer: root === 'user',
        prepend: [root],
        remainingPath
    }
}

const App = ({ showDeckViewer, showStyleViewer, showUserViewer,
    showGame, prepend, remainingPath, showDeckBuilder }: Props) => {
    if (showGame) {
        return <Game />
    }
    return <div>
        <Nav />
        {showDeckViewer && <DeckViewer pathPrepend={prepend} path={remainingPath} />}
        {showStyleViewer && <StyleViewer pathPrepend={prepend} path={remainingPath} />}
        {showUserViewer && <User path={remainingPath} />}
        {showDeckBuilder && <DeckBuilder path={remainingPath} />}
        {!showDeckViewer && ! showStyleViewer && ! showUserViewer && !showDeckBuilder && <Landing />}
    </div>
}

export default cleanConnect(selector, App);