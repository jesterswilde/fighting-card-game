import {h} from 'preact';
import {ScreenEnum} from './display/interface'
import {StoreState} from './state/store'
import {connect} from 'preact-redux';
import Game from './components/game'; 
import PickDeck from './components/PickDeck';
import './listeners'; 
import { cleanConnect } from './util';

interface Props {
    screen: ScreenEnum
}

const selector = (state: StoreState): Props =>{
    return {
        screen: state.display.screen
    }
}

const App = ({screen}: Props)=>{
    switch(screen){
        case ScreenEnum.CONNECTING:
            return <div> Connecting </div>
        case ScreenEnum.LOOKING_FOR_GAME: 
            return <div> Waiting For Opponent </div>
        case ScreenEnum.CHOOSE_DECK:
            return <PickDeck />
        default: 
            return <Game />
    }
}

export default cleanConnect(selector, App);
