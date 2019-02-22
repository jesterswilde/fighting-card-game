// import * as React from 'react';


// interface Props {
//     effect: Mechanic
// }

// const Effect = (props: Props) => {
//     return renderSwitch(props.effect)

// }

// const renderSwitch = (effect: Mechanic) => {
//     if (effect.mechanic === undefined) {
//         return renderEffect(effect);
//     }
//     switch (MechanicDisplay[effect.mechanic]) {
//         case DisplayEnum.EFF:
//         case DisplayEnum.REQ_EFF:
//         case DisplayEnum.AMOUNT_EFF:
//             return renderMechanic(effect);
//         case DisplayEnum.PICK_ONE:
//             return renderPickOne(effect);
//         case DisplayEnum.NONE:
//         case DisplayEnum.AMOUNT:
//         case DisplayEnum.NAME:
//         case DisplayEnum.NORMAL:
//             return renderEffect(effect);
//     }
//     return null;
// }


// const renderPickOne = ({ mechanic, choices = [] }: Mechanic) => {
//     return <div className="seperate">
//         <div><b>{mechanic}</b></div>
//         <div className="ml-3">
//             {choices.map((choice, k) => <div key={k} className='seperate'>
//                 {choice.map((eff, i) => <span key={i} className='mr-3'><Effect effect={eff} /></span>)}
//             </div>)}
//         </div>
//     </div>
// }

// const renderMechanic = (mechanic: Mechanic) => {
//     const reqs = mechanic.mechanicRequirements || [];
//     const effs = mechanic.mechanicEffects || [];
//     return <div className="seperate">
//         <div><b>{mechanic.mechanic}  {mechanic.amount !== undefined && mechanic.amount}</b></div>
//         <div className="ml-3">
//             <div>{reqs.map((req, i) => <span key={i} className='mr-3'><Requirement requirement={req} /></span>)}</div>
//             <div className="h-divider" />
//             <div className="ml-3">{effs.map((eff, i) => <span key={i} className='mr-3'><Effect effect={eff} /></span>)}</div>
//         </div>
//     </div>
// }

// const renderEffect = (effect: Mechanic) => {
//     const player = effect.player !== undefined ? pr[effect.player] : null;
//     return <span>
//         {effect.mechanic !== undefined && <b> {effect.mechanic} </b>}
//         {player} {effect.axis} {effect.amount}
//     </span>
// }

// export default Effect; 