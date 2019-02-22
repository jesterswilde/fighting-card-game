// import * as React from 'react';

// interface Props {
//     update: (requirement: StatePiece, index: number) => void,
//     index: number,
//     requirement: StatePiece
// }


// export default class Requirement extends React.Component<Props>{
//     constructor(props: Props) {
//         super(props);
//         this.changeAffects = this.changeAffects.bind(this); 
//         this.changeAxis = this.changeAxis.bind(this); 

//     }
//     public render() {
//         return (
//             <form className="form-inline inline">
//                 <select className="form-control" id="affects" onChange={this.changeAffects} value = {this.props.requirement.player}>
//                     <option value={PlayerEnum.OPPONENT}> ↑ </option>
//                     <option value={PlayerEnum.PLAYER}> ↓ </option>
//                     <option value={PlayerEnum.BOTH}> ↕ </option>
//                 </select>
//                 <select className="form-control" id="axis" onChange={this.changeAxis} value={this.props.requirement.axis}>
//                     {Object.keys(AxisEnum).map((key)=> <option value = {AxisEnum[key]} key = {key}> {AxisEnum[key]}</option>)}
//                 </select>
//             </form>
//         )
//     }
//     private changeAffects(e: React.ChangeEvent<HTMLSelectElement>){
//         const requirement = {...this.props.requirement};
//         requirement.player = Number(e.target.value);
//         this.props.update(requirement, this.props.index);  
//     }
//     private changeAxis(e: React.ChangeEvent<HTMLSelectElement>){
//         const requirement = {...this.props.requirement};
//         requirement.axis = e.target.value as AxisEnum;
//         this.props.update(requirement, this.props.index); 
//     }
// }