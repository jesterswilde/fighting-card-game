import * as React from 'react';
import { Mechanic, MechanicEnum, AxisEnum, PlayerEnum, MechanicDisplay, StatePiece, DisplayEnum } from 'src/Logic/CardInterface';
import Requirement from './Requirement';
import { getUUID } from 'src/Logic/Util';

interface Props {
    update: (requirement: Mechanic, index: number) => void,
    index: number,
    effect: Mechanic
}

export default class Effect extends React.Component<Props>{
    constructor(props: Props) {
        super(props);
    }
    public render() {
        const { mechanic } = this.props.effect;
        return (
            <div className="inline form-inline">
                <select className="form-control" id="mechanics" onChange={this.changeMechanic} value={mechanic}>
                    <option value={undefined}> No Mechanic </option>
                    {Object.keys(MechanicEnum).map((key) => <option value={MechanicEnum[key]} key={key}> {MechanicEnum[key]} </option>)}
                </select>
                {this.renderMechanic(mechanic)}
            </div>
        )
    }
    private renderMechanic = (mechanic: MechanicEnum | undefined) => {
        if (mechanic === undefined) {
            return this.renderNormal();
        }
        switch (MechanicDisplay[mechanic]) {
            case DisplayEnum.AMOUNT:
                return this.renderAmount();
            case DisplayEnum.PICK_ONE:
                return this.renderChoices();
            case DisplayEnum.REQ_EFF:
                return this.renderReqEff();
            case DisplayEnum.EFF:
                return this.renderEff();
            case DisplayEnum.AMOUNT_EFF:
                return this.renderAmountEff();
            case DisplayEnum.NONE:
                return null;
            case DisplayEnum.NAME:
                return this.renderName();
            case DisplayEnum.NORMAL:
            default:
                return this.renderNormal();
        }
    }
    private renderName = () => {
        const { amount } = this.props.effect;
        return <input type="text" value={amount} onChange={this.changeAmount} />
    }
    private renderNormal = () => {
        const { player, amount, axis } = this.props.effect;
        return <span>
            <select className="form-control" id="affects" onChange={this.changePlayer} value={player}>
                <option value={undefined}> No Player </option>
                <option value={PlayerEnum.OPPONENT}> ↑ </option>
                <option value={PlayerEnum.PLAYER}> ↓ </option>
                <option value={PlayerEnum.BOTH}> ↕ </option>
            </select>
            <select className="form-control" id="axis" onChange={this.changeAxis} value={axis}>
                <option value={undefined}> No Axis </option>
                {Object.keys(AxisEnum).map((key) => <option value={AxisEnum[key]} key={key}> {AxisEnum[key]}</option>)}
            </select>
            <input type="number" value={amount} onChange={this.changeAmount} />
        </span>
    }
    private renderAmount = () => {
        const { amount } = this.props.effect;
        return <input type="number" value={amount} onChange={this.changeAmount} />
    }
    private renderChoices = () => {
        const { choices = [] } = this.props.effect;
        return <div className="ml-5">
            <div>
                Choices:
            <button className="btn btn-sm btn-primary" onClick={this.addChoice}> + </button>
                <div>
                    {choices.map((choice, choiceIndex) => <div key={getUUID(choice)}>
                        <button className="btn btn-danger btn-sm" onClick={(e) => this.removeChoice(e, choiceIndex)}> - </button>
                        <button className="btn btn-primary btn-sm" onClick={(e) => this.addChoiceMech(e, choiceIndex)}> + </button>
                        {choice.map((mech, mechIndex) => <div className='ml-5' key={getUUID(mech)}>
                            <button className="btn btn-danger btn-sm" onClick={(e) => this.removeChoiceMech(e, choiceIndex, mechIndex)}> - </button>
                            <Effect effect={mech} update={(state: Mechanic, mechindex: number) => this.updateChoice(state, choiceIndex, mechindex)} index={mechIndex} />
                        </div>)}
                    </div>)}
                </div>
            </div>
        </div>
    }
    private renderEff = () => {
        const { mechanicEffects: effs = [] } = this.props.effect;
        return <div className="ml-5">
            <div>
                Effects:
            <button className="btn btn-sm btn-primary" onClick={this.addEffect}> + </button>
                <div>
                    {effs.map((eff, i) => <div key={getUUID(eff)}>
                        <button className="btn btn-danger btn-sm" onClick={(e) => this.removeEffect(e, i)}> - </button>
                        <Effect effect={eff} update={this.updateEffect} index={i} />
                    </div>)}
                </div>
            </div>
        </div>
    }
    private renderAmountEff = () => {
        const { mechanicEffects: effs = [], amount} = this.props.effect;
        return <div className="ml-5">
            <div>
                Amount: <input type="number" value={amount} onChange={this.changeAmount} />
            </div>
            <div>
                Effects:
            <button className="btn btn-sm btn-primary" onClick={this.addEffect}> + </button>
                <div>
                    {effs.map((eff, i) => <div key={getUUID(eff)}>
                        <button className="btn btn-danger btn-sm" onClick={(e) => this.removeEffect(e, i)}> - </button>
                        <Effect effect={eff} update={this.updateEffect} index={i} />
                    </div>)}
                </div>
            </div>
        </div>
    }
    private renderReqEff = () => {
        const { mechanicEffects: effs = [], mechanicRequirements: reqs = [] } = this.props.effect;
        return <div className="ml-5">
            <div> Requirements:
            <button className="btn btn-sm btn-primary" onClick={this.addRequirement}> + </button>
                <div>
                    {reqs.map((req, i) => <div key={getUUID(req)}>
                        <button className="btn btn-danger btn-sm" onClick={(e) => this.removeRequirement(e, i)}> - </button>
                        <Requirement requirement={req} update={this.updateRequirement} index={i} />
                    </div>)}
                </div>
            </div>
            <div>
                Effects:
            <button className="btn btn-sm btn-primary" onClick={this.addEffect}> + </button>
                <div>
                    {effs.map((eff, i) => <div key={getUUID(eff)}>
                        <button className="btn btn-danger btn-sm" onClick={(e) => this.removeEffect(e, i)}> - </button>
                        <Effect effect={eff} update={this.updateEffect} index={i} />
                    </div>)}
                </div>
            </div>
        </div>
    }
    private addChoice = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const effect = { ...this.props.effect };
        const choices = effect.choices || [];
        effect.choices = [...choices, []];
        this.props.update(effect, this.props.index);
    }
    private addChoiceMech = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        const effect = { ...this.props.effect };
        let choices = effect.choices || [];
        let choice = choices[index] || [];
        choice = [...choice, {}];
        choices = [...choices];
        choices[index] = choice;
        effect.choices = choices;
        this.props.update(effect, this.props.index);
    }
    private addEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const effect = { ...this.props.effect };
        const effectArray = effect.mechanicEffects || [];
        effect.mechanicEffects = [...effectArray, {}]
        this.props.update(effect, this.props.index);
    }
    private addRequirement = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const effect = { ...this.props.effect };
        const reqArray = effect.mechanicRequirements || [];
        effect.mechanicRequirements = [...reqArray, {
            axis: AxisEnum.CLOSE,
            player: PlayerEnum.OPPONENT,
        }]
        this.props.update(effect, this.props.index);
    }
    private removeChoice = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const effect = { ...this.props.effect };
        e.preventDefault();
        effect.choices = effect.choices || [];
        effect.choices = effect.choices.filter((_, i) => i !== index);
        this.props.update(effect, this.props.index);
    }
    private removeChoiceMech = (e: React.MouseEvent<HTMLButtonElement>, choiceIndex: number, mechIndex: number) => {
        const effect = { ...this.props.effect };
        e.preventDefault();
        let choices = effect.choices || [];
        choices = [...choices];
        let choice = choices[choiceIndex] || [];
        choice = choice.filter((_, i) => i !== mechIndex);
        choices[choiceIndex] = choice;
        effect.choices = choices;
        this.props.update(effect, this.props.index);
    }
    private removeEffect = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const effect = { ...this.props.effect };
        e.preventDefault();
        effect.mechanicEffects = effect.mechanicEffects || [];
        effect.mechanicEffects = effect.mechanicEffects.filter((_, i) => i !== index);
        this.props.update(effect, this.props.index);
    }
    private removeRequirement = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        const effect = { ...this.props.effect };
        e.preventDefault();
        effect.mechanicRequirements = effect.mechanicRequirements || [];
        effect.mechanicRequirements = effect.mechanicRequirements.filter((_, i) => i !== index);
        this.props.update(effect, this.props.index);
    }
    private changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const effect = { ...this.props.effect };
        if (!isNaN(Number(e.target.value))) {
            effect.amount = e.target.valueAsNumber
        } else {
            effect.amount = e.target.value;
        }
        this.props.update(effect, this.props.index);
    }
    private changeMechanic = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const effect = { ...this.props.effect };
        effect.mechanic = e.target.value as MechanicEnum;
        this.props.update(effect, this.props.index);
    }
    private changePlayer = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const effect = { ...this.props.effect };
        effect.player = Number(e.target.value);
        this.props.update(effect, this.props.index);
    }
    private changeAxis = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const effect = { ...this.props.effect };
        effect.axis = e.target.value as AxisEnum;
        this.props.update(effect, this.props.index);
    }
    private updateRequirement = (state: StatePiece, index: number) => {
        const effect = { ...this.props.effect };
        const mechanicRequirements = effect.mechanicRequirements;
        if (mechanicRequirements === undefined) {
            return;
        }
        const reqs = [...mechanicRequirements];
        reqs[index] = state;
        effect.mechanicRequirements = reqs;
        this.props.update(effect, this.props.index);
    }
    private updateChoice = (state: Mechanic, choiceIndex: number, mechIndex: number) => {
        const effect = { ...this.props.effect };
        let choices = effect.choices || [];
        choices = [...choices];
        let choice = choices[choiceIndex] || [];
        choice = [...choice]
        choice[mechIndex] = state;
        choices[choiceIndex] = choice;
        effect.choices = choices;
        this.props.update(effect, this.props.index);
    }
    private updateEffect = (state: Mechanic, index: number) => {
        const effect = { ...this.props.effect };
        const { mechanicEffects } = effect;
        if (mechanicEffects === undefined) {
            return;
        }
        const mecEff = [...mechanicEffects];
        mecEff[index] = state;
        effect.mechanicEffects = mecEff;
        this.props.update(effect, this.props.index);
    }
}