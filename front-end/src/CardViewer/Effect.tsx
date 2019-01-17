import * as React from 'react';
import { Mechanic, MechanicDisplay, DisplayEnum } from 'src/Logic/CardInterface';
import { playerRouter as pr } from '../Logic/Util';
import Requirement from './Requirement';


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
        case DisplayEnum.AMOUNT:
        case DisplayEnum.NAME:
        case DisplayEnum.NORMAL:
            return renderEffect(effect);
    }
    return null;
}

const renderMechanic = (mechanic: Mechanic) => {
    const reqs = mechanic.mechanicRequirements || [];
    const effs = mechanic.mechanicEffects || [];
    return <div className="seperate">
        <div><b>{mechanic.mechanic}</b></div>
        <div className="ml-3">
            <div>{reqs.map((req, i) => <span key={i} className='mr-3'><Requirement requirement={req} /></span>)}</div>
            <div className="h-divider" />
            <div className="ml-3">{effs.map((eff, i) => <span key={i} className='mr-3'><Effect effect={eff} /></span>)}</div>
        </div>
    </div>
}

const renderEffect = (effect: Mechanic) => {
    const player = effect.player !== undefined ? pr[effect.player] : null;
    return <span>
        {effect.mechanic !== undefined && <b> {effect.mechanic} </b>}
        {player} {effect.axis} {effect.amount}
    </span>
}

export default Effect; 