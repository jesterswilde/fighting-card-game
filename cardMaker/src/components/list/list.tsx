import * as React from 'react';
import { StoreState } from '../../state/store';
import { connect } from 'react-redux';
import { dispatchGetCardList, dispatchDeleteCard, dispatchUpdateCardFilter } from '../../card/dispatch';
import { dispatchToPathString as to } from '../../path/dispatch';

interface Props {
    cardList: string[]
    filter: string
}

const selector = (state: StoreState): Props => {
    return {
        filter: state.card.filter,
        cardList: state.card.cardNames.filter((name) => name.toLowerCase().includes(state.card.filter.toLowerCase()))
    }
}

class List extends React.Component<Props>{
    public componentDidMount() {
        dispatchGetCardList();
    }
    public render() {
        const { cardList = [], filter } = this.props;
        return <div>
            <h2>Cards</h2>
            <div>Total Cards {cardList.length}</div>
            <div>
                Filter:
                <input type='text' value={filter} onChange={({ target }) => dispatchUpdateCardFilter(target.value)} />
            </div>
            <table className='ml-3 list-table'>
                <tbody>
                    {cardList.map((card) => <tr key={card}>
                        <td onClick={() => to('/view/' + card)}>{card}</td>
                        <td><button className="btn btn-primary btn-sm m-1" onClick={() => to('/edit/' + card)}>Edit</button></td>
                        <td><button className="btn btn-danger btn-sm m-1" onClick={() => dispatchDeleteCard(card)}> Delete </button></td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    }
}

export default connect(selector)(List); 