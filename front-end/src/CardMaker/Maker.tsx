import * as React from 'react';
import { Card, Mechanic, StatePiece, PlayerEnum, AxisEnum, RequirementEffect } from 'src/Logic/CardInterface';
import Effect from './Effect';
import Requirement from './Requirement';
import Optional from './Optional';
import { hostURL, getUUID } from 'src/Logic/Util';
import { Link } from 'react-router-dom';

interface State extends Card {
    index: string | null
}

interface Props {
    card?: Card
    pickCard: (card: Card) => void
}

export default class Maker extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);
        if (props.card !== undefined) {
            this.state = { ...props.card, index: props.card.name || null };
        } else {
            this.state = {
                effects: [],
                index: null,
                name: '',
                optional: [],
                requirements: [],
            }
        }
        this.updateName = this.updateName.bind(this);
        this.updateRequirement = this.updateRequirement.bind(this);
        this.updateEffect = this.updateEffect.bind(this);
        this.addRequirement = this.addRequirement.bind(this);
        this.addEffect = this.addEffect.bind(this);
        this.removeEffect = this.removeEffect.bind(this);
        this.removeRequirement = this.removeRequirement.bind(this);
        this.addOptional = this.addOptional.bind(this);
        this.removeOptional = this.removeOptional.bind(this);
        this.updateOptional = this.updateOptional.bind(this);
        this.updateCard = this.updateCard.bind(this);
        this.stripUID = this.stripUID.bind(this); 
    }
    public render() {
        const { name = '', effects = [], requirements = [], optional = [] } = this.state;
        return (
            <div>
                <input placeholder="Card Name" className="form-control-lg" type="text" value={name} onChange={(e) => this.updateName(e.target.value)} />
                <div>
                    <h2> Requirements
                        <button className='ml-3 btn btn-sm btn-primary' onClick={this.addRequirement}>+</button>
                    </h2>
                    <ul className="ml-1">
                        {requirements.map((requirement, i) => <li key={getUUID(requirement)}><div className="row">
                            <span className="col-1"><button className="btn btn-danger btn-sm" onClick={() => this.removeRequirement(i)}> - </button></span>
                            <span className="col-11"><Requirement update={this.updateRequirement} index={i} requirement={requirement} /></span>
                        </div></li>)}
                    </ul>
                </div>

                <div>
                    <h2> Effect
                        <button className='ml-3 btn btn-sm btn-primary' onClick={this.addEffect}>+</button>
                    </h2>
                    <ul className="ml-1">
                        {effects.map((effect, i) => <li key={getUUID(effect)}><div className="row">
                            <span className="col-1"><button className="btn btn-sm btn-danger" onClick={() => this.removeEffect(i)}>-</button></span>
                            <span className="col-11"><Effect update={this.updateEffect} index={i} effect={effect} /></span>
                        </div>
                        </li>)}
                    </ul>
                </div>
                <div>
                    <h2> Optional
                        <button className=' ml-3 btn btn-sm btn-primary' onClick={this.addOptional}>+</button>
                    </h2>
                    <ul className="ml-1">
                        {optional.map((opt, i) => <li key={getUUID(opt)}><div className="row">
                            <span className="col-1"><button className="btn btn-danger btn-sm" onClick={() => this.removeOptional(i)}> - </button></span>
                            <span className="col-11"><Optional optional={opt} index={i} update={this.updateOptional} /></span>
                        </div></li>)}
                    </ul>
                </div>
                <div>
                    <button className="btn btn-primary btn-large" onClick={this.updateCard}>Update</button>
                    <Link to="/viewer" className="ml-2">
                        <button onClick={() => this.props.pickCard(this.state)} className="btn btn-primary btn-large"> View </button>
                    </Link>
                    <button className="btn btn-primary btn-large ml-2" onClick={this.newCard}>New Card</button>
                </div>
            </div>
        )
    }
    private newCard = ()=> {
        this.setState({
            effects: [],
            index: null,
            name: '',
            optional: [],
            requirements: []
        })
    }
    private updateCard() {
        const card = this.stripUID(this.state); 
        fetch(hostURL + 'card', {
            body: JSON.stringify(card),
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
        })
    }
    private addRequirement() {
        const requirements = [...this.state.requirements,
        {
            axis: AxisEnum.CLOSE,
            player: PlayerEnum.OPPONENT,
        }]
        this.setState({ requirements })
    }
    private removeRequirement(index: number) {
        const requirements = this.state.requirements.filter((_, i) => i !== index);
        this.setState({ requirements });
    }
    private updateRequirement(requirement: StatePiece, index: number) {
        const requirements = [...this.state.requirements]
        requirements[index] = requirement;
        this.setState({ requirements })
    }
    private addEffect() {
        const effects = [...this.state.effects, {}]
        this.setState({ effects })
    }
    private removeEffect(index: number) {
        const effects = this.state.effects.filter((_, i) => i !== index);
        this.setState({ effects });
    }
    private updateEffect(effect: Mechanic, index: number) {
        const effects = [...this.state.effects]
        effects[index] = effect;
        this.setState({ effects });
    }
    private addOptional() {
        const optional = [...this.state.optional,
        {
            effects: [],
            requirements: [],
        }]
        this.setState({ optional })
    }
    private removeOptional(index: number) {
        const optional = this.state.optional.filter((_, i) => i !== index)
        this.setState({ optional })
    }
    private updateOptional(state: RequirementEffect, index: number) {
        const optional = [...this.state.optional];
        optional[index] = state;
        this.setState({ optional })
    }
    private updateName(name: string) {
        this.setState({ name });
    }
    private stripUID(obj: object){
        let newObj: object;
        if(Array.isArray(obj)){
            newObj = [...obj]; 
        }
        else{
            newObj = {...obj}
        }
        for(const key in newObj){
            if(key === 'uuid'){
                delete newObj[key]
            }
            else if(typeof obj[key] === 'object'){
                newObj[key] = this.stripUID(obj[key]); 
            }
        }
        return newObj; 
    }
}