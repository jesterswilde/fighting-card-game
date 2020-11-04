"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grappler_1 = require("./styles/grappler");
const cheapShot_1 = require("./styles/cheapShot");
const crowdPleaser_1 = require("./styles/crowdPleaser");
const deathFromAbove_1 = require("./styles/deathFromAbove");
const finesse_1 = require("./styles/finesse");
const hunter_1 = require("./styles/hunter");
const immovable_1 = require("./styles/immovable");
const jester_1 = require("./styles/jester");
const kobraKai_1 = require("./styles/kobraKai");
const mastermind_1 = require("./styles/mastermind");
const netAndTrident_1 = require("./styles/netAndTrident");
const seeingRed_1 = require("./styles/seeingRed");
const toolsOfTheTrade_1 = require("./styles/toolsOfTheTrade");
const unstoppable_1 = require("./styles/unstoppable");
const allIn_1 = require("./styles/allIn");
const monk_1 = require("./styles/monk");
const rogue_1 = require("./styles/rogue");
const ropeADope_1 = require("./styles/ropeADope");
const workTheBody_1 = require("./styles/workTheBody");
const generic_1 = require("./styles/generic");
const barbarian_1 = require("./styles/barbarian");
const util_1 = require("../gameServer/util");
const drunkenMaster_1 = require("./styles/drunkenMaster");
const teststyle_1 = require("./teststyle");
const allStyles = [
    teststyle_1.testStyle,
    grappler_1.grappleStyle,
    cheapShot_1.cheapShotStyle,
    crowdPleaser_1.crowdPleaserStyle,
    deathFromAbove_1.deathFromAboveStyle,
    finesse_1.finesseStyle,
    hunter_1.hunterStyle,
    immovable_1.immovableStyle,
    jester_1.jesterStyle,
    kobraKai_1.kobraKaiStyle,
    mastermind_1.mastermindStyle,
    netAndTrident_1.netAndTridentStyle,
    seeingRed_1.seeingRedStyle,
    toolsOfTheTrade_1.toolsOfTheTradeStyle,
    unstoppable_1.unstoppableStyle,
    drunkenMaster_1.drunkenStyle,
    allIn_1.AllInStyle,
    monk_1.monkStyle,
    rogue_1.rogueStyle,
    ropeADope_1.ropeADopeStyle,
    workTheBody_1.workTheBodyStyle,
    barbarian_1.barbarianStyle,
    generic_1.genericStyle
];
const fightingStylesObj = {};
allStyles.forEach(style => {
    fightingStylesObj[style.name] = style;
});
exports.getAllFightingStylesArr = () => {
    return util_1.deepCopy(allStyles);
};
exports.getFightingStyles = () => {
    return allStyles.map(({ name, description, isGeneric, strengths, identity, mainMechanics, cards }) => ({
        name,
        cards,
        description,
        isGeneric,
        strengths,
        mainMechanics,
        identity
    }));
};
exports.getFightingStyleByName = (styleName) => {
    const style = fightingStylesObj[styleName];
    if (style) {
        return style;
    }
    return null;
};
