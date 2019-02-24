import * as React from 'react';
import { MechanicJSON } from '../../interfaces/cardJSON';
import { MechanicEnum, PlayerEnum, AxisEnum, getMechDisplay } from '../../interfaces/enums';
import { mechFromJSON, mechAddEff, mechAddReq } from '../../mechanic/json';
import { dispatchDeletedMech } from '../../mechanic/dispatch';
import { Mechanic } from '../../mechanic/interface';
import Requirement from './requirement';
import { dispatchDeleteStatePiece } from '../../statePiece/dispatch';

interface Props {
    effect: MechanicJSON
}

const Effect = ({ effect: mech }: Props) => {
    const { mechanic, amount, id, mechanicRequirements: reqs = [], mechanicEffects: effs = [], choices = [], player, axis } = mech;
    const { value: displayValue, valueString: displayValueString, req: displayReq, eff: displayEff, pick: displayPick, state: displayState } = getMechDisplay(mechanic);
    console.log('mechanic', mechanic)
    return <div className="inline form-inline">
        <select className="form-control" id="mechanics" onChange={({ target }) => mechFromJSON({ ...mech, mechanic: target.value as MechanicEnum })} value={mechanic}>
            <option value={undefined}> No Mechanic </option>
            {Object.keys(MechanicEnum).map((key) => <option value={MechanicEnum[key]} key={key}> {MechanicEnum[key]} </option>)}
        </select>
        {displayState && <>
            <select className="form-control" id="affects" onChange={({ target }) => mechFromJSON({ ...mech, player: Number(target.value) })} value={player}>
                <option value={undefined}> No Player </option>
                <option value={PlayerEnum.OPPONENT}> ↑ </option>
                <option value={PlayerEnum.PLAYER}> ↓ </option>
                <option value={PlayerEnum.BOTH}> ↕ </option>
            </select>
            <select className="form-control" id="axis" onChange={({ target }) => mechFromJSON({ ...mech, axis: target.value as AxisEnum })} value={axis}>
                <option value={undefined}> No Axis </option>
                {Object.keys(AxisEnum).map((key) => <option value={AxisEnum[key]} key={key}> {AxisEnum[key]}</option>)}
            </select>
        </>}
        {displayValue && <>
            <input type="number" value={amount} onChange={() => mechFromJSON({ ...mech, amount })} />
        </>}
        {displayValueString && <>
            <input type="text" value={amount} onChange={() => mechFromJSON({ ...mech, amount })} />
        </>}
        {displayReq && <>
            <div>
                <div>
                    <div className="inline">
                        <h4>
                            Requirements:
                        <button className="btn btn-sm btn-primary ml-2" onClick={() => mechAddReq(id)}> + </button>
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
                            <button className="btn btn-sm btn-primary" onClick={() => mechAddEff(id)}> + </button>
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
        {/* {displayPick && <>
            <div className="ml-5">
                <div>
                    Choices:
                <button className="btn btn-sm btn-primary" onClick={() => mechAddChoice(id)}> + </button>
                    <div>
                        {choices.map((choice) => <div key={choice.reduce((total, { id }) => id + total, '')}>
                            <button className="btn btn-danger btn-sm" onClick={(e) => this.removeChoice(e, choiceIndex)}> - </button>
                            <button className="btn btn-primary btn-sm" onClick={(e) => this.addChoiceMech(e, choiceIndex)}> + </button>
                            {choice.map((mech, mechIndex) => <div className='ml-5' key={getUUID(mech)}>
                                <button className="btn btn-danger btn-sm" onClick={(e) => this.removeChoiceMech(e, choiceIndex, mechIndex)}> - </button>
                                <Effect effect={mech} update={(state: Mechanic, mechindex: number) => this.updateChoice(state, choiceIndex, mechindex)} index={mechIndex} />
                            </div>)}
                        </div>)}
                    </div>
                </div>
            </div>
        </>} */}
    </div>
}

export default Effect;
