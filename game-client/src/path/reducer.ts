import { ActionType } from "../state/actionTypes";
import { PathActionEnum } from "./actions";

export const pathReducer = (state: PathState = makeDefaultState(), action: ActionType) => {
    switch (action.type) {
        case PathActionEnum.APPEND_TO_PATH:
            var pathArr: string[];
            if (Array.isArray(action.toAppend)) {
                pathArr = [...state.pathArr, ...action.toAppend]
            } else {
                pathArr = [...state.pathArr, action.toAppend]
            }
            history.pushState(null, null, '/' + pathArr.join('/'));
            return { ...state, pathArr }
        case PathActionEnum.POP_PATH:
            var pathArr = state.pathArr.slice(0, -1);
            history.pushState(null, null, '/' + pathArr.join('/'));
            return { ...state, pathArr };
        case PathActionEnum.TO_PATH_ARRAY:
            history.pushState(null, null, '/' + action.path.join('/'));
            return { ...state, pathArr: action.path }
        case PathActionEnum.TO_PATH_STRING:
            history.pushState(null, null, action.path);
            var pathArr = action.path.split('/').filter((el) => el !== '');
            return { ...state, pathArr }
        default:
            return state;
    }
}

const makeDefaultState = (): PathState => {
    return { pathArr: location.pathname.split('/').filter((el) => el !== '') };
}