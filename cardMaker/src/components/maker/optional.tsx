import * as React from 'react';
import { RequirementEffectJSON } from '../../interfaces/cardJSON';
import Requirement from './requirement'; 
import Effect from './effect'; 
import { dispatchDeleteStatePiece as deleteReq } from '../../statePiece/dispatch';
import { dispatchDeletedMech as deleteMech } from '../../mechanic/dispatch';
import { optCreateReq, optCreateEff } from '../../optional/json';

interface Props {
    optional: RequirementEffectJSON
}

export default ({ optional }: Props) => {
    const { requirements, effects } = optional;
    return <div>
        <h3>Requirements: <button className="btn btn-primary btn-sm" onClick={()=>optCreateReq(optional.id)}>+</button></h3>
        {requirements.map((req) => <div key={req.id}>
            <button className="btn btn-danger btn-sm" onClick={() => deleteReq(req.id)}>-</button>
            <Requirement requirement={req}/>
        </div>)}
        <h3>Effects: <button className="btn btn-primary btn-sm" onClick={()=>optCreateEff(optional.id)}>+</button></h3>
        {effects.map((eff) => <div key={eff.id}>
            <button className="btn btn-danger btn-sm" onClick={() => deleteMech(eff.id)}>-</button>
            <Effect effect={eff} />
        </div>)}
    </div>
}