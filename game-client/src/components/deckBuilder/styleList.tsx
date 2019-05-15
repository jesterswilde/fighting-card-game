import { h, Component } from 'preact';
import { FightingStyleDescription } from '../../fightingStyles/interface';
import { bind } from 'decko'
import { EditingDeck } from '../../deckBuilder/interfaces';
import { dispatchDEToggleStyle } from '../../deckBuilder/dispatch';

interface Props {
    styles: FightingStyleDescription[]
    chosenStyles: { [style: string]: boolean }
    stylesUsed: number
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
    render({ styles }: Props, { expandedStyles }: State) {
        return <div class="style-list">
            {styles.map((style) => {
                const isExpanded = expandedStyles[style.name];
                const expandDisplay = isExpanded ? 'v' : '>';
                return <div class="style-item" key={style.name}>
                    <div class="expander" onClick={() => this.expandStyle(style.name)}> {expandDisplay} </div>
                    <input type="checkbox" checked={isExpanded} onChange={(e) => this.checkStyle(e, style.name)} />
                    <div class="style-title"> {style.name} </div>
                    {isExpanded && <div class="expander"> {style.description}</div>}
                </div>
            })}
        </div>
    }
}


export default ({ deck, styles }: { deck: EditingDeck, styles: FightingStyleDescription[] }) => {
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