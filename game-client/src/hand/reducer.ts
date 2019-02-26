import { HandState } from "./interface";
import { ActionType } from "../state/actionTypes";
import { HandActionEnum, PickedCardAction } from "./actions";
import { socket } from "../socket/socket";
import { SocketEnum } from "../shared/socket";

export const handReducer = (state: HandState = makeDefaultState(), action: ActionType): HandState => {
    switch (action.type) {
        case HandActionEnum.GOT_CARDS:
            return { ...state, cards: action.cards }
        case HandActionEnum.PICKED_CARD:
            return pickedCardReducer(state, action);
        case HandActionEnum.OPPONENT_GOT_CARDS:
            return { ...state, opponentCards: action.cards };
        case HandActionEnum.OPPONENT_PICKED_CARD:
            return { ...state, opponentCards: null }
        default:
            return state
    }
}

const pickedCardReducer = (state: HandState, { index }: PickedCardAction): HandState => {
    socket.send(SocketEnum.PICKED_CARD, index);
    return {
        ...state,
        cards: []
    }
}

const makeDefaultState = (): HandState => {
    return {
        cards: [],
        opponentCards: null
    }
}