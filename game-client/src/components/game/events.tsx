import { h, Component } from 'preact';
import { EventState, EventAction, EventTypeEnum } from '../../events/interface';
import { StoreState } from '../../state/store';
import { connect } from 'preact-redux';
import { Arrow, Icon } from '../../images'
import { dispatchFinishedDisplayingEvents } from '../../events/dispatch';
import {getLosingMessage, getBothLoseMessage, getWinningMessage} from '../../extras/gameOverMessages'

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
                        {this.reducer(event, this.props.player)}
                    </div>
                })}
            </div>
        </div>
    }
    reducer = (event: EventAction, player: number) => {
        const opponent = event.playedBy !== this.props.player;
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
                return this.renderGameOver(event, player)
            default: return null;
        }
    }
    renderGameOver = (event: EventAction, player: number) => {
        const lost = event.winner !== player;
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
        return <div class={`event-card ${opponent ? 'opponent' : ''}`}> {event.cardName} </div>
    }
    renderEffect = (event: EventAction, opponent: boolean) => {
        const { player, axis, mechanic, amount } = event.effect;
        return <div class={`event-effect ${opponent ? 'opponent' : ''}`}>
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
}



export default connect(selector)(Events) as unknown as () => JSX.Element; 