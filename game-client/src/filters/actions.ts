import { DeckViewerFilter } from "./interface";

export enum FilterEnum{
    UPDATED_FILTER = 'updateDeckViewerFilter',
    ADDED_FILTER = 'addDeckViewerFilter',
    REMOVED_FILTER = 'removeDeckViewerFilter',
}


export interface UpdateFilterAction{
    type: FilterEnum.UPDATED_FILTER,
    filter: DeckViewerFilter,
    index: number
}

export interface AddFilterAction {
    type: FilterEnum.ADDED_FILTER,
}

export interface RemoveFilterAction{
    type: FilterEnum.REMOVED_FILTER,
    index: number
}

export type FilterActions = UpdateFilterAction | AddFilterAction | RemoveFilterAction