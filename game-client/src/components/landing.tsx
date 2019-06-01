import { h } from 'preact';
import { dispatchToPathString as to } from '../path/dispatch';

export default () => {
    return <div class='landing'>
        <h2>Fighting Card Game <small>Without a name</small></h2>
        <div class='section'>
            <div>
                <a class='link' onClick={() => to('/game')}>Play Game</a>
            </div>
            <div>
                <a class='link' onClick={() => to('/decks')}>Starter Decks</a>
            </div>
            <div>
                <a class='link' onClick={() => to('/styles')}>Fighting Styles</a>
            </div>
            <div>
                <a class="link" onClick={() => to('/builder')}>Deck Builder</a>
            </div>
        </div>
    </div>
}