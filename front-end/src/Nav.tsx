import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props{
    newCard: ()=> void
}

export default (props: Props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <a className="navbar-brand" href="#">Cards</a>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/" onClick={props.newCard}>List</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/maker" onClick={props.newCard}>New Card</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}