import { h } from 'preact';
import Requirement from './Requirement';
import { Mechanic, MechanicDisplay, DisplayEnum } from '../../../interfaces/card';
import { Arrow, Icon } from '../../../images'

interface Props {
    effect: Mechanic
    shouldFlip?: boolean
}

const Effect = ({effect, shouldFlip}: Props) => {
    return renderSwitch(effect, shouldFlip)
}

const renderSwitch = (effect: Mechanic, shouldFlip: boolean) => {
    if (effect.mechanic === undefined) {
        return renderEffect(effect, shouldFlip);
    }
    switch (MechanicDisplay[effect.mechanic]) {
        case DisplayEnum.EFF:
        case DisplayEnum.REQ_EFF:
            return renderMechanic(effect, shouldFlip);
        case DisplayEnum.NONE:
            return renderNone(effect); 
        case DisplayEnum.AMOUNT:
        case DisplayEnum.NAME:
        case DisplayEnum.NORMAL:
            return renderEffect(effect, shouldFlip);
    }
    return null;
}

const renderNone = (mechanic: Mechanic) => (
    <div class='mechanic'>
        <div><b>{mechanic.mechanic}</b></div>
    </div>
)

const renderMechanic = (mechanic: Mechanic, shouldFlip) => {
    const reqs = mechanic.mechanicRequirements || [];
    const effs = mechanic.mechanicEffects || [];
    return <div class='mechanic'>
        <div><b>{mechanic.mechanic}</b></div>
        <div class='h-divider'/>
        <div>
            <div>{reqs.map((req, i) => <span key={i}><Requirement requirement={req} shouldFlip={shouldFlip} /></span>)}</div>
            <div class='h-divider thin'/>
            <div>{effs.map((eff, i) => <span key={i}><Effect effect={eff} shouldFlip={shouldFlip} /></span>)}</div>
        </div>
    </div>
}

const renderEffect = (effect: Mechanic, shouldFlip) => {
    return <div class='inline'>
        {effect.mechanic !== undefined && <b> {effect.mechanic} </b>}
        <Arrow player={effect.player} shouldFlip={shouldFlip} /> <Icon name={effect.axis} /> <b>{effect.amount}</b>
    </div>
}

export default Effect; 