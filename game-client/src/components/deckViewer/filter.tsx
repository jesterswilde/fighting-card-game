import { h } from 'preact';
import { DeckViewerFilter } from '../../deckViewer/interface';
import { StoreState } from '../../state/store';
import { dispatchUpdateDVFilter as updateFilter, dispatchAddDVFilter as addFilter, dispatchRemoveDVFilter as removeFilter } from '../../deckViewer/dispatch';
import { PlayerEnum, AxisEnum } from '../../interfaces/card';
import { cleanConnect } from '../../util';
interface Props {
    filters: DeckViewerFilter[]
}

const selector = (state: StoreState): Props => {
    return { filters: state.deckViewer.filters };
}

const Filter = ({ filters }: Props) => {
    return <div class="card-filter">
        <h3>Filters: <button class='btn btn-primary' onClick={addFilter}>+</button></h3>
        {filters.map((filter, i) => {
            return <div class="filter">
                <button class='btn btn-danger' onClick={() => removeFilter(i)}>-</button>
                <select onChange={(e)=> handlePlayerChange(e, filter, i)} value={filter.player}>
                    <option value={-1}>Any</option>
                    <option value={PlayerEnum.OPPONENT}> ↑ </option>
                    <option value={PlayerEnum.PLAYER}> ↓ </option>
                    <option value={PlayerEnum.BOTH}> ↕ </option>
                </select>
                <select onChange={(e)=> handleAxisChange(e, filter, i)} value={filter.axis}>
                    <option value={-1}> No Axis </option>
                    {Object.keys(AxisEnum).map((key) => <option value={AxisEnum[key]} key={key}> {AxisEnum[key]}</option>)}
                </select>
            </div>
        })}
    </div>
}

const handleAxisChange = (e: Event , filter: DeckViewerFilter, index: number)=>{
    const target = e.currentTarget as HTMLSelectElement; 
    updateFilter({...filter, axis: target.value as AxisEnum}, index)
}

const handlePlayerChange = (e: Event, filter: DeckViewerFilter, index: number)=>{
    const target = e.currentTarget as HTMLSelectElement; 
    const player = Number(target.value);
    updateFilter({...filter, player}, index)
}

export default cleanConnect(selector, Filter);