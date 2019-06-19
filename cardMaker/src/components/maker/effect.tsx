import * as React from 'react';
import { MechanicJSON } from '../../interfaces/cardJSON';
import { MechanicEnum, PlayerEnum, AxisEnum, getMechDisplay } from '../../shared/card';
import { mechFromJSON, mechCreateEff, mechCreateReq, mechAddToChoice } from '../../mechanic/json';
import { dispatchDeletedMech, dispatchMechCreatedChoiceCategory, dispatchMechDeletedChoice } from '../../mechanic/dispatch';
import Requirement from './requirement';
import { dispatchDeleteStatePiece } from '../../statePiece/dispatch';
import { toMechEnum } from '../../utils';

interface Props {
    effect: MechanicJSON
}

const Effect = ({ effect: mech }: Props) => {
    const { mechanic, amount, id, mechanicRequirements: reqs = [], mechanicEffects: effs = [], choices = [], player, axis } = mech;
    const { axis: displayAxis, player: displayPlayer, value: displayValue, valueString: displayValueString, req: displayReq, eff: displayEff, pick: displayPick, state: displayState } = getMechDisplay(mechanic);
    console.log(mechanic, getMechDisplay(mechanic))
    return <div className="inline form-inline">
        <select className="form-control" id="mechanics" onChange={({ target }) => {
            const mechanic = toMechEnum(target.value);
            mechFromJSON({ ...mech, mechanic })
        }} value={mechanic}>
            <option value={undefined}> No Mechanic </option>
            {Object.keys(MechanicEnum).map((key) => <option value={MechanicEnum[key]} key={key}> {MechanicEnum[key]} </option>)}
        </select>
        {(displayState || displayPlayer) && <>
            <select className="form-control" id="affects" onChange={({ target }) => mechFromJSON({ ...mech, player: Number(target.value) })} value={player}>
                <option value={undefined}> No Player </option>
                <option value={PlayerEnum.OPPONENT}> ↑ </option>
                <option value={PlayerEnum.PLAYER}> ↓ </option>
                <option value={PlayerEnum.BOTH}> ↕ </option>
            </select>
        </>}
        {(displayState || displayAxis) && <>
            <select className="form-control" id="axis" onChange={({ target }) => mechFromJSON({ ...mech, axis: target.value as AxisEnum })} value={axis}>
                <option value={undefined}> No Axis </option>
                {Object.keys(AxisEnum).map((key) => <option value={AxisEnum[key]} key={key}> {AxisEnum[key]}</option>)}
            </select>
        </>}
        {displayValue && <>
            <input type="number" value={amount} onChange={({ target }) => mechFromJSON({ ...mech, amount: target.value })} />
        </>}
        {displayValueString && <>
            <input type="text" value={amount} onChange={({ target }) => mechFromJSON({ ...mech, amount: target.value })} />
        </>}
        {displayReq && <>
            <div>
                <div>
                    <div className="inline">
                        <h4>
                            Requirements:
                        <button className="btn btn-sm btn-primary ml-2" onClick={() => mechCreateReq(id)}> + </button>
                        </h4>
                    </div>
                    <div>
                        {reqs.map((req) => <div key={req.id}>
                            <div className="inline"><button className="btn btn-danger btn-sm" onClick={() => dispatchDeleteStatePiece(req.id)}> - </button></div>
                            <Requirement requirement={req} />
                        </div>)}
                    </div>
                </div>
            </div>
        </>}
        {displayEff && <>
            <div>
                <div>
                    <div className="inline">
                        <h4>
                            Effects:
                            <button className="btn btn-sm btn-primary" onClick={() => mechCreateEff(id)}> + </button>
                        </h4>
                    </div>
                    <div>
                        {effs.map((eff) => <div key={eff.id}>
                            <button className="btn btn-danger btn-sm" onClick={() => dispatchDeletedMech(eff.id)}> - </button>
                            <Effect effect={eff} />
                        </div>)}
                    </div>
                </div>
            </div>
        </>}
        {displayPick && <>
            <div className="ml-5">
                <div>
                    Choices:
                <button className="btn btn-sm btn-primary" onClick={() => dispatchMechCreatedChoiceCategory(id)}> + </button>
                    <div>
                        {choices.map((choice, index) => <div key={choice.reduce((total, { id }) => id + total, '') || index}>
                            <button className="btn btn-danger btn-sm" onClick={(e) => dispatchMechDeletedChoice(id, index)}> - </button>
                            <button className="btn btn-primary btn-sm" onClick={(e) => mechAddToChoice(id, index)}> + </button>
                            {choice.map((mech) => <div className='ml-5' key={mech.id}>
                                <button className="btn btn-danger btn-sm" onClick={(e) => dispatchDeletedMech(mech.id)}> - </button>
                                <Effect effect={mech} />
                            </div>)}
                        </div>)}
                    </div>
                </div>
            </div>
        </>}
    </div>
}

export default Effect;
