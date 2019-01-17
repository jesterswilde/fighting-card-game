import * as React from 'react';
import './styles/css/index.css';
import { Route } from 'react-router-dom';
import Maker from './CardMaker/Maker';
import CardList from './Components/List';
import { Card } from './Logic/CardInterface';
import Navbar from './Nav';
import Viewer from './CardViewer/Viewer'; 

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
            <Maker pickCard={this.pickCard} card={this.state.card} />
          )} />
          <Route path="/viewer" render={() => (
            <Viewer card={this.state.card as Card} />
          )} />
        </div>
      </div>
    );
  }
  private pickCard = (card: Card) => {
    this.setState({ card })
  }
  private newCard = () => {
    this.setState({ card: undefined })
  }
}

export default App;
