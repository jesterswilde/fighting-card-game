import { h, Component } from 'preact';
import { EventState, EventAction, EventTypeEnum, EVENT_PLAY_SPEED, HappensEnum } from '../../events/interface';
import { StoreState } from '../../state/store';
import { connect } from 'preact-redux';
import { Arrow, Icon } from '../../images'
import { dispatchFinishedDisplayingEvents } from '../../events/dispatch';
import { getLosingMessage, getBothLoseMessage, getWinningMessage } from '../../extras/gameOverMessages'

interface Props extends EventState {
    player: number
}

interface State {
    counter: number,
    events: EventAction[],
    startingEvents: EventAction[],
    cancelTimeout?: NodeJS.Timeout
}

const selector = (state: StoreState): Props => {
    return { ...state.events, player: state.game.player }
}

class Events extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.state = {
            events: [],
            counter: 0,
            startingEvents: props.events
        }
        this.addEvent();
    }
    addEvent = () => {
        const { counter, events } = this.state;
        if (counter < this.props.events.length) {
            const cancelTimeout = setTimeout(() => {
                this.addEvent();
            }, this.props.playSpeed || EVENT_PLAY_SPEED);
            this.setState({ cancelTimeout, events: [...events, this.props.events[counter]], counter: counter + 1 })
        }
    }
    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.events !== this.state.startingEvents) {
            if (this.state.cancelTimeout) {
                clearTimeout(this.state.cancelTimeout);
            }
            this.setState({
                startingEvents: nextProps.events,
                events: [],
                counter: 0
            })
            setTimeout(() => {
                this.addEvent();
            }, EVENT_PLAY_SPEED);
        }
    }
    render() {
        const { events = [] } = this.state;
        return <div class='event-modal'>
            <div class='event-background' onClick={dispatchFinishedDisplayingEvents} />
            <div class='event-container'>
                {events.map((event, i) => {
                    return <div class="event" key={JSON.stringify(event) + i}>
                        {this.reducer(event)}
                    </div>
                })}
            </div>
        </div>
    }
    reducer = (event: EventAction, opponent?: boolean) => {
        if (event === null) return null;
        switch (event.type) {
            case EventTypeEnum.CARD_NAME:
                return this.renderCard(event, opponent);
            case EventTypeEnum.EFFECT:
                return this.renderEffect(event, opponent);
            case EventTypeEnum.MECHANIC:
                return this.renderMechanic(event, opponent);
            case EventTypeEnum.ADDED_MECHANIC:
                return this.renderAddedMechanic(event, opponent);
            case EventTypeEnum.REVEAL_PREDICTION:
                return this.renderRevealPrediction(event, opponent);
            case EventTypeEnum.GAME_OVER:
                return this.renderGameOver(event);
            case EventTypeEnum.EVENT_SECTION:
                return this.renderEventSection(event);
            case EventTypeEnum.CARD_NAME_SECTION:
                return this.renderCardNameSection(event);
            default: return null;
        }
    }
    renderGameOver = (event: EventAction) => {
        const lost = event.winner !== this.props.player;
        if (event.winner < 0) {
            return <div class='event-game-over opponent'>
                Everybody Loses!
                <div class="note">{getBothLoseMessage()}</div>
            </div>
        }
        if (lost) {
            return <div class='event-game-over opponent'>
                You Lose!
                <div class="note">{getLosingMessage()}</div>
            </div>
        }
        return <div class='event-game-over'>
            You Win!
            <div class="note">{getWinningMessage()}</div>
        </div>

    }
    renderAddedMechanic = (event: EventAction, opponent: boolean) => {
        return <div class={`event-effect ${opponent ? 'opponent' : ''}`}>
            Added: {event.mechanicName}
        </div>
    }
    renderRevealPrediction = (event: EventAction, opponent: boolean) => {
        const { prediction, correct, correctGuesses = [] } = event;
        return <div class={`event-predict ${opponent ? 'opponent' : ''}`}>
            <div>
                Prediction: {prediction} <div class='inline small'>{correct ? 'Correct' : 'Incorrect'}</div>
            </div>
            <div class="changed">
                {'Correct Prediction(s): '}
                {correctGuesses.map((guess, i) => <div key={i} class='inline'> {guess} </div>)}
            </div>
        </div>
    }
    renderCard = (event: EventAction, opponent: boolean) => {
        return <div class={`event-card ${opponent ? 'opponent' : ''}`}> <div/><div>{event.cardName}</div> <div class='priority'>{event.priority}</div> </div>
    }
    renderEffect = (event: EventAction, opponent: boolean) => {
        const { player, axis, mechanic, amount } = event.effect;
        const { happenedTo = [] } = event;
        const blocked = happenedTo.some((value)=> value === HappensEnum.BLOCKED)? 'blocked' : ''; 
        return <div class={`event-effect ${opponent ? 'opponent' : ''} ${blocked}`}>
            {mechanic !== undefined && mechanic}
            {mechanic !== undefined && ' '}
            {player !== undefined && <Arrow player={player} shouldFlip={opponent} />}
            {axis !== undefined && <Icon name={axis} />}
            {axis !== undefined && ' '}
            {amount !== undefined && amount}
        </div>
    }
    renderMechanic = (event: EventAction, opponent: boolean) => {
        return <div class={`event-mechanic ${opponent ? 'opponent' : ''}`}>
            {event.cardName}: {event.mechanicName}
        </div>
    }
    renderEventSection = (eventSection: EventAction) => {
        return <div class='event-section'>
            {eventSection.events.map((playerEvent, playerIndex) => {
                return <div class='players-events' key={playerIndex}>
                    {playerEvent.events.map((event) => {
                        if (event === null) {
                            return <div />
                        }
                        const opponent = event.playedBy !== this.props.player;
                        return this.reducer(event, opponent)
                    })}
                </div>
            })}
        </div>
    }
    renderCardNameSection = (eventSection: EventAction) => {
        return <div class='event-section'>
            {eventSection.events.map((cardEvent, playerIndex) => {
                if (cardEvent) {
                    const opponent = cardEvent.playedBy !== this.props.player;
                    return <div class="card-names">{this.renderCard(cardEvent, opponent)}</div>
                }
                return <div class='card-names' key={playerIndex} />
            })}
        </div>
    }
}



export default connect(selector)(Events) as unknown as () => JSX.Element; 