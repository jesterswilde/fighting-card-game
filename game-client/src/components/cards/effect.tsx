import { h } from 'preact';
import Requirement from './Requirement';
import { Mechanic, MechanicEnum, getMechDisplay } from '../../shared/card';
import { Arrow, Icon } from '../../images'
import { getMechanicDescription } from '../../extras/mechanicDescriptions'
import { Tooltip } from 'react-lightweight-tooltip';


interface Props {
    effect: Mechanic
    shouldFlip?: boolean
}

const Effect = ({ effect, shouldFlip }: Props) => {
    const {mechanicRequirements: reqs = [], choices = [], mechanicEffects: effs = []} = effect; 
    const { player: displayPlayer, axis: displayAxis, eff: displayEff, req: displayReq, valueString, pick: displayPick, state: displayState, value } = getMechDisplay(effect.mechanic);
    const mechClass = (displayEff || displayPick) ? 'mechanic' : 'icon-section'
    if(effect.mechanic === "Rigid")console.log(effect.mechanic, getMechDisplay(effect.mechanic))
    return <div class={mechClass}>
        {effect.mechanic !== undefined && mechWithTooltip(effect.mechanic)}
        {(displayState || displayPlayer) && <Arrow player={effect.player} shouldFlip={shouldFlip} />}
        {(displayState || displayAxis) && <Icon name={effect.axis} />}
        {(displayState || value || valueString) && effect.amount !== undefined && <b>{effect.amount}</b>}
        {(displayEff || displayReq || displayPick) &&
            <div class="recurse">
                {displayReq && <div class="req-parent">{reqs.map((req, i) => <div key={i}><Requirement requirement={req} shouldFlip={shouldFlip} /></div>)}</div>}
                {displayEff && displayReq && <div class='h-divider thin' />}
                {displayEff && <div class="eff-parent">{effs.map((eff, i) => <span key={i}><Effect effect={eff} shouldFlip={shouldFlip} /></span>)}</div>}
                {displayPick && <div class="pick-one">{choices.map((category,i)=>{ 
                    return <div class="choices" key={i}>
                            {category.map((choice, j)=> <div class="choice" key={j}><Effect effect={choice} shouldFlip={shouldFlip} /> </div>)}
                        </div>
                })}</div>}
            </div>}
    </div>
}

const mechWithTooltip = (mech: MechanicEnum) => {
    const description = getMechanicDescription(mech);
    return <Tooltip content={description}>
        <div class="ml-1 mr-1"><b>{mech}</b></div>
    </Tooltip>
}


export default Effect; 