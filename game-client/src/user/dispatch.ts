import { UserLoginAction, UserActionEnum, UserLogoutAction } from "./actions";
import { store } from "../state/store";
import { HOST_URL } from "../util";
import { dispatchToPathArray } from "../path/dispatch";

export const loginWithEmail = async (email: string, password: string) => {
    const fetched = await fetch(HOST_URL + '/users/login', {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
    })
    if (fetched.ok) {
        const token = await fetched.text();
        const [baseToken] = token.split('.');
        const stringified = atob(baseToken)
        console.log(stringified); 
        const { username }: { username: string } = JSON.parse(stringified);
        console.log(token, username);
        dispatchUserLogin(username, token);
    }
}

export const createUserWithEmail = async (email: string, password: string) => {
    const fetched = await fetch(HOST_URL + '/users/create', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    if (fetched.ok) {
        const token = await fetched.text(); 
        const [baseToken] = token.split('.');
        const stringified = atob(baseToken)
        const { username }: { username: string } = JSON.parse(stringified);
        console.log(token, username);
        dispatchUserLogin(username, token);
    }
}

export const dispatchUserLogin = (username: string, token: string) => {
    const action: UserLoginAction = {
        type: UserActionEnum.LOGIN,
        username,
        token
    };
    store.dispatch(action);
}

export const dispatchUserLogout = () => {
    const action: UserLogoutAction = {
        type: UserActionEnum.LOGOUT
    };
    store.dispatch(action);
}