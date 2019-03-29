import { UserState } from "./interface";
import { ActionType } from "../state/actionTypes";
import { UserActionEnum } from "./actions";
import { saveLogin } from "../state/localStorage";

export const userReducer = (state: UserState = {}, action: ActionType): UserState => {
    let newState: UserState;
    switch (action.type) {
        case UserActionEnum.LOGIN:
            newState = { ...state, token: action.token, username: action.username };
            saveLogin(newState);
            return newState;
        case UserActionEnum.LOGOUT:
            newState = { ...state, token: undefined, username: undefined }
            saveLogin(newState);
            return newState;
        default:
            return state;
    }
}