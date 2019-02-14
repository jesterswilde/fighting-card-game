import { h } from 'preact';
import { Icon } from '../../../images';
import { AxisEnum } from '../../../interfaces/card';
import { GameState } from '../../../game/interface';

interface Props {
    poise: number
}

interface State extends GameState {
    playerIndex: number
}

const selector = (state: State): Props => {
    return { poise: state.playerStates[state.playerIndex].poise };
}

const Poise = ({ poise }: Props) => {
    const unbalancedArr = [...Array(3).keys()];
    const balancedArr = [...Array(4).keys()].map((key) => key + 3)
    const anticipatingArr = [...Array(3).keys()].map((key) => key + 7);
    return <div class="poise-section">
        <div class={poiseTitleClass(poise)}>Poise: {poiseLevel(poise)}</div>
        <div class="poise-container">
            <div class="unbalanced">
                <div>Unbalanced</div>
                <div class='poise-icon'>
                    {unbalancedArr.map((i) => {
                        const hasPoise = i < poise;
                        return <div class='axis-icon' key={'' + i + hasPoise}><PoiseIcon hasPoise={hasPoise} /></div>
                    })}
                </div>
            </div>
            <div class="balanced"> 
                <div>Balanced</div>
                <div class='poise-icon'>
                    {balancedArr.map((i) => {
                        const hasPoise = i < poise;
                        return <div key={'' + i + hasPoise}><PoiseIcon hasPoise={hasPoise} /></div>
                    })}
                </div>
            </div>
            <div class="anticipating">
                <div>Anticipating</div>
                <div class='poise-icon'>
                    {anticipatingArr.map((i) => {
                        const hasPoise = i < poise;
                        return <div key={'' + i + hasPoise}><PoiseIcon hasPoise={hasPoise} /></div>
                    })}
                </div>
            </div>
        </div>
    </div>
}

const poiseTitleClass = (poise:number)=>{
    return `poise-title ${poiseLevel(poise).toLowerCase()}`
}

const poiseLevel = (poise: number) => {
    if (poise <= 3) return 'Unbalanced';
    if (poise >= 7) return 'Anticipating';
    return 'Balanced';
}

const PoiseIcon = ({ hasPoise }: { hasPoise: boolean }) => {
    if (hasPoise) {
        return <Icon name={AxisEnum.POISE} />
    }
    return <Icon name={AxisEnum.LOSE_POISE} />
}

export default (state: State) => {
    return Poise(selector(state));
}