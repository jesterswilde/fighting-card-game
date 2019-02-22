import { StatePieceState } from "./interface";
import { ActionType } from 'src/state/actions';
import { StatePieceEnum } from './actions';
import { omit } from 'lodash'

export const statePieceReducer = (state: StatePieceState = makeDefault(), action: ActionType): StatePieceState => {
    switch (action.type) {
        case StatePieceEnum.UPDATED:
            return { ...state, piecesById: { ...state.piecesById, [action.id]: action.piece } }
        case StatePieceEnum.DELETED:
            return { ...state, piecesById: omit(state.piecesById, action.id) }
        default:
            return state
    }
}

const makeDefault = (): StatePieceState => {
    return {
        piecesById: {}
    }
}