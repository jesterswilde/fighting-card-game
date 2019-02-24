import * as React from 'react';
import { PlayerEnum, AxisEnum } from '../../interfaces/enums';
import { StatePieceJSON } from '../../interfaces/cardJSON';
import { diaptchUpdateStatePieceJSON as update } from '../../statePiece/dispatch';

interface Props {
    requirement: StatePieceJSON
}


export default ({ requirement }: Props) => {
    return <form className="form-inline inline">
        <select className="form-control" id="affects" onChange={(e) => update({ ...requirement, player: Number(e.target.value) })} value={requirement.player}>
            <option value={PlayerEnum.OPPONENT}> ↑ </option>
            <option value={PlayerEnum.PLAYER}> ↓ </option>
            <option value={PlayerEnum.BOTH}> ↕ </option>
        </select>
        <select
            className="form-control"
            id="axis"
            onChange={(e) => update({ ...requirement, axis: e.target.value as AxisEnum } )}
            value={requirement.axis}
        >
                {Object.keys(AxisEnum).map((key) => <option value={AxisEnum[key]} key={key}> {AxisEnum[key]}</option>)}
        </select>
    </form >
}
