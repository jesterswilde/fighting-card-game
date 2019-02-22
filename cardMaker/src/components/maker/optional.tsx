import * as React from 'react';

// interface Props {
//     optional: RequirementEffect
//     update: (options: RequirementEffect, index: number) => void
//     index: number
// }

// export default class Optional extends React.Component<Props>{
//     constructor(props: Props) {
//         super(props);
//         this.updateRequirement = this.updateRequirement.bind(this);
//         this.updateEffect = this.updateEffect.bind(this);
//         this.removeRequirement = this.removeRequirement.bind(this);
//         this.removeEffect = this.removeEffect.bind(this);
//         this.addRequirement = this.addRequirement.bind(this);
//         this.addEffect = this.addEffect.bind(this);
//     }
//     public render() {
//         const { requirements, effects } = this.props.optional;
//         return (<div>
//             <h3>Requirements: <button className="btn btn-primary btn-sm" onClick={this.addRequirement}>+</button></h3>
//                 {requirements.map((req, i) => <div key={getUUID(req)}>
//                 <button className="btn btn-danger btn-sm" onClick={()=>this.removeRequirement(i)}>-</button>
//                 <Requirement requirement={req} index={i} update={this.updateRequirement} />
//                 </div>)}
//             <h3>Effects: <button className="btn btn-primary btn-sm" onClick={this.addEffect}>+</button></h3>
//                 {effects.map((eff, i)=><div key={getUUID(eff)}>
//                 <button className="btn btn-danger btn-sm" onClick={()=>this.removeEffect(i)}>-</button>
//                 <Effect effect={eff} index={i} update={this.updateEffect}/>
//                 </div>)}
//         </div>)
//     }
//     private updateRequirement(state: StatePiece, index: number) {
//         const optional = {...this.props.optional};
//         optional.requirements[index] = state; 
//         this.props.update(optional, this.props.index); 
//     }
//     private updateEffect(state: Mechanic, index: number) {
//         const optional = {...this.props.optional};
//         optional.effects[index] = state; 
//         this.props.update(optional, this.props.index); 
//     }
//     private addRequirement() {
//         const optional = {...this.props.optional};
//         optional.requirements = [...optional.requirements, {
//             axis: AxisEnum.CLOSE,
//             player: PlayerEnum.OPPONENT,
//         }]
//         this.props.update(optional, this.props.index); 
//     }
//     private addEffect() {
//         const optional = {...this.props.optional};
//         optional.effects = [...optional.effects, {}]
//         this.props.update(optional, this.props.index); 
//     }
//     private removeRequirement(index: number) {
//         const optional = {...this.props.optional};
//         optional.requirements = optional.requirements.filter((_, i)=> i !== index); 
//         this.props.update(optional, this.props.index); 
//     }
//     private removeEffect(index: number) {
//         const optional = {...this.props.optional};
//         optional.effects = optional.effects.filter((_, i)=> i !== index); 
//         this.props.update(optional, this.props.index); 
//     }
// }