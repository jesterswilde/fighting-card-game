import * as React from 'react';
import { Card } from 'src/Logic/CardInterface';
import { hostURL } from 'src/Logic/Util';
import { Link } from 'react-router-dom';

interface State {
    cards: Card[]
    filter: string
}

interface Props {
    pickCard: (card: Card) => void
}

export default class Viewer extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            cards: [],
            filter: ''
        }
        this.getCards = this.getCards.bind(this);
        this.getCards();
    }
    public render() {
        const { cards = []} = this.state;
        return <div>
            <h2>Cards</h2>
            <div>
                Filter:
                <input type='text' value={this.state.filter} onChange={(e) => this.setState({ filter: e.target.value })} />
            </div>
            <ul className='ml-3'>
                {cards.filter(({name})=> name.toLowerCase().includes(this.state.filter.toLowerCase()))
                    .map((card) => <li className="mb-1" key={card.name} onClick={() => this.props.pickCard(card)}>
                    <Link to="/viewer" >{card.name}</Link>
                    <Link to="/maker" className="ml-3 mr-1"><button className="btn btn-primary btn-sm">Edit</button></Link>
                    <button className="btn btn-danger btn-sm" onClick={() => this.deleteCard(card.name)}> Delete </button>
                </li>)}
            </ul>
        </div>
    }
    private async getCards() {
        const response = await fetch(hostURL + 'cards');
        const cardsObj: { [name: string]: Card } = await response.json();
        const cards = Object.keys(cardsObj).sort().map((name) => cardsObj[name]);
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
            const cards = this.state.cards.filter((card)=> card.name !== name); 
            this.setState({ cards });
        }
        catch (err) {
            console.error(err);
        }
    }
}