import * as React from 'react';
import './styles/css/index.css';
import { Route } from 'react-router-dom';
import Maker from './CardMaker/Maker';
import CardList from './Components/List';
import { Card } from './Logic/CardInterface';
import Navbar from './Nav';
import Viewer from './CardViewer/Viewer';
import { hostURL } from './Logic/Util';

interface State {
  card?: Card
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {}
  }
  public render() {
    return (
      <div className="App">
        <Navbar newCard={this.newCard} />
        <div className="container">
          <Route exact={true} path="/" render={() => (
            <CardList pickCard={this.pickCard} />
          )} />
          <Route path="/maker" render={() => (
            <Maker changeCard={this.changeCard} pickCard={this.pickCard} card={this.state.card} />
          )} />
          <Route path="/viewer" render={() => (
            <Viewer changeCard={this.changeCard} card={this.state.card as Card} />
          )} />
        </div>
      </div>
    );
  }
  private changeCard = async (change: number) => {
    const { card } = this.state;
    if (card !== undefined) {
      const response = await fetch(hostURL + 'cards');
      const cardsObj: { [name: string]: Card } = await response.json();
      const cards = Object.keys(cardsObj).sort().map((name) => cardsObj[name]);
      let index = cards.findIndex(({ name }) => name === card.name);
      index += change;
      index = Math.max(index, 0);
      index = Math.min(index, cards.length - 1);
      const pickedCard = cards[index]; 
      this.setState({card: pickedCard}); 
    }
  }
  private pickCard = (card: Card) => {
    this.setState({ card })
  }
  private newCard = () => {
    this.setState({ card: undefined })
  }
}

export default App;
