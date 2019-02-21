import { h } from 'preact';
import { GameState, } from '../../../game/interface';
import Poise from './poise'; 
import { PlayerEnum } from '../../../interfaces/card';
import { Standing, Motion, Health, Block } from './statesPieces';

interface Props extends GameState { 
    identity: PlayerEnum
};



export default (props: Props): JSX.Element => {
    return <div class='state-machine'>
        <div class='state-row'>
            <Standing {...props} playerIndex={props.identity} />
            <Motion {...props} playerIndex={props.identity} />
            <Health {...props} playerIndex={props.identity} />
            <Block {...props} playerIndex={props.identity} />
        </div>
        <div class='state-row'>
            <Poise {...props} playerIndex={props.identity} />
        </div>
    </div>
}
