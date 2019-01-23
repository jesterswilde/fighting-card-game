import {h, Component, render} from 'preact';
import App from './src/app';

declare const module: any

if (module.hot) {
    module.hot.accept();
}
document.addEventListener('DOMContentLoaded', ()=>{
    const rootNode = document.getElementById('root')

    render(<App />, rootNode, rootNode.lastChild as Element); 
    
})