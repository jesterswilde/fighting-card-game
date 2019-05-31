import { h } from 'preact';
import { StoreState } from '../state/store';
import { dispatchUpdateFilter as updateFilter, dispatchAddFilter as addFilter, dispatchRemoveFilter as removeFilter } from '../filters/dispatch';
import { PlayerEnum, AxisEnum } from '../shared/card';
import { cleanConnect } from '../util';
import { DeckViewerFilter } from '../filters/interface';

interface Props {
    filters: DeckViewerFilter[]
}

const selector = (state: StoreState): Props => {
    return { filters: state.filter.filters };
}

const Filter = ({ filters }: Props) => {
    return <div class="filter-section section">
        <div class="title">
            <h3>Filters:  </h3>
            <button class="btn remove justify-end">Clear Filters</button>
        </div>
        <div class="filters">
            <button class='btn add' onClick={addFilter}>Add Filter</button>
            {filters.map((filter, i) => {
                return <div class="filter">
                    <select onChange={(e) => handlePlayerChange(e, filter, i)} value={filter.player}>
                        {/* <option value={-1}>Any</option> */}
                        <option value={PlayerEnum.OPPONENT}> ↑ </option>
                        <option value={PlayerEnum.PLAYER}> ↓ </option>
                        <option value={PlayerEnum.BOTH}> ↕ </option>
                    </select>
                    <select onChange={(e) => handleAxisChange(e, filter, i)} value={filter.axis}>
                        {/* <option value={-1}> No Axis </option> */}
                        {Object.keys(AxisEnum).map((key) => <option value={AxisEnum[key]} key={key}> {AxisEnum[key]}</option>)}
                    </select>
                    <button class='btn remove' onClick={() => removeFilter(i)}>-</button>
                </div>
            })}
        </div>
    </div>
}

const handleAxisChange = (e: Event, filter: DeckViewerFilter, index: number) => {
    const target = e.currentTarget as HTMLSelectElement;
    updateFilter({ ...filter, axis: target.value as AxisEnum }, index)
}

const handlePlayerChange = (e: Event, filter: DeckViewerFilter, index: number) => {
    const target = e.currentTarget as HTMLSelectElement;
    const player = Number(target.value);
    updateFilter({ ...filter, player }, index)
}

export default cleanConnect(selector, Filter);