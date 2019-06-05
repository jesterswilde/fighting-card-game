import { h, Component } from 'preact';
import { FightingStyleDescription } from '../../fightingStyles/interface';
import { EditingDeck } from '../../deckBuilder/interface';
import { dispatchDEToggleStyle } from '../../deckBuilder/dispatchEditDeck';
import { dispatchViewStyleFromDeck } from '../../fightingStyles/dispatch';
import { dispatchShowingUnusedStyles } from '../../deckBuilder/dispatch';

interface Props {
    unselectedStyles: FightingStyleDescription[]
    selectedStyles: FightingStyleDescription[]
    chosenStylesObj: { [style: string]: boolean }
    stylesUsed: number,
    showingUnusedStyles: boolean,
}

interface ExternalProps {
    deck: EditingDeck,
    allStyles: FightingStyleDescription[],
    showingUnusedStyles: boolean
}



class StyleList extends Component<Props>{
    constructor(props) {
        super(props);
    }
    checkStyle(e: Event, style: string) {
        const el = e.target as HTMLInputElement;
        const checked = el.checked
        dispatchDEToggleStyle(style, checked);
    }
    render({ showingUnusedStyles, unselectedStyles, selectedStyles, stylesUsed }: Props) {
        const showing = showingUnusedStyles ? "hide" : "show";
        return <div class="style-container">
            <div class="section">
                <h2> Chosen Styles:  {selectedStyles.length}/3</h2>
                <div class="style-list">
                    {selectedStyles.map((style) => {
                        return this.RenderStyle({isChecked: true, style })
                    })}
                </div>
            </div>
            <div class="section">
                <div class="unused-styles">
                    <h3>Unused Styles:</h3>
                    <button class="btn" onClick={() => dispatchShowingUnusedStyles(!showingUnusedStyles)}>{showing}</button>
                </div>
                <div class="style-list">
                    {showingUnusedStyles &&
                        unselectedStyles.map((style) => {
                            const isDisabled = stylesUsed >= 3;
                            return this.RenderStyle({ isChecked: false, isDisabled, style })
                        })}
                </div>
            </div>
        </div>
    }
    RenderStyle({ isChecked, isDisabled, style }: {isChecked: boolean, isDisabled?: boolean, style: FightingStyleDescription }) {
        return <div
            class={`style-item${isDisabled ? ' disabled' : ''}${isChecked ? ' active' : ''}`} key={style.name}
            onClick={() => {
                if (!isDisabled) {
                    dispatchDEToggleStyle(style.name, !isChecked);
                }
            }}
        >
            <div class="style-title">
                <div> {style.name} </div>
                <button class="view-button btn" onClick={(e) => {
                    e.stopPropagation();
                    dispatchViewStyleFromDeck(style.name);
                }}>
                    View
                 </button>
            </div>
            <div class="style-description"> {style.description}</div>
        </div>
    }
}




export default ({ deck, allStyles = [], showingUnusedStyles }: ExternalProps) => {
    const chosenStyles = deck.styles.reduce((obj, name) => {
        obj[name] = true;
        return obj;
    }, {})
    const selectedStyles: FightingStyleDescription[] = [];
    const unselectedStyles: FightingStyleDescription[] = [];
    allStyles.forEach((style) => {
        if (chosenStyles[style.name]) {
            selectedStyles.push(style);
        } else {
            unselectedStyles.push(style);
        }
    })
    const props: Props = {
        unselectedStyles,
        selectedStyles,
        chosenStylesObj: chosenStyles,
        stylesUsed: deck.styles.length,
        showingUnusedStyles
    }
    //@ts-ignore
    return <StyleList {...props} />
}