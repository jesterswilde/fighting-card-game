import { ActionType } from "../state/actionTypes";
import { PathActionEnum } from "./actions";

export const pathReducer = (state: PathState = makeDefaultState(), action: ActionType) => {
    switch (action.type) {
        case PathActionEnum.TO_PATH_ARRAY:
            history.pushState(null, null, action.path.join('/'));
            return { ...state, pathArr: action.path }
        case PathActionEnum.TO_PATH_STRING:
            history.pushState(null, null, action.path);
            return { ...state, pathArr: action.path.split('/') }
        default:
            return state;
    }
}

const makeDefaultState = (): PathState => {
    return { pathArr: location.pathname.split('/') };
}