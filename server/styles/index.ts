import { grappleStyle } from './grappler';
import { FightingStyle } from './interfaces';
import { cards } from '../cards/Cards';
import { cheapShotStyle } from './cheapShot';
import { crowdPleaserStyle } from './crowdPleaser';
import { deathFromAboveStyle } from './deathFromAbove';
import { finesseStyle } from './finesse';
import { hunterStyle } from './hunter';
import { immovableStyle } from './immovable';
import { jesterStyle } from './jester';
import { kobraKaiStyle } from './kobraKai';
import { mastermindStyle } from './mastermind';
import { retiariusStyle } from './retiarius';
import { seeingRedStyle } from './seeingRed';
import { toolsOfTheTradeStyle } from './toolsOfTheTrade';
import { unstoppableStyle } from './unstoppable';

const allStyles: FightingStyle[] = [
    grappleStyle,
    cheapShotStyle,
    crowdPleaserStyle,
    deathFromAboveStyle,
    finesseStyle,
    hunterStyle,
    immovableStyle,
    jesterStyle,
    kobraKaiStyle,
    mastermindStyle,
    retiariusStyle,
    seeingRedStyle,
    toolsOfTheTradeStyle,
    unstoppableStyle
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