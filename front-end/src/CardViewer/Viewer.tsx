import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Card } from 'src/Logic/CardInterface';
import Requirement from 'src/CardViewer/Requirement';
import Effect from 'src/CardViewer/Effect';
import Optional from './Optional';
import { Link } from 'react-router-dom';


interface Props {
    card: Card
}

export default class Viewer extends React.Component<Props>{
    public render() {
        if (this.props.card === undefined) {
            return <Redirect to='/' />
        }
        const { name, optional, requirements, effects } = this.props.card;
        return <div>
            <h3>{name}</h3>
            <ul>
                {requirements.map((req, i) => <Requirement key={i} requirement={req} />)}
            </ul>
            <div className="h-divider" />
            <ul>
                {optional.map((opt, i) => <Optional {...opt} key={i} />)}
            </ul>
            <div className="h-divider" />
            <ul>
                {effects.map((effect, i) => <Effect key={i} effect={effect} />)}
            </ul>
            <Link to="/maker"><button className="btn btn-primary">Edit</button></Link>
        </div>
    }
}