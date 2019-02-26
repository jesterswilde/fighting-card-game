import * as React from 'react';
import { CardJSON } from '../../interfaces/cardJSON';
import { StoreState } from '../../state/store';
import { cardToJSON } from '../../card/cardToJSON';
import { connect } from 'react-redux';
import { dispatchGetCard, dispatchChangeCurrentCard } from '../../card/dispatch';
import Requirement from './requirement';
import Optional from './optional';
import Effect from './effect';
import { dispatchToPathString } from '../../path/dispatch';

interface Props extends InternalProps {
    path: string[]
}

interface InternalProps {
    card: CardJSON | null
}

const selector = (state: StoreState): InternalProps => {
    const card = cardToJSON(state);
    return { card };
}

class Viewer extends React.Component<Props>{
    componentDidMount() {
        const { path, card } = this.props;
        if (card !== null && card.name !== path[0]) {
            dispatchGetCard(path[0]);
        }
    }
    public render() {
        const { card } = this.props;
        if (card === null) {
            return <div> No Card</div>
        }
        const { requirements, optional, effects, name, tags: tagObjs } = card;
        return <div>
            <h3>{card.name}</h3>
            <ul>
                {requirements.map((req) => <Requirement key={req.id} requirement={req} />)}
            </ul>
            <div className="h-divider" />
            <ul>
                {optional.map((opt, i) => <Optional {...opt} key={i} />)}
            </ul>
            <div className="h-divider" />
            <ul>
                {effects.map((effect, i) => <Effect key={i} effect={effect} />)}
            </ul>
            <div className="h-divider" />
            <div>
                {tagObjs.map((tag, i) => <div className="inline" key={tag.id}> {tag.value}</div>)}
            </div>
            <div>
                <button className='btn btn-primary m-2' onClick={() => dispatchChangeCurrentCard(-1)}>{'<='}</button>
                <button className='btn btn-primary m-2' onClick={() => dispatchToPathString('/edit/' + name)}>Edit</button>
                <button className='btn btn-primary m-2' onClick={() => dispatchChangeCurrentCard(1)}>{'=>'}</button>
            </div>
        </div>
    }
}

export default connect(selector)(Viewer);

// export default class Viewer extends React.Component<Props>{
//     public render() {
//         if (this.props.card === undefined) {
//             return <Redirect to='/' />
//         }
//         const { name, optional, requirements, effects, tags } = this.props.card;
//         return <div>
//             <h3>{name}</h3>
//             <ul>
//                 {requirements.map((req, i) => <Requirement key={i} requirement={req} />)}
//             </ul>
//             <div className="h-divider" />
//             <ul>
//                 {optional.map((opt, i) => <Optional {...opt} key={i} />)}
//             </ul>
//             <div className="h-divider" />
//             <ul>
//                 {effects.map((effect, i) => <Effect key={i} effect={effect} />)}
//             </ul>
//             <div>
//                 <div className="inline mr-1">Tags: </div>
//                 {tags.map((tag, i) => {
//                     const hasComma = i < tags.length - 1;
//                     return <div key={i} className="inline">{tag}{hasComma ? ',\u00a0' : ''}</div>
//                 })}
//             </div>
//             <Link to="/maker"><button className="btn btn-primary">Edit</button></Link>
//             <div className="mt-2">
//                 <button className="btn btn-primary btn-large ml-2" onClick={() => this.props.changeCard(-1)}> {'<-'} </button>
//                 <button className="btn btn-primary btn-large ml-2" onClick={() => this.props.changeCard(1)}> {'->'} </button>
//             </div>
//         </div >
//     }
// }