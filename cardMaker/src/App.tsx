import * as React from 'react';
import './styles/css/index.css';
import { StoreState } from './state/store';
import { connect } from 'react-redux';
import CardList from './components/list/list'
import Viewer from './components/viewer/viewer'

interface Props {
  nextPath: string,
  remainingPath: string[]
}

const selector = (state: StoreState): Props => {
  const [_, nextPath, ...remainingPath] = state.path.pathArr;
  return { nextPath, remainingPath };
}

const App = ({ nextPath, remainingPath }: Props) => {
  return (
    <div className="App">
      <div className="container">
        {body(nextPath, remainingPath)}
      </div>
    </div>
  );
}

const body = (nextPath: string, remainingPath: string[]) => {
  switch (nextPath) {
    case 'viewer':
      return <Viewer path={remainingPath} />
    default:
      return <CardList />
  }
}



export default connect(selector)(App);