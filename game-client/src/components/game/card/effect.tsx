import { h } from 'preact';
import Requirement from './Requirement';
import { Mechanic, MechanicDisplay, DisplayEnum } from '../../../interfaces/card';
import { Arrow, Icon } from '../../../images'
import { getUUID } from '../../../util';
import { getMechanicDescription } from '../../../extras/mechanicDescriptions'
import ReactTooltip from 'react-tooltip';

interface Props {
    effect: Mechanic
    shouldFlip?: boolean
}

const Effect = ({ effect, shouldFlip }: Props) => {
    return renderSwitch(effect, shouldFlip)
}

const renderSwitch = (effect: Mechanic, shouldFlip: boolean) => {
    if (effect.mechanic === undefined) {
        return renderEffect(effect, shouldFlip);
    }
    switch (MechanicDisplay[effect.mechanic]) {
        case DisplayEnum.EFF:
        case DisplayEnum.REQ_EFF:
        case DisplayEnum.AMOUNT_EFF:
            return renderMechanic(effect, shouldFlip);
        case DisplayEnum.PICK_ONE:
            return renderPickOne(effect, shouldFlip);
        case DisplayEnum.NONE:
            return renderNone(effect);
        case DisplayEnum.AMOUNT:
        case DisplayEnum.NAME:
        case DisplayEnum.NORMAL:
            return renderEffect(effect, shouldFlip);
    }
    return null;
}


const renderNone = (mechanic: Mechanic) => {
    const id = String(getUUID(mechanic));
    const description = getMechanicDescription(mechanic.mechanic);
    return <div class='mechanic'>
        <ReactTooltip delayShow={250} id={id} effect="solid">{description}</ReactTooltip>
        <div data-tip={description} data-for={id}><b>{mechanic.mechanic}</b></div>
    </div>
}


const renderMechanic = (mechanic: Mechanic, shouldFlip) => {
    const reqs = mechanic.mechanicRequirements || [];
    const effs = mechanic.mechanicEffects || [];
    const id = String(getUUID(mechanic));
    const description = getMechanicDescription(mechanic.mechanic);
    return <div class='mechanic'>
        <ReactTooltip delayShow={250} id={id} effect="solid">{description}</ReactTooltip>
        <div data-tip={description} data-for={id}><b>{mechanic.mechanic} {mechanic.amount !== undefined && mechanic.amount}</b></div>
        <div class='h-divider' />
        <div>
            <div>{reqs.map((req, i) => <span key={i}><Requirement requirement={req} shouldFlip={shouldFlip} /></span>)}</div>
            <div class='h-divider thin' />
            <div>{effs.map((eff, i) => <span key={i}><Effect effect={eff} shouldFlip={shouldFlip} /></span>)}</div>
        </div>
    </div>
}

const renderPickOne = (mechanic: Mechanic, shouldFlip: boolean) => {
    const id = String(getUUID(mechanic));
    const description = getMechanicDescription(mechanic.mechanic);
    return <div class='pick-one'>
        <ReactTooltip delayShow={250} id={id} effect="solid">{description}</ReactTooltip>
        <div  data-tip={description} data-for={id}><b>Pick One</b></div>
        <div class='choices'>
            {mechanic.choices.map((choice, i) => {
                return <div key={i} class='choice'>
                    {choice.map((effect, i) => <div key={i} class='inline'> <Effect shouldFlip={shouldFlip} effect={effect} /></div>)}
                </div>
            })}
        </div>
    </div>
}

const renderEffect = (effect: Mechanic, shouldFlip) => {
    const id = String(getUUID(effect));
    const description = getMechanicDescription(effect.mechanic);
    return <div class='inline'>
        {effect.mechanic !== undefined && <ReactTooltip delayShow={250} id={id} effect="solid">{description}</ReactTooltip>}
        {effect.mechanic !== undefined && <b data-tip={description} data-for={id}> {effect.mechanic} </b>}
        {effect.player !== undefined && <Arrow player={effect.player} shouldFlip={shouldFlip} />}
        {effect.axis !== undefined && <Icon name={effect.axis} />}
        <b>{effect.amount}</b>
    </div>
}

export default Effect; 