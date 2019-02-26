import * as React from 'react';
import { MechanicJSON } from '../../interfaces/cardJSON';
import { getMechDisplay } from '../../shared/card';
import Requirement from './requirement';
import { playerRouter as pr } from '../../utils';


interface Props {
    effect: MechanicJSON
}

const Effect = ({ effect }: Props) => {
    const { choices = [],  mechanic, mechanicRequirements: reqs = [], mechanicEffects: effs = [], amount } = effect;
    const { eff: displayEff, req: displayReq, valueString, pick: displayPick, state: displayState, value } = getMechDisplay(effect.mechanic);
    const player = effect.player !== undefined ? pr[effect.player] : null;
    return <div className='inline m-2'>
        {(displayState || valueString)  && <>
            {effect.mechanic !== undefined && <b> {effect.mechanic} </b>}
            {displayState && <> <span className="mr-1">{player}</span> <span className="mr-1">{effect.axis}</span></>}
            {(displayState || value || valueString) && <>{amount}</>}
        </>}
        {(displayEff || displayReq) && <div className="seperate">
            <div><b>{mechanic} {amount !== undefined && amount}</b></div>
            <div className="ml-1">
                {displayReq && <div>{reqs.map((req, i) => <span key={i} className='mr-3'><Requirement requirement={req} /></span>)}</div>}
                {(displayReq && displayEff) && <div className="h-divider" />}
                {displayEff && <div className="ml-1">{effs.map((eff, i) => <span key={i} className='mr-3'><Effect effect={eff} /></span>)}</div>}
            </div>
        </div>}
        {displayPick && <div className="seperate">
            <div><b>{mechanic}</b></div>
            <div className="ml-1">
                {choices.map((choice, k) => <div key={k} className='seperate'>
                    {choice.map((eff) => <span key={eff.id} className='mr-3'><Effect effect={eff} /></span>)}
                </div>)}
            </div>
        </div>}
    </div>

}
export default Effect; 