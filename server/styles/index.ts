import { grappleStyle } from "./styles/grappler";
import { FightingStyle, FullFightingStyle } from "./interfaces";
import { cheapShotStyle } from "./styles/cheapShot";
import { crowdPleaserStyle } from "./styles/crowdPleaser";
import { deathFromAboveStyle } from "./styles/deathFromAbove";
import { finesseStyle } from "./styles/finesse";
import { hunterStyle } from "./styles/hunter";
import { immovableStyle } from "./styles/immovable";
import { jesterStyle } from "./styles/jester";
import { kobraKaiStyle } from "./styles/kobraKai";
import { mastermindStyle } from "./styles/mastermind";
import { netAndTridentStyle } from "./styles/netAndTrident";
import { seeingRedStyle } from "./styles/seeingRed";
import { toolsOfTheTradeStyle } from "./styles/toolsOfTheTrade";
import { unstoppableStyle } from "./styles/unstoppable";
import { AllInStyle } from "./styles/allIn";
import { monkStyle } from "./styles/monk";
import { rogueStyle } from "./styles/rogue";
import { ropeADopeStyle } from "./styles/ropeADope";
import { workTheBodyStyle } from "./styles/workTheBody";
import { genericStyle } from "./styles/generic";
import { barbarianStyle } from "./styles/barbarian";
import { deepCopy } from "../gameServer/util";
import { drunkenStyle } from "./styles/drunkenMaster";
import { testStyle } from "./teststyle"; 
const allStyles: FightingStyle[] = [
  testStyle, 
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
  netAndTridentStyle,
  seeingRedStyle,
  toolsOfTheTradeStyle,
  unstoppableStyle,
  drunkenStyle,
  AllInStyle,
  monkStyle,
  rogueStyle,
  ropeADopeStyle,
  workTheBodyStyle,
  barbarianStyle,
  genericStyle
];

const fightingStylesObj: {[name: string]: FightingStyle} = {};

allStyles.forEach(style => {
  fightingStylesObj[style.name] = style;
});

export const getAllFightingStylesArr = () => {
  return deepCopy(allStyles);
};

export const getFightingStyles = () => {
  return allStyles.map(
    ({ name, description, isGeneric, strengths, identity, mainMechanics, cards }) => ({
      name,
      cards,
      description,
      isGeneric,
      strengths,
      mainMechanics,
      identity
    })
  );
};

export const getFightingStyleByName = (
  styleName: string
): FightingStyle | null => {
  const style = fightingStylesObj[styleName];
  if (style) {
    return style;
  }
  return null;
};
