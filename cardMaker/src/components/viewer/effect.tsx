import * as React from 'react';
import { MechanicJSON } from '../../interfaces/cardJSON';
import { MechanicDisplay, DisplayEnum, getMechDisplay } from '../../interfaces/enums';
import Requirement from './requirement';
import { playerRouter as pr } from '../../utils';


interface Props {
    effect: MechanicJSON
}

const Effect = ({ effect }: Props) => {
    const { choices = [],  mechanic, mechanicRequirements: reqs = [], mechanicEffects: effs = [], amount } = effect;
    const { eff: displayEff, pick: displayPick, state: displayState } = getMechDisplay(effect.mechanic);
    const player = effect.player !== undefined ? pr[effect.player] : null;
    return <div>
        {displayState && <>
            {effect.mechanic !== undefined && <b> {effect.mechanic} </b>}
            {player} {effect.axis} {effect.amount}
        </>}
        {displayEff && <div className="seperate">
            <div><b>{mechanic}  {amount !== undefined && amount}</b></div>
            <div className="ml-3">
                <div>{reqs.map((req, i) => <span key={i} className='mr-3'><Requirement requirement={req} /></span>)}</div>
                <div className="h-divider" />
                <div className="ml-3">{effs.map((eff, i) => <span key={i} className='mr-3'><Effect effect={eff} /></span>)}</div>
            </div>
        </div>}
        {displayPick && <div className="seperate">
            <div><b>{mechanic}</b></div>
            <div className="ml-3">
                {choices.map((choice, k) => <div key={k} className='seperate'>
                    {choice.map((eff) => <span key={eff.id} className='mr-3'><Effect effect={eff} /></span>)}
                </div>)}
            </div>
        </div>}
    </div>

}
export default Effect; 