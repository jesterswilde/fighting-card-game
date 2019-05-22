import { h, Component } from 'preact';
import { FightingStyleDescription } from '../../fightingStyles/interface';
import { bind } from 'decko'
import { EditingDeck } from '../../deckBuilder/interface';
import { dispatchDEToggleStyle } from '../../deckBuilder/dispatchEditDeck';

interface Props {
    styles: FightingStyleDescription[]
    chosenStyles: { [style: string]: boolean }
    stylesUsed: number
}

interface ExternalProps {
    deck: EditingDeck,
    styles: FightingStyleDescription[]
}

interface State {
    expandedStyles: { [name: string]: boolean }
}


class StyleList extends Component<Props, State>{
    constructor(props) {
        super(props);
        this.state = {
            expandedStyles: {}
        }
    }
    @bind
    expandStyle(styleName: string) {
        const expanded = !this.state.expandedStyles[styleName]
        this.setState({ expandedStyles: { [styleName]: expanded } })
    }
    checkStyle(e: Event, style: string) {
        const el = e.target as HTMLInputElement;
        const checked = el.checked
        dispatchDEToggleStyle(style, checked);
    }
    render({ styles, chosenStyles, stylesUsed }: Props, { expandedStyles }: State) {
        return <div class="style-list">
            <h3>Styles</h3>
            {styles.map((style) => {
                const isChecked = chosenStyles[style.name];
                const isDisabled = !isChecked && stylesUsed >= 3;  
                const isExpanded = expandedStyles[style.name];
                const expandDisplay = isExpanded ? 'v' : '>';
                return <div class="style-item" key={style.name}>
                    <div class="style-title">
                        <div class="expander" onClick={() => this.expandStyle(style.name)}> {expandDisplay} </div>
                        <input type="checkbox" disabled={isDisabled} checked={isChecked} onChange={(e) => this.checkStyle(e, style.name)} />
                        <div> {style.name} </div>
                    </div>
                    {isExpanded && <div class="expander"> {style.description}</div>}
                </div>
            })}
        </div>
    }
}


export default ({ deck, styles }: ExternalProps) => {
    const chosenStyles = deck.styles.reduce((obj, name) => {
        obj[name] = true;
        return obj;
    }, {})
    const props: Props = {
        styles,
        chosenStyles,
        stylesUsed: deck.styles.length
    }
    //@ts-ignore
    return <StyleList {...props} />
}