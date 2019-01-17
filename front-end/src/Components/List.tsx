import * as React from 'react';
import { Card } from 'src/Logic/CardInterface';
import { hostURL } from 'src/Logic/Util';
import { Link } from 'react-router-dom';

interface State {
    cards: { [name: string]: Card }
}

interface Props {
    pickCard: (card: Card) => void
}

export default class Viewer extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            cards: {}
        }
        this.getCards = this.getCards.bind(this);
        this.getCards();
    }
    public render() {
        const { cards } = this.state;
        return <div>
            <h2>Cards</h2>
            <ul className='ml-3'>
                {Object.keys(cards).map((name) => <li className="mb-1" key={name} onClick={() => this.props.pickCard(cards[name])}>
                    <Link to="/viewer" >{name}</Link>
                    <Link to="/maker" className="ml-3 mr-1"><button className="btn btn-primary btn-sm">Edit</button></Link>
                    <button className="btn btn-danger btn-sm" onClick={() => this.deleteCard(name)}> Delete </button>
                </li>)}
            </ul>
        </div>
    }
    private async getCards() {
        const response = await fetch(hostURL + 'cards');
        const cards = await response.json();
        this.setState({ cards });
    }
    private async deleteCard(name: string) {
        try {
            await fetch(hostURL + 'card', {
                body: JSON.stringify({ name }),
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'DELETE',
            })
            const cards = {...this.state.cards}
            delete cards[name]; 
            this.setState({cards}); 
        }
        catch(err){
            console.error(err); 
        }
    }
}