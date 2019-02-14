import {h, Component, render} from 'preact';
import {Provider} from 'preact-redux'; 
import {store, StoreState} from './src/state/store';
import App from './src/app';
import { Store } from 'redux';

declare const module: any

let Prov = Provider as unknown as (store: any)=> JSX.Element

if (module.hot) {
    module.hot.accept();
}
document.addEventListener('DOMContentLoaded', ()=>{
    const rootNode = document.getElementById('root')

    render(<Prov store={store}>
        <App /> 
    </Prov>, rootNode, rootNode.lastChild as Element); 
})