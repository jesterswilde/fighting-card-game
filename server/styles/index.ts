import { grappleStyle } from './grappler';
import { FightingStyle, FullFightingStyle } from './interfaces';
import { allCards } from '../cards/Cards';
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
import { genericStyle } from './generic';

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
    unstoppableStyle,
    genericStyle
]

const fightingStylesObj = {};

allStyles.forEach((style) => {
    fightingStylesObj[style.name] = style;
})

export const getFightingStyles = () => {
    return allStyles.map(({ name, description, isGeneric }) => ({ name, description, isGeneric }));
}

export const getFightingStyleByName = (styleName: string): FightingStyle | null => {
    const style = fightingStylesObj[styleName];
    if (style) {
        return style;
    }
    return null;
}

export const getFullFightingStyleByName = (styleName: string): FullFightingStyle => {
    const style = fightingStylesObj[styleName];
    if (style) {
        return {
            ...style,
            cards: style.cards.map((cardName) => allCards[cardName] ? allCards[cardName] : null)
        }
    }
    return null;
}