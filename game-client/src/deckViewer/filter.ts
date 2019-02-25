import { Card, AxisEnum, PlayerEnum } from '../interfaces/card'
import { DeckViewerFilter } from './interface';


interface InvalidStates {
    [key: string]: boolean
}

export const filterInvalidCards = (cards: Card[], filters: DeckViewerFilter[]) => {
    const validStates = createValidStates(filters);
    return cards.filter((card) => isCardValid(card, validStates));
}

const isCardValid = (card: Card, invalidStates: InvalidStates[]) => {
    return card.requirements.every((req) => {
        return getWhoToModify(req)
            .every((player) => {
                if (card.name === "Groin Stomp") console.log(player, req, invalidStates[player][req.axis]);
                return !invalidStates[player][req.axis]
            })
    })
}

const createValidStates = (filters: DeckViewerFilter[]) => {
    const statesArr = [{}, {}] as InvalidStates[];
    filters.forEach((filter) => {
        getWhoToModify(filter)
            .forEach((player) => {
                updateFilterPiece(statesArr[player], filter);
            })
    });
    return statesArr;
}

const updateFilterPiece = (state: InvalidStates, filter: DeckViewerFilter) => {
    const func = stateRouter[filter.axis];
    if (func) {
        func(state);
    } else {
        console.log("no filter for ", filter.axis);
    }
}

const stateRouter = {
    [AxisEnum.ANTICIPATING]: (state: InvalidStates) => {
        state[AxisEnum.UNBALANCED] = true;
        state[AxisEnum.BALANCED] = true;
    },
    [AxisEnum.UNBALANCED]: (state: InvalidStates) => {
        state[AxisEnum.ANTICIPATING] = true;
        state[AxisEnum.BALANCED] = true;
    },
    [AxisEnum.BALANCED]: (state: InvalidStates) => state[AxisEnum.UNBALANCED] = true,
    [AxisEnum.GRAPPLED]: (state: InvalidStates) => {
        state[AxisEnum.CLOSE] = true;
        state[AxisEnum.FAR] = true;
        state[AxisEnum.NOT_GRAPPLED] = true;
    },
    [AxisEnum.CLOSE]: (state: InvalidStates) => {
        state[AxisEnum.GRAPPLED] = true;
        state[AxisEnum.FAR] = true;
        state[AxisEnum.NOT_CLOSE] = true;
    },
    [AxisEnum.FAR]: (state: InvalidStates) => {
        state[AxisEnum.CLOSE] = true;
        state[AxisEnum.GRAPPLED] = true;
        state[AxisEnum.NOT_FAR] = true;
    },
    [AxisEnum.NOT_FAR]: (state: InvalidStates) => state[AxisEnum.FAR] = true,
    [AxisEnum.NOT_CLOSE]: (state: InvalidStates) => state[AxisEnum.CLOSE] = true,
    [AxisEnum.NOT_GRAPPLED]: (state: InvalidStates) => state[AxisEnum.GRAPPLED] = true,
    [AxisEnum.STANDING]: (state: InvalidStates) => state[AxisEnum.PRONE] = true,
    [AxisEnum.PRONE]: (state: InvalidStates) => state[AxisEnum.STANDING] = true,
    [AxisEnum.STILL]: (state: InvalidStates) => state[AxisEnum.MOVING] = true,
    [AxisEnum.MOVING]: (state: InvalidStates) => state[AxisEnum.STILL] = true,
}

const getWhoToModify = (filter: DeckViewerFilter) => {
    switch (filter.player) {
        case PlayerEnum.PLAYER:
            return [0];
        case PlayerEnum.OPPONENT:
            return [1];
        default: return [0, 1]
    }
}