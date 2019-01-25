import { h } from 'preact';
import Requirement from './Requirement';
import { Mechanic, MechanicDisplay, DisplayEnum } from '../../../interfaces/card';
import { Arrow, Icon } from '../../../images'

interface Props {
    effect: Mechanic
}

const Effect = (props: Props) => {
    return renderSwitch(props.effect)
}

const renderSwitch = (effect: Mechanic) => {
    if (effect.mechanic === undefined) {
        return renderEffect(effect);
    }
    switch (MechanicDisplay[effect.mechanic]) {
        case DisplayEnum.EFF:
        case DisplayEnum.REQ_EFF:
            return renderMechanic(effect);
        case DisplayEnum.NONE:
            return renderNone(effect); 
        case DisplayEnum.AMOUNT:
        case DisplayEnum.NAME:
        case DisplayEnum.NORMAL:
            return renderEffect(effect);
    }
    return null;
}

const renderNone = (mechanic: Mechanic) => (
    <div class='mechanic'>
        <div><b>{mechanic.mechanic}</b></div>
    </div>
)

const renderMechanic = (mechanic: Mechanic) => {
    const reqs = mechanic.mechanicRequirements || [];
    const effs = mechanic.mechanicEffects || [];
    return <div class='mechanic'>
        <div><b>{mechanic.mechanic}</b></div>
        <div class='h-divider'/>
        <div>
            <div>{reqs.map((req, i) => <span key={i}><Requirement requirement={req} /></span>)}</div>
            <div>{effs.map((eff, i) => <span key={i}><Effect effect={eff} /></span>)}</div>
        </div>
    </div>
}

const renderEffect = (effect: Mechanic) => {
    return <div class='inline'>
        {effect.mechanic !== undefined && <b> {effect.mechanic} </b>}
        <Arrow player={effect.player} /> <Icon name={effect.axis} /> <b>{effect.amount}</b>
    </div>
}

export default Effect; 