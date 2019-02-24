import * as React from 'react';
import { CardJSON } from "../../interfaces/cardJSON";
import { dispatchUpdatedCardName, dispatchGetCard, dispatchChangeCurrentCard, dispatchCreateTag, dispatchUpdateTag, dispatchDeleteTag } from '../../card/dispatch';
import { StoreState } from '../../state/store';
import { cardToJSON, updateCard } from '../../card/cardToJSON';
import { connect } from 'react-redux';
import { dispatchDeleteStatePiece } from '../../statePiece/dispatch';
import { cardCreateReq, cardCreateEff } from '../../card/json';
import { dispatchDeletedMech } from '../../mechanic/dispatch';
import Requirement from './requirement';
import Effect from './effect';
import { dispatchToPathString } from '../../path/dispatch';

interface Props extends InternalProps {
    path: string[]
}

interface InternalProps {
    card: CardJSON
}

const selector = (state: StoreState): InternalProps => {
    const card = cardToJSON(state);
    return { card };
}

class Maker extends React.Component<Props> {
    componentDidMount() {
        const { path, card } = this.props;
        if (card !== null && card.name !== path[0]) {
            dispatchGetCard(path[0]);
        }
    }
    render() {
        const { card: { name = '', requirements = [], effects = [], tagObjs = [] } } = this.props;
        return <div>
            <input placeholder="Card Name" className="form-control-lg" type="text" value={name} onChange={(e) => dispatchUpdatedCardName(e.target.value)} />
            <div>
                <h2> Requirements
                <button className='ml-3 btn btn-sm btn-primary' onClick={cardCreateReq}>+</button>
                </h2>
                <ul className="ml-1">
                    {requirements.map((req) => <li key={req.id}><div className="row">
                        <span className="col-1"><button className="btn btn-danger btn-sm" onClick={() => dispatchDeleteStatePiece(req.id)}> - </button></span>
                        <span className="col-11"><Requirement requirement={req} /></span>
                    </div></li>)}
                </ul>
            </div>
            <div>
                <h2> Effect
                <button className='ml-3 btn btn-sm btn-primary' onClick={cardCreateEff}>+</button>
                </h2>
                <ul className="ml-1">
                    {effects.map((effect, i) => <li key={effect.id}><div className="row">
                        <span className="col-1"><button className="btn btn-sm btn-danger" onClick={() => dispatchDeletedMech(effect.id)}>-</button></span>
                        <span className="col-11"><Effect effect={effect} /></span>
                    </div>
                    </li>)}
                </ul>
            </div>
            <div>
                <h2>Tags
                <button className='ml-3 btn btn-sm btn-primary' onClick={dispatchCreateTag}>+</button>
                </h2>
                {tagObjs.map((tag)=> <div key={tag.id}>
                <button className="btn btn-sm btn-danger" onClick={() => dispatchDeleteTag(tag.id)}>-</button>
                    <input type="text" value={tag.value} onChange={({target})=> dispatchUpdateTag(tag.id, target.value)}/>
                </div>)}
            </div>
            <div>
                <button className='btn btn-primary m-2' onClick={() => dispatchChangeCurrentCard(-1)}>{'<='}</button>
                <button className="btn btn-primary btn-large m-2" onClick={updateCard}>Update</button>
                <button className="btn btn-primary btn-large m-2" onClick={() => dispatchToPathString('/view/' + name)}> View </button>
                <button className='btn btn-primary m-2' onClick={() => dispatchChangeCurrentCard(1)}>{'=>'}</button>
            </div>

        </div>
    }
}

export default connect(selector)(Maker);
