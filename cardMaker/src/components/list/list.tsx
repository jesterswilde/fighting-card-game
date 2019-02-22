import * as React from 'react';
import { StoreState } from '../../state/store';
import { connect } from 'react-redux';
import { dispatchGetCardList, dispatchDeletedCard } from '../../card/dispatch';
import { dispatchToPathString as to } from '../../path/dispatch';

interface Props {
    cardList: string[]
}

const selector = (state: StoreState): Props => {
    return { cardList: state.card.cardNames }
}

class List extends React.Component<Props>{
    public componentDidMount() {
        dispatchGetCardList();
    }
    public render() {
        const { cardList = [] } = this.props;
        return <div>
            <h2>Cards</h2>
            <div>Total Cards {cardList.length}</div>
            <div>
                Filter:
                {/* <input type='text' value={this.state.filter} onChange={(e) => this.setState({ filter: e.target.value })} /> */}
            </div>
            <table className='ml-3'>
                {cardList.map((card) => <tr key={card}>
                    <td onClick={() => to('/view/' + card)}>{card}</td>
                    <td><button className="btn btn-primary btn-sm m-1" onClick={() => to('/edit/' + card)}>Edit</button></td>
                    <td><button className="btn btn-danger btn-sm m-1" onClick={() => dispatchDeletedCard(card)}> Delete </button></td>
                </tr>)}
            </table>
        </div>
    }
}

export default connect(selector)(List); 