import * as React from 'react';
import { StoreState } from 'src/state/store';
import { connect } from 'react-redux';

interface Props {
    cardList: string[]
}

const selector = (state: StoreState): Props => {
    return { cardList: state.card.cardNames }
}

class List extends React.Component<Props>{
    public render() {
        const { cardList = [] } = this.props;
        return <div>
            <h2>Cards</h2>
            <div>Total Cards {cardList.length}</div>
            <div>
                Filter:
                {/* <input type='text' value={this.state.filter} onChange={(e) => this.setState({ filter: e.target.value })} /> */}
            </div>
            <ul className='ml-3'>
                {cardList.map((card) => <li className="mb-1" key={name}>
                    {name}
                    {/* <Link to="/maker" className="ml-3 mr-1"><button className="btn btn-primary btn-sm">Edit</button></Link>
                        <button className="btn btn-danger btn-sm" onClick={() => this.deleteCard(card.name)}> Delete </button> */}
                </li>)}
            </ul>
        </div>
    }
}

export default connect(selector)(List); 