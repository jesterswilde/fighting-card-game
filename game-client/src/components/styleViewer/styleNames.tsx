import { h } from 'preact';
import { FightingStyleDescription } from '../../fightingStyles/interface';

interface Props {
    styles: FightingStyleDescription[],
    isLoading: boolean,
    chooseStyle: (name: string) => void
}

export default ({ styles = [], isLoading, chooseStyle }: Props) => {
    if (isLoading) {
        return <div>
            Loading Deck list...
        </div>
    }
    return <div class='container mt-3'>
        <h1 class='mb-3 mt-3'>Choose Deck</h1>
        {styles.map((style, i) => (
            <div key={style.name} class="mb-3 ml-2 deck-choice" onClick={() => chooseStyle(style.name)}>
                <h3>{style.name}</h3>
                <div class='ml-2'>{style.description}</div>
            </div>
        ))}
    </div>
}