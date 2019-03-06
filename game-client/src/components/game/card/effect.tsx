import { h } from 'preact';
import Requirement from './Requirement';
import { Mechanic, MechanicEnum, getMechDisplay } from '../../../shared/card';
import { Arrow, Icon } from '../../../images'
import { getMechanicDescription } from '../../../extras/mechanicDescriptions'
import { Tooltip } from 'react-lightweight-tooltip';


interface Props {
    effect: Mechanic
    shouldFlip?: boolean
}

const Effect = ({ effect, shouldFlip }: Props) => {
    const {mechanicRequirements: reqs = [], choices = [], mechanicEffects: effs = []} = effect; 
    const { eff: displayEff, req: displayReq, valueString, pick: displayPick, state: displayState, value } = getMechDisplay(effect.mechanic);
    const mechClass = displayEff ? 'mechanic' : ''
    return <div class={'small-pad ' + mechClass}>
        {effect.mechanic !== undefined && mechWithTooltip(effect.mechanic)}
        {displayState && <Arrow player={effect.player} shouldFlip={shouldFlip} />}
        {displayState && <Icon name={effect.axis} />}
        {(displayState || value || valueString) && effect.amount !== undefined && <b>{effect.amount}</b>}
        {(displayEff || displayReq || displayPick) && <span>
            <div class='h-divider' />
            <div>
                {displayReq && <div>{reqs.map((req, i) => <span key={i}><Requirement requirement={req} shouldFlip={shouldFlip} /></span>)}</div>}
                {displayEff && <div class='h-divider thin' />}
                {displayEff && <div>{effs.map((eff, i) => <span key={i}><Effect effect={eff} shouldFlip={shouldFlip} /></span>)}</div>}
                {displayPick && <div class="pick-one">{choices.map((category,i)=>{
                    return <div class="choices" key={i}>
                            {category.map((choice, j)=> <div class="choice" key={j}><Effect effect={choice} shouldFlip={shouldFlip} /> </div>)}
                        </div>
                })}</div>}
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