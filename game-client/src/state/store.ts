import {createStore} from 'redux'; 
import { GameState, DistanceEnum } from '../interfaces/game';
import { Card } from '../interfaces/card';

interface StoreState{
    game: GameState
    hand: Card[]
    screen: ScreenEnum
}

enum ScreenEnum {
    PREDICT,
    CHOOSE_CARD,
    OPPONENTS_TURN
}

const makeDefaultState = ():StoreState=>{
    return {
        game:{
            health: [],
            playerStates:[],
            stateDurations:[],
            block:[],
            queues:[],
            distance: DistanceEnum.FAR,
            currentPlayer: 0,
            damaged:[],
        },
        hand:[],
        screen: ScreenEnum.OPPONENTS_TURN
    }
}