import { DeckViewerFilter } from "./interface";
import { UpdateFilterAction, AddFilterAction, RemoveFilterAction, FilterEnum } from "./actions";
import { store } from "../state/store";

export const dispatchUpdateFilter = (filter: DeckViewerFilter, index: number)=>{
    const action: UpdateFilterAction = {
        type: FilterEnum.UPDATED_FILTER,
        filter,
        index
    }
    store.dispatch(action); 
}

export const dispatchAddFilter = ()=>{
    const action: AddFilterAction = {
        type: FilterEnum.ADDED_FILTER
    }
    store.dispatch(action); 
}

export const dispatchRemoveFilter = (index: number)=>{
    const action: RemoveFilterAction = {
        type: FilterEnum.REMOVED_FILTER,
        index
    }
    store.dispatch(action); 
}
