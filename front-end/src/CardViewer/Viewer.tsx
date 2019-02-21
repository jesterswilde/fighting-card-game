import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Card } from 'src/Logic/CardInterface';
import Requirement from 'src/CardViewer/Requirement';
import Effect from 'src/CardViewer/Effect';
import Optional from './Optional';
import { Link } from 'react-router-dom';


interface Props {
    card: Card
    changeCard: (index: number) => void
}

export default class Viewer extends React.Component<Props>{
    public render() {
        if (this.props.card === undefined) {
            return <Redirect to='/' />
        }
        console.log(this.props.card);
        const { name, optional, requirements, effects, tags } = this.props.card;
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
            <div>
                <div className="inline mr-1">Tags: </div>
                {tags.map((tag, i) => {
                    const hasComma = i < tags.length - 1;
                    return <div key={i} className="inline">{tag}{hasComma ? ',\u00a0' : ''}</div>
                })}
            </div>
            <Link to="/maker"><button className="btn btn-primary">Edit</button></Link>
            <div className="mt-2">
                <button className="btn btn-primary btn-large ml-2" onClick={() => this.props.changeCard(-1)}> {'<-'} </button>
                <button className="btn btn-primary btn-large ml-2" onClick={() => this.props.changeCard(1)}> {'->'} </button>
            </div>
        </div >
    }
}