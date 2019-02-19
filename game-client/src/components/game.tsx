import { h, Component } from 'preact';
import Game from './game/gameScreen';
import PickDeck from './lobby/pickDeck';
import Connecting from './lobby/loading';
import Searching from './lobby/searching';
import { ScreenEnum } from '../display/interface';
import { StoreState } from '../state/store';
import { dispatchConnectSocket, dispatchDisconnectSocket } from '../socket/dispatch'
import { connect } from 'preact-redux';

interface Props {
    screen: ScreenEnum
}

const selector = (state: StoreState): Props => {
    return {
        screen: state.display.screen
    }
}

class GameViewer extends Component<Props, {}>{
    constructor(props: Props) {
        super(props);
    }
    componentDidMount() {
        dispatchConnectSocket();
    }
    componentWillUnmount() {
        dispatchDisconnectSocket();
    }
    render() {
        const { screen } = this.props;
        switch (screen) {
            case ScreenEnum.CONNECTING:
                return <Connecting />
            case ScreenEnum.LOOKING_FOR_GAME:
                return <Searching />
            case ScreenEnum.CHOOSE_DECK:
                return <PickDeck />
            default:
                return <Game />
        }
    }
}


export default connect(selector)(GameViewer) as unknown as () => JSX.Element; 
