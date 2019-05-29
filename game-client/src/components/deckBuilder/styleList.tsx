import { h, Component } from 'preact';
import { FightingStyleDescription } from '../../fightingStyles/interface';
import { bind } from 'decko'
import { EditingDeck } from '../../deckBuilder/interface';
import { dispatchDEToggleStyle } from '../../deckBuilder/dispatchEditDeck';
import { dispatchViewStyleFromDeck } from '../../fightingStyles/dispatch';

interface Props {
    unselectedStyles: FightingStyleDescription[]
    selectedStyles: FightingStyleDescription[]
    chosenStylesObj: { [style: string]: boolean }
    stylesUsed: number
}

interface ExternalProps {
    deck: EditingDeck,
    allStyles: FightingStyleDescription[]
}

interface State {
    expandedStyles: { [name: string]: boolean }
    showingStyles: boolean
}


class StyleList extends Component<Props, State>{
    constructor(props) {
        super(props);
        this.state = {
            showingStyles: false,
            expandedStyles: {}
        }
    }
    @bind
    toggleShowStyle() {
        this.setState({ showingStyles: !this.state.showingStyles })
    }
    @bind
    expandStyle(styleName: string, value?: boolean) {
        let expanded: boolean;
        if (value === undefined) {
            expanded = !this.state.expandedStyles[styleName]
        } else {
            expanded = value;
            this.state.expandedStyles[styleName] = expanded;
        }
        this.setState({ expandedStyles: { [styleName]: expanded } })
    }
    checkStyle(e: Event, style: string) {
        const el = e.target as HTMLInputElement;
        const checked = el.checked
        dispatchDEToggleStyle(style, checked);
    }
    render({ unselectedStyles, selectedStyles, stylesUsed }: Props, { showingStyles, expandedStyles }: State) {
        const showing = showingStyles ? "hide" : "show";
        return <div class="style-container">
            <div class="section">
                <h2> Chosen Styles:  {selectedStyles.length}/3</h2>
                <div class="style-list">
                    {selectedStyles.map((style) => {
                        const isExpanded = expandedStyles[style.name];
                        return this.RenderStyle({ isExpanded, isChecked: true, style })
                    })}
                </div>
            </div>
            <div class="section">
                <div class="unused-styles">
                    <h3>Unused Styles:</h3>
                    <button class="btn" onClick={this.toggleShowStyle}>{showing}</button>
                </div>
                <div class="style-list">
                    {showingStyles &&
                        unselectedStyles.map((style) => {
                            const isDisabled = stylesUsed >= 3;
                            const isExpanded = expandedStyles[style.name];
                            return this.RenderStyle({ isExpanded, isChecked: false, isDisabled, style })
                        })}
                </div>
            </div>
        </div>
    }
    RenderStyle({ isChecked, isDisabled, style }: { isExpanded: boolean, isChecked: boolean, isDisabled?: boolean, style: FightingStyleDescription }) {
        return <div
            class={`style-item${isDisabled ? ' disabled' : ''}${isChecked ? ' active' : ''}`} key={style.name}
            onMouseEnter={() => this.expandStyle(style.name, true)}
            onMouseLeave={() => this.expandStyle(style.name, false)}
            onClick={() => {
                if (!isDisabled) {
                    dispatchDEToggleStyle(style.name, !isChecked);
                }
            }}
        >
            <div class="style-title">
                <div> {style.name} </div>
                <button class="view-button btn" onClick={() => dispatchViewStyleFromDeck(style.name)}>
                    View
                 </button>
            </div>
            <div class="style-description"> {style.description}</div>
        </div>
    }
}




export default ({ deck, allStyles = [] }: ExternalProps) => {
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
        stylesUsed: deck.styles.length
    }
    //@ts-ignore
    return <StyleList {...props} />
}