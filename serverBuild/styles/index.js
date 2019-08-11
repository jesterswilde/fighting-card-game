"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grappler_1 = require("./grappler");
const Cards_1 = require("../cards/Cards");
const cheapShot_1 = require("./cheapShot");
const crowdPleaser_1 = require("./crowdPleaser");
const deathFromAbove_1 = require("./deathFromAbove");
const finesse_1 = require("./finesse");
const hunter_1 = require("./hunter");
const immovable_1 = require("./immovable");
const jester_1 = require("./jester");
const kobraKai_1 = require("./kobraKai");
const mastermind_1 = require("./mastermind");
const netAndTrident_1 = require("./netAndTrident");
const seeingRed_1 = require("./seeingRed");
const toolsOfTheTrade_1 = require("./toolsOfTheTrade");
const unstoppable_1 = require("./unstoppable");
const allIn_1 = require("./allIn");
const monk_1 = require("./monk");
const rogue_1 = require("./rogue");
const ropeADope_1 = require("./ropeADope");
const workTheBody_1 = require("./workTheBody");
const generic_1 = require("./generic");
const barbarian_1 = require("./barbarian");
const util_1 = require("../gameServer/util");
const drunkenMaster_1 = require("./drunkenMaster");
const allStyles = [
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
    return allStyles.map(({ name, description, isGeneric, strengths, identity, mainMechanics }) => ({
        name,
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
exports.getFullFightingStyleByName = (styleName) => {
    const style = fightingStylesObj[styleName];
    if (style) {
        return Object.assign({}, style, { cards: style.cards.map(cardName => Cards_1.allCards[cardName] ? Cards_1.allCards[cardName] : null) });
    }
    return null;
};
