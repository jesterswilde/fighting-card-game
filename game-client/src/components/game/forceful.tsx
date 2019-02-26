import { h } from 'preact';
import { Mechanic, Card, AxisEnum, PlayerEnum } from '../../shared/card';
import { StoreState } from '../../state/store';
import HandCard from './card/handCard'
import { cleanConnect } from '../../util';
import { dispatchDidPickForecful } from '../../game/dispatch';

interface Props {
    cardName: string,
    mechanic: Mechanic
}

const selector = (state: StoreState): Props => {
    return state.game.forceful
}

const forceful = ({ cardName, mechanic }: Props) => {
    const dontUse = makeDontUse();
    const use = makeUse(mechanic);
    return <div>
        <h3> {cardName} use <b>Forceful?</b></h3>
        <div class='card-container'>
            <div class='inline' onClick={()=>dispatchDidPickForecful(false)}>
                <HandCard {...dontUse} />
            </div>
            <div class='card-container' onClick={()=>dispatchDidPickForecful(true)}>
                <HandCard {...use} />
            </div>
        </div>

    </div>
}

const makeDontUse = (): Card => ({
    name: "Don't Use",
    effects: [],
    requirements: [],
    optional: [],
})

const makeUse = (mechanic: Mechanic): Card => {
    return {
        name: 'Use',
        requirements: [],
        effects: [{ axis: AxisEnum.LOSE_POISE, player: PlayerEnum.PLAYER, amount: mechanic.amount }, ...mechanic.mechanicEffects],
        optional: [],
    }
}

export default cleanConnect(selector, forceful);