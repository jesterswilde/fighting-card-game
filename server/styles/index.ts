import { grappleStyle } from './grappler';
import { FightingStyle } from './interfaces';
import { cards } from '../cards/Cards';

const allStyles: FightingStyle[] = [
    grappleStyle,
]

export const getFightingStyles = () => {
    return allStyles.map(({ name, description, identity, strengths }) => ({ name, description }));
}

export const getFightingStyleByName = (styleName: string) => {
    const style = allStyles.find(({ name }) => name === styleName);
    if (style) {
        return {
            ...style,
            cards: style.cards.map((cardName) => cards[cardName] ? cards[cardName] : null)
        }
    }
    return null;
}