import * as React from 'react';
import { dispatchToPathString as to } from './path/dispatch';
import { dispatchMakeBlankCard } from './card/dispatch';

export default () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <a className="navbar-brand" href="#">Cards</a>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link"  onClick={()=>to('/')}>List</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" onClick={dispatchMakeBlankCard}>New Card</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}