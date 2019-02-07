import { h, Component } from 'preact';
import { EventState, EventAction, EventTypeEnum } from '../../events/interface';
import { StoreState } from '../../state/store';
import { connect } from 'preact-redux';
import { Arrow, Icon } from '../../images'
import { dispatchFinishedDisplayingEvents } from '../../events/dispatch';
import { JsxElement } from 'typescript';

interface Props extends EventState {
    player: number
}

interface State {
    counter: number,
    events: EventAction[],
}

const selector = (state: StoreState): Props => {
    return { ...state.events, player: state.game.player }
}

class Events extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            events: [],
            counter: 0
        }
        this.addEvent();
    }
    timer = 500;
    addEvent = () => {
        const { counter, events } = this.state;
        if (counter < this.props.events.length) {
            this.setState({ events: [...events, this.props.events[counter]], counter: counter + 1 })
            setTimeout(() => {
                this.addEvent();
            }, this.timer);
        }
    }
    render() {
        const { events = [] } = this.state;
        return <div class='event-modal'>
            <div class='event-background' onClick={dispatchFinishedDisplayingEvents} />
            <div class='event-container'>
                {events.map((event) => {
                    return <div class="event" key={JSON.stringify(event)}>
                        {this.reducer(event)}
                    </div>
                })}
            </div>
        </div>
    }
    reducer = (event: EventAction) => {
        switch (event.type) {
            case EventTypeEnum.CARD_NAME:
                return this.renderCard(event);
            case EventTypeEnum.EFFECT:
                return this.renderEffect(event);
            case EventTypeEnum.MECHANIC:
                return this.renderMechanic(event);
            default: return null;
        }
    }
    renderCard = (event: EventAction) => {
        const opponent = event.playedBy !== this.props.player;
        return <div class={`event-card ${opponent ? 'opponent' : ''}`}> {event.cardName} </div>
    }
    renderEffect = (event: EventAction) => {
        const { player, axis, mechanic, amount } = event.effect;
        const opponent = event.playedBy !== this.props.player;
        return <div class={`event-effect ${opponent ? 'opponent' : ''}`}>
            {mechanic}
            {player !== undefined && <Arrow player={player} shouldFlip={opponent} />}
            {axis !== undefined && <Icon name={axis} />} 
            {amount}
        </div>
    }
    renderMechanic = (event: EventAction) => {
        const opponent = event.playedBy !== this.props.player;
        return <div class={`event-mechanic ${opponent ? 'opponent' : ''}`}>
            {event.cardName}: {event.mechanicName}
        </div>
    }
}



export default connect(selector)(Events); 