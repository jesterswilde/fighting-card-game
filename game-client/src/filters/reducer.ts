import { ActionType } from "../state/actionTypes";
import { FilterEnum, UpdateFilterAction, AddFilterAction, RemoveFilterAction } from "./actions";
import { FilterState, DeckViewerFilter } from "./interface";
import { AxisEnum, PlayerEnum } from "../shared/card";

export const filterReducer = (state: FilterState = { filters: [] }, action: ActionType): FilterState => {
    switch (action.type) {
        case FilterEnum.UPDATED_FILTER:
            return updateFilter(state, action);
        case FilterEnum.ADDED_FILTER:
            return addFilter(state, action);
        case FilterEnum.REMOVED_FILTER:
            return removeFilter(state, action);
    }
    return state; 
}

const updateFilter = (state: FilterState, action: UpdateFilterAction): FilterState => {
    const filters = [...state.filters];
    filters[action.index] = action.filter;
    return { ...state, filters };
}
const addFilter = (state: FilterState, action: AddFilterAction): FilterState => {
    const filters: DeckViewerFilter[] = [...state.filters, { axis: AxisEnum.CLOSE, player: PlayerEnum.BOTH }];
    return { ...state, filters };
}
const removeFilter = (state: FilterState, action: RemoveFilterAction): FilterState => {
    const filters = state.filters.filter((_, i) => i !== action.index);
    return { ...state, filters };
}