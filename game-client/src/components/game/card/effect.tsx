import { h } from 'preact';
import Requirement from './Requirement';
import { Mechanic, MechanicEnum, getMechDisplay } from '../../../shared/card';
import { Arrow, Icon } from '../../../images'
import { getUUID } from '../../../util';
import { getMechanicDescription } from '../../../extras/mechanicDescriptions'
import { Tooltip } from 'react-lightweight-tooltip';


interface Props {
    effect: Mechanic
    shouldFlip?: boolean
}

const Effect = ({ effect, shouldFlip }: Props) => {
    const {mechanicRequirements: reqs = [], mechanicEffects: effs = []} = effect; 
    const id = String(getUUID(effect));
    const description = getMechanicDescription(effect.mechanic);
    const { eff: displayEff, req: displayReq, valueString, pick: displayPick, state: displayState, value } = getMechDisplay(effect.mechanic);
    return <div class='inline'>
        {effect.mechanic !== undefined && mechWithTooltip(effect.mechanic)}
        {displayState && <Arrow player={effect.player} shouldFlip={shouldFlip} />}
        {displayState && <Icon name={effect.axis} />}
        {(displayState || value || valueString) && effect.amount !== undefined && <b>{effect.amount}</b>}
        {(displayEff || displayReq) && <span>
            <div class='h-divider' />
            <div>
                {displayReq && <div>{reqs.map((req, i) => <span key={i}><Requirement requirement={req} shouldFlip={shouldFlip} /></span>)}</div>}
                {displayEff && <div class='h-divider thin' />}
                {displayEff && <div>{effs.map((eff, i) => <span key={i}><Effect effect={eff} shouldFlip={shouldFlip} /></span>)}</div>}
            </div>
        </span>}
    </div>
}

const mechWithTooltip = (mech: MechanicEnum) => {
    const description = getMechanicDescription(mech);
    return <Tooltip content={description}>
        <div class="ml-1 mr-1"><b>{mech}</b></div>
    </Tooltip>
}


export default Effect; 