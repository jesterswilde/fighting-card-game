import { h } from 'preact';
import { dispatchToPathArray as to } from '../path/dispatch';
import { StoreState } from '../state/store';
import { cleanConnect } from '../util';
import { dispatchUserLogout } from '../user/dispatch';

interface Props {
    isLoggedIn: boolean
    username
}

const selector = ({ user }: StoreState): Props => {
    return {
        isLoggedIn: !!user.username,
        username: user.username
    }
}

const nav = ({ isLoggedIn, username }) => {
    return <nav class='navbar'>
        <div class='home'>
            <a onClick={() => to([''])}>
                Home
            </a>
        </div>
        {!isLoggedIn &&
            <div class="right-side">
                <a class="mr-4" onClick={() => to(['user', 'login'])}> Login </a>
                <a onClick={() => to(['user', 'create'])}> Create Account </a>
            </div>}
        {isLoggedIn &&
            <div class="right-side">
                <div class="mr-4">{username}</div>
                <a onClick={dispatchUserLogout}>Logout</a> 
            </div>}
    </nav>
}

export default cleanConnect(selector, nav); 