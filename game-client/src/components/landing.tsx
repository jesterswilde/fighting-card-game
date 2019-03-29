import { h } from 'preact';
import { dispatchToPathString as to } from '../path/dispatch';

export default () => {
    return <div class='landing'>
        <h2>Fighting Card Game <small>Without a name</small></h2>
        <div>
            <a class='link' onClick={() => to('/game')}>Play Game</a>
        </div>
        <div>
            <a class='link' onClick={() => to('/decks')}>View Decks</a>
        </div>
        <div>
            <a class='link' onClick={() => to('/styles')}>View Styles</a>
        </div>
        <div>
            <a class="link" onClick={() => to('/user/login')}>Login</a>
        </div>
        <div>
            <a class="link" onClick={()=> to('/user/create')}>Create Account</a>
        </div>


    </div>

}