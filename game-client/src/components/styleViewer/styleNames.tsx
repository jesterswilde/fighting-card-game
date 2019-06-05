import { h } from 'preact';
import { FightingStyleDescription } from '../../fightingStyles/interface';

interface Props {
    styles: FightingStyleDescription[],
    isLoading: boolean,
    chooseStyle: (name: string) => void
}

const description = <div>
    <p>Decks are built out of these styles, three per deck.</p>
    <p>Once you've chosen the styles for a deck, you choose which cards make the cut.</p>
    <p>One card can make a huge difference!</p>
</div>

export default ({ styles = [], isLoading, chooseStyle }: Props) => {
    if (isLoading) {
        return <div>
            { description }
            Loading Deck list...
        </div>
    }
    return <div class='container mt-3'>
        <h1 class='mb-3 mt-3'>Styles</h1>
        { description }
        {styles.map((style, i) => (
            <div key={style.name} class="mb-3 ml-2 deck-choice" onClick={() => chooseStyle(style.name)}>
                <h3>{style.name}</h3>
                <div class='ml-2'>{style.description}</div>
            </div>
        ))}
    </div>
}