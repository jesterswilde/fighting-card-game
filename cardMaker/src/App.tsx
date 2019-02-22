import * as React from 'react';
import './styles/css/index.css';
import { StoreState } from './state/store';
import { connect } from 'react-redux';
import CardList from './components/list/list'

interface Props {
  pathArr: string[]
}

const selector = (state: StoreState): Props => {
  return { pathArr: state.path.pathArr };
}


const App = ({ pathArr }: Props) => {
  return (
    <div className="App">
      <div className="container">
        <CardList />
      </div>
    </div>
  );
}



export default connect(selector)(App);