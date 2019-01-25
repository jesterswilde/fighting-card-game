import {h, Component, render} from 'preact';
import {Provider} from 'preact-redux'; 
import {store} from './src/state/store';
import App from './src/app';
import Test from './src/cardTest'

declare const module: any

if (module.hot) {
    module.hot.accept();
}
document.addEventListener('DOMContentLoaded', ()=>{
    const rootNode = document.getElementById('root')

    render(<Provider store={store}>
        <App /> 
    </Provider>, rootNode, rootNode.lastChild as Element); 
    // render(<Test />, rootNode, rootNode.lastChild as Element); 
})