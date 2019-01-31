"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const cardInterface_1 = require("../interfaces/cardInterface");
const stateInterface_1 = require("../interfaces/stateInterface");
const gameSettings_1 = require("../gameSettings");
const errors_1 = require("../errors");
const effectReducer_1 = require("./effectReducer");
const startTurn_1 = require("./startTurn");
const playCard_1 = require("./playCard");
const applyEffects_1 = require("./applyEffects");
const makeDeck = () => {
    const card1 = util_1.makeBlankCard();
    card1.name = "1";
    card1.requirements.push({
        axis: cardInterface_1.AxisEnum.CLOSE,
        player: cardInterface_1.PlayerEnum.BOTH
    });
    card1.effects.push({
        axis: cardInterface_1.AxisEnum.CLOSE,
        player: cardInterface_1.PlayerEnum.BOTH
    });
    const card2 = util_1.makeBlankCard();
    card2.name = "2";
    card2.requirements.push({
        axis: cardInterface_1.AxisEnum.STANDING,
        player: cardInterface_1.PlayerEnum.PLAYER
    });
    card2.effects.push({
        axis: cardInterface_1.AxisEnum.PRONE,
        player: cardInterface_1.PlayerEnum.PLAYER
    });
    const card3 = util_1.makeBlankCard();
    card3.name = "3";
    card3.requirements.push({
        axis: cardInterface_1.AxisEnum.NOT_FAR,
        player: cardInterface_1.PlayerEnum.BOTH
    });
    card3.effects.push({
        axis: cardInterface_1.AxisEnum.BALANCED,
        player: cardInterface_1.PlayerEnum.PLAYER
    });
    const card4 = util_1.makeBlankCard();
    card4.name = "4";
    card4.requirements.push({
        axis: cardInterface_1.AxisEnum.CLOSE,
        player: cardInterface_1.PlayerEnum.BOTH
    }, {
        axis: cardInterface_1.AxisEnum.UNBALANCED,
        player: cardInterface_1.PlayerEnum.OPPONENT
    });
    card4.effects.push({
        axis: cardInterface_1.AxisEnum.DAMAGE,
        player: cardInterface_1.PlayerEnum.OPPONENT,
        amount: 3
    });
    const card5 = util_1.makeBlankCard();
    card5.name = "5";
    card5.requirements.push({
        axis: cardInterface_1.AxisEnum.MOVING,
        player: cardInterface_1.PlayerEnum.OPPONENT
    });
    card5.effects.push({
        axis: cardInterface_1.AxisEnum.STANDING,
        player: cardInterface_1.PlayerEnum.BOTH
    });
    const card6 = util_1.makeBlankCard();
    card6.name = "6";
    card6.requirements.push({
        axis: cardInterface_1.AxisEnum.CLOSE,
        player: cardInterface_1.PlayerEnum.BOTH
    });
    return [card1, card2, card3, card4, card5, card6];
};
describe('game', () => {
    let deck;
    let state;
    let player = 0;
    let opponent = 1;
    beforeEach(() => {
        deck = makeDeck();
        state = util_1.makeGameState();
        state.decks[0] = deck;
        state.distance = stateInterface_1.DistanceEnum.CLOSE;
    });
    describe('drawHand', () => {
        it('should ' + gameSettings_1.HAND_SIZE + ' cards when possible', () => {
            startTurn_1.drawHand(state, { _sendHand: jest.fn() });
            expect(state.hands[player][0].name).toBe('1');
            expect(state.hands[player][1].name).toBe('2');
            expect(state.hands[player][2].name).toBe('3');
            expect(state.hands[player].length).toBe(gameSettings_1.HAND_SIZE);
        });
        it('should draw only valid cards', () => {
            state.playerStates[0].standing = stateInterface_1.StandingEnum.PRONE;
            state.playerStates[1].balance = stateInterface_1.BalanceEnum.UNBALANCED;
            startTurn_1.drawHand(state, { _sendHand: jest.fn() });
            expect(state.hands[player][0].name).toBe('1');
            expect(state.hands[player][1].name).toBe('3');
            expect(state.hands[player][2].name).toBe('4');
            expect(state.hands[player].length).toBe(3);
        });
        it('should remove the drawn cards from the deck', () => {
            startTurn_1.drawHand(state, { _sendHand: jest.fn() });
            expect(state.decks[player].find((card) => card.name === '1')).toBe(undefined);
            expect(state.decks[player].find((card) => card.name === '2')).toBe(undefined);
            expect(state.decks[player].find((card) => card.name === '3')).toBe(undefined);
        });
        it('should draw less than 3 if 3 cards are not valid', () => {
            state.distance = stateInterface_1.DistanceEnum.FAR;
            startTurn_1.drawHand(state, { _sendHand: jest.fn() });
            expect(state.hands[player][0].name).toBe('2');
            expect(state.hands[player].length).toBe(1);
        });
    });
    describe('pickCard', () => {
        let card1;
        let card2;
        let card3;
        beforeEach(() => {
            card1 = util_1.makeBlankCard();
            card1.name = "a";
            card2 = util_1.makeBlankCard();
            card2.name = "b";
            card3 = util_1.makeBlankCard();
            card3.name = "c";
            state.hands[player] = [card1, card2, card3];
        });
        it('should tell state about which card is picked', () => {
            startTurn_1.pickCard(0, state);
            expect(state.pickedCard).toBe(card1);
        });
        it('should assign player and opponent', () => {
            startTurn_1.pickCard(1, state);
            expect(card2.opponent).toEqual(opponent);
        });
        it('    Case 2 - should assign player and opponent', () => {
            state.currentPlayer = 1;
            state.decks[1] = [];
            state.hands[1] = [card1, card2, card3];
            startTurn_1.pickCard(1, state);
            expect(card2.opponent).toEqual(player);
        });
        it('should empty the hand after a card is picked', () => {
            startTurn_1.pickCard(0, state);
            expect(state.hands[player].length).toEqual(0);
        });
        it('should put non picked cards back in the deck', () => {
            startTurn_1.pickCard(0, state);
            expect(state.decks[player].find((card) => card.name === "b")).not.toBe(undefined);
            expect(state.decks[player].find((card) => card.name === "c")).not.toBe(undefined);
        });
    });
    describe('incrementQueue', () => {
        it('should move a card over a slot the queue', () => {
            const card = util_1.makeBlankCard();
            state.queue[0] = [card];
            playCard_1.incrementQueue(state);
            expect(state.queue[0].length).toBe(0);
            expect(state.queue[1][0]).toEqual(card);
        });
        it('should move all cards down one', () => {
            const card1 = util_1.makeBlankCard();
            const card2 = util_1.makeBlankCard();
            const card3 = util_1.makeBlankCard();
            const card4 = util_1.makeBlankCard();
            const queue = [[card1], [card2, card3], [card4]];
            state.queue = queue;
            playCard_1.incrementQueue(state);
            expect(state.queue[0].length).toBe(0);
            expect(state.queue[1][0]).toEqual(card1);
            expect(state.queue[2][0]).toEqual(card2);
            expect(state.queue[2][1]).toEqual(card3);
            expect(state.queue[3][0]).toEqual(card4);
        });
    });
    describe('addCardToQueue', () => {
        it('should put the card into the queue', () => {
            const card = util_1.makeBlankCard();
            state.pickedCard = card;
            playCard_1.addCardToQueue(state);
            expect(state.queue[0][0]).toBe(card);
        });
        it('should remove card from pickedCard', () => {
            const card = util_1.makeBlankCard();
            state.pickedCard = card;
            playCard_1.addCardToQueue(state);
            expect(state.pickedCard).toBeUndefined();
        });
        it('should handle putting multiple cards into the same bucket', () => {
            state.queue = [[util_1.makeBlankCard()], [util_1.makeBlankCard()], [util_1.makeBlankCard()]];
            const card1 = util_1.makeBlankCard();
            state.pickedCard = card1;
            playCard_1.addCardToQueue(state);
            const card2 = util_1.makeBlankCard();
            state.pickedCard = card2;
            playCard_1.addCardToQueue(state);
            expect(state.queue[0][0]).toEqual(card1);
            expect(state.queue[0][1]).toEqual(card2);
        });
    });
    describe('getMechanicsReady', () => {
        let effect1, effect2, effect3, effect4;
        beforeEach(() => {
            effect1 = { axis: cardInterface_1.AxisEnum.FAR, player: cardInterface_1.PlayerEnum.BOTH };
            effect2 = { axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 2 };
            effect3 = {
                mechanic: cardInterface_1.MechanicEnum.TELEGRAPH, mechanicRequirements: [
                    { axis: cardInterface_1.AxisEnum.GRAPPLED, player: cardInterface_1.PlayerEnum.BOTH }
                ],
                mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }]
            };
            effect4 = { axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.PLAYER, amount: 5 };
        });
        it('should store effects', () => {
            const card = util_1.makeBlankCard();
            card.effects = [effect1, effect2];
            state.pickedCard = card;
            card.opponent = 1;
            playCard_1.getMechanicsReady(state);
            expect(state.readiedEffects).toEqual([effect1, effect2]);
            expect(state.readiedEffects[0]).not.toBe(effect1);
        });
        it('should store only met optional effects', () => {
            const card = util_1.makeBlankCard();
            card.opponent = 1;
            card.effects = [effect1];
            card.optional = [
                { effects: [effect3], requirements: [{ axis: cardInterface_1.AxisEnum.STANDING, player: cardInterface_1.PlayerEnum.OPPONENT }] },
                { effects: [effect2], requirements: [{ axis: cardInterface_1.AxisEnum.ANTICIPATING, player: cardInterface_1.PlayerEnum.PLAYER }] },
                {
                    effects: [effect4], requirements: [
                        { axis: cardInterface_1.AxisEnum.STANDING, player: cardInterface_1.PlayerEnum.PLAYER },
                        { axis: cardInterface_1.AxisEnum.UNBALANCED, player: cardInterface_1.PlayerEnum.PLAYER }
                    ]
                },
            ];
            state.pickedCard = card;
            playCard_1.getMechanicsReady(state);
            expect(state.readiedEffects).toEqual([effect1, effect3]);
        });
    });
    describe('makePredictions', () => {
        it('should store player predictions on the cards', () => __awaiter(this, void 0, void 0, function* () {
            const _getPredictions = jest.fn();
            _getPredictions.mockImplementationOnce(() => __awaiter(this, void 0, void 0, function* () { return stateInterface_1.PredictionEnum.BALANCE; }));
            _getPredictions.mockImplementationOnce(() => __awaiter(this, void 0, void 0, function* () { return stateInterface_1.PredictionEnum.MOTION; }));
            const card = util_1.makeBlankCard();
            card.effects = [
                { mechanic: cardInterface_1.MechanicEnum.PREDICT, mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }] },
                { axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 },
                { mechanic: cardInterface_1.MechanicEnum.PREDICT, mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }] }
            ];
            state.readiedEffects = util_1.deepCopy(card.effects);
            state.pickedCard = card;
            yield playCard_1.makePredictions(state, { _getPredictions });
            expect(state.predictions[0].prediction).toEqual(stateInterface_1.PredictionEnum.BALANCE);
            expect(state.predictions[0].mechanics).toEqual(card.effects[0].mechanicEffects);
            expect(state.predictions[0].mechanics).not.toBe(card.effects[0].mechanicEffects);
            expect(state.predictions[1].prediction).toEqual(stateInterface_1.PredictionEnum.MOTION);
            expect(state.predictions[1].mechanics).toEqual(card.effects[2].mechanicEffects);
            expect(state.predictions[1].mechanics).not.toBe(card.effects[2].mechanicEffects);
        }));
    });
    describe('markAxisChanges', () => {
        it('should mark all axis that change', () => {
            const card = util_1.makeBlankCard();
            card.effects = [
                { axis: cardInterface_1.AxisEnum.GRAPPLED, player: cardInterface_1.PlayerEnum.BOTH },
                { axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.OPPONENT }
            ];
            state.readiedEffects = util_1.deepCopy(card.effects);
            card.opponent = 1;
            state.pickedCard = card;
            playCard_1.markAxisChanges(state);
            expect(state.modifiedAxis.balance).toBe(false);
            expect(state.modifiedAxis.distance).toBe(true);
            expect(state.modifiedAxis.motion).toBe(true);
            expect(state.modifiedAxis.standing).toBe(false);
        });
        it('should not mark axis that are on cards, but do not change', () => {
            const card = util_1.makeBlankCard();
            card.effects = [
                { axis: cardInterface_1.AxisEnum.ANTICIPATING, player: cardInterface_1.PlayerEnum.BOTH },
                { axis: cardInterface_1.AxisEnum.STANDING, player: cardInterface_1.PlayerEnum.OPPONENT },
                { axis: cardInterface_1.AxisEnum.CLOSE, player: cardInterface_1.PlayerEnum.BOTH }
            ];
            state.readiedEffects = util_1.deepCopy(card.effects);
            card.opponent = 1;
            state.pickedCard = card;
            playCard_1.markAxisChanges(state);
            expect(state.modifiedAxis.balance).toBe(true);
            expect(state.modifiedAxis.distance).toBe(false);
            expect(state.modifiedAxis.motion).toBe(false);
            expect(state.modifiedAxis.standing).toBe(false);
        });
    });
    describe('makeEffectsReduceable', () => {
        it('should apply basic effects like damamge, and modifying state', () => {
            const card = util_1.makeBlankCard();
            card.effects = [
                { axis: cardInterface_1.AxisEnum.GRAPPLED, player: cardInterface_1.PlayerEnum.BOTH },
                { axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 },
                { axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.PLAYER },
                { axis: cardInterface_1.AxisEnum.BALANCED, player: cardInterface_1.PlayerEnum.PLAYER }
            ];
            state.health = [gameSettings_1.STARTING_HEALTH, gameSettings_1.STARTING_HEALTH];
            state.readiedEffects = util_1.deepCopy(card.effects);
            card.player = 0;
            card.opponent = 1;
            state.pickedCard = card;
            playCard_1.addCardToQueue(state);
            applyEffects_1.makeEffectsReduceable(state);
            expect(state.distance).toEqual(stateInterface_1.DistanceEnum.GRAPPLED);
            expect(state.health[opponent]).toEqual(gameSettings_1.STARTING_HEALTH - 3);
            expect(state.playerStates[player].motion).toEqual(stateInterface_1.MotionEnum.MOVING);
            expect(state.playerStates[player].balance).toEqual(stateInterface_1.BalanceEnum.BALANCED);
            expect(state.playerStates[opponent].balance).toEqual(stateInterface_1.BalanceEnum.BALANCED);
            expect(card.shouldReflex).toBeFalsy();
            expect(card.focuses).toBeFalsy();
            expect(card.telegraphs).toBeFalsy();
            expect(card.predictions).toBeFalsy();
        });
        it('should mark time appropriately', () => {
            const card = util_1.makeBlankCard();
            card.effects = [
                { axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.PLAYER, amount: 3 },
                { axis: cardInterface_1.AxisEnum.ANTICIPATING, player: cardInterface_1.PlayerEnum.PLAYER },
                { axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 },
            ];
            state.stateDurations[0].motion = 8;
            state.stateDurations[0].balance = 4;
            state.playerStates[0].motion = stateInterface_1.MotionEnum.MOVING;
            state.playerStates[0].balance = stateInterface_1.BalanceEnum.ANTICIPATING;
            state.readiedEffects = util_1.deepCopy(card.effects);
            card.player = 0;
            card.opponent = 1;
            state.pickedCard = card;
            playCard_1.addCardToQueue(state);
            applyEffects_1.makeEffectsReduceable(state);
            expect(state.stateDurations[player].motion).toEqual(8);
            expect(state.stateDurations[player].balance).toEqual(null);
            expect(state.stateDurations[opponent].motion).toEqual(6);
        });
        it('should store mechanics in the proper places', () => {
            const card = util_1.makeBlankCard();
            card.player = 0;
            card.opponent = 1;
            const predictEff = { mechanic: cardInterface_1.MechanicEnum.PREDICT, mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }] };
            const focusEff = { mechanic: cardInterface_1.MechanicEnum.FOCUS, mechanicRequirements: [{ axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.OPPONENT }], mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }] };
            const teleEff = { mechanic: cardInterface_1.MechanicEnum.TELEGRAPH, mechanicRequirements: [{ axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.OPPONENT }], mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }] };
            const reflexEff = { mechanic: cardInterface_1.MechanicEnum.REFLEX };
            const blockEff = { mechanic: cardInterface_1.MechanicEnum.BLOCK, amount: 2 };
            card.effects = [predictEff, focusEff, teleEff, reflexEff, blockEff];
            state.pickedCard = card;
            state.readiedEffects = util_1.deepCopy(card.effects);
            state.health = [gameSettings_1.STARTING_HEALTH, gameSettings_1.STARTING_HEALTH];
            state.readiedEffects = util_1.deepCopy(card.effects);
            state.pickedCard = card;
            playCard_1.incrementQueue(state);
            playCard_1.addCardToQueue(state);
            applyEffects_1.makeEffectsReduceable(state);
            expect(card.focuses).toEqual([focusEff]);
            expect(card.telegraphs).toEqual([teleEff]);
            expect(card.predictions).toEqual([predictEff]);
            expect(card.shouldReflex).toEqual(true);
            expect(state.block[player]).toEqual(2);
        });
    });
    describe("removeStoredEffects", () => {
        it('should remove stored effects on the most recently played card', () => {
            const card = util_1.makeBlankCard();
            card.effects = [
                { axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.PLAYER, amount: 3 },
                { axis: cardInterface_1.AxisEnum.ANTICIPATING, player: cardInterface_1.PlayerEnum.PLAYER },
                { axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 },
            ];
            state.readiedEffects = util_1.deepCopy(card.effects);
            state.pickedCard = card;
            playCard_1.incrementQueue(state);
            playCard_1.addCardToQueue(state);
            applyEffects_1.removeStoredEffects(state);
            expect(state.readiedEffects).toBeUndefined();
        });
    });
    describe("checkForVictor", () => {
        it('should mark victory if a player\'s health drops to 0', () => {
            state.health = [5, 0];
            expect(() => applyEffects_1.checkForVictor(state)).toThrowError(errors_1.ControlEnum.GAME_OVER);
            expect(state.winner).toEqual(0);
        });
        it('should not erroneously makr victory', () => {
            state.health = [1, 4];
            applyEffects_1.checkForVictor(state);
            expect(state.winner).toBeUndefined();
        });
        it('should mark -1 if both players health is at or below 0', () => {
            state.health = [-1, 0];
            expect(() => applyEffects_1.checkForVictor(state)).toThrow();
            expect(state.winner).toEqual(-1);
        });
    });
    describe("checkPredictions", () => {
        let predictCard;
        beforeEach(() => {
            predictCard = util_1.makeBlankCard();
        });
        it('should do nothing if there is no prediction', () => {
            expect(() => applyEffects_1.checkPredictions(state)).not.toThrow();
        });
        it('should remove the prediction if the prediction was wrong', () => {
            state.pendingPredictions = [
                {
                    prediction: stateInterface_1.PredictionEnum.MOTION, mechanics: [
                        { axis: cardInterface_1.AxisEnum.DAMAGE, amount: 2, player: cardInterface_1.PlayerEnum.OPPONENT }
                    ]
                }
            ];
            expect(() => applyEffects_1.checkPredictions(state)).not.toThrow();
            expect(state.pendingPredictions).toBeUndefined();
        });
        it('should apply the effects if the prediction was correct & remove the prediction', () => {
            const mech = { axis: cardInterface_1.AxisEnum.DAMAGE, amount: 2, player: cardInterface_1.PlayerEnum.OPPONENT };
            state.pendingPredictions = [
                { prediction: stateInterface_1.PredictionEnum.BALANCE, mechanics: [mech] }
            ];
            state.modifiedAxis.balance = true;
            expect(() => applyEffects_1.checkPredictions(state)).toThrowError(errors_1.ControlEnum.NEW_EFFECTS);
            expect(state.pendingPredictions).toBeUndefined();
            expect(state.readiedEffects).toEqual([mech]);
            expect(state.readiedEffects[0]).not.toBe(mech);
        });
    });
    describe('checkTelegraph', () => {
        const card1 = util_1.makeBlankCard();
        const card2 = util_1.makeBlankCard();
        const card3 = util_1.makeBlankCard();
        card1.telegraphs = [
            {
                mechanic: cardInterface_1.MechanicEnum.TELEGRAPH,
                mechanicRequirements: [{ axis: cardInterface_1.AxisEnum.CLOSE, player: cardInterface_1.PlayerEnum.BOTH }],
                mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }]
            }
        ];
        card2.telegraphs = [
            {
                mechanic: cardInterface_1.MechanicEnum.TELEGRAPH,
                mechanicRequirements: [{ axis: cardInterface_1.AxisEnum.ANTICIPATING, player: cardInterface_1.PlayerEnum.BOTH }],
                mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 2 }]
            }
        ];
        card3.telegraphs = [
            {
                mechanic: cardInterface_1.MechanicEnum.TELEGRAPH,
                mechanicRequirements: [{ axis: cardInterface_1.AxisEnum.STANDING, player: cardInterface_1.PlayerEnum.BOTH }],
                mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 6 }]
            }
        ];
        it('should apply telegraphs whose requirements have been met', () => {
            state.queue = [
                [], [card2], [card3], [card1], [], []
            ];
            card2.player = card3.player = card1.opponent = 0;
            card2.opponent = card3.opponent = card2.player = 1;
            expect(() => applyEffects_1.checkTelegraph(state)).toThrowError(errors_1.ControlEnum.NEW_EFFECTS);
            expect(card1.telegraphs).toBeUndefined();
            expect(card2.telegraphs).not.toBeUndefined();
            expect(card3.telegraphs).toBeUndefined();
            expect(state.readiedEffects).toEqual([{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 6 }, { axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }]);
        });
    });
    describe('checkReflex', () => {
        it('should add a reflex', () => {
            const refCard = util_1.makeBlankCard();
            refCard.shouldReflex = true;
            refCard.player = 1;
            refCard.opponent = 0;
            state.currentPlayer = 1;
            const drawnCard = util_1.makeBlankCard();
            drawnCard.name = 'drawn';
            drawnCard.player = 1;
            state.decks[1] = [drawnCard];
            state.queue = [
                [], [refCard], [], [], [], [], []
            ];
            expect(() => applyEffects_1.checkReflex(state)).toThrowError(errors_1.ControlEnum.PLAY_CARD);
            expect(refCard.shouldReflex).toBeFalsy();
            expect(state.pickedCard.name).toEqual('drawn');
            expect(drawnCard.opponent).toEqual(0);
        });
    });
    describe('checkFocus', () => {
        const card1 = util_1.makeBlankCard();
        const card2 = util_1.makeBlankCard();
        const card3 = util_1.makeBlankCard();
        card1.player = 0;
        card2.player = 1;
        card3.player = 1;
        const card1Focus = { mechanic: cardInterface_1.MechanicEnum.FOCUS, mechanicRequirements: [], mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, amount: 1, player: cardInterface_1.PlayerEnum.BOTH }] };
        const card2Focus = { mechanic: cardInterface_1.MechanicEnum.FOCUS, mechanicRequirements: [{ axis: cardInterface_1.AxisEnum.ANTICIPATING, player: cardInterface_1.PlayerEnum.BOTH }], mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, amount: 1, player: cardInterface_1.PlayerEnum.BOTH }] };
        const card3Focus = { mechanic: cardInterface_1.MechanicEnum.FOCUS, mechanicRequirements: [{ axis: cardInterface_1.AxisEnum.STANDING, player: cardInterface_1.PlayerEnum.BOTH }], mechanicEffects: [{ axis: cardInterface_1.AxisEnum.PRONE, player: cardInterface_1.PlayerEnum.BOTH }] };
        card1.focuses = [card1Focus];
        card2.focuses = [card2Focus];
        card3.focuses = [card3Focus];
        it('should check focus', () => {
            state.queue = [
                [card1], [], [], [], [], [card2], [card3]
            ];
            expect(() => applyEffects_1.checkFocus(state)).toThrowError(errors_1.ControlEnum.NEW_EFFECTS);
            expect(state.checkedFocus).toEqual(true);
            expect(state.readiedEffects).toEqual([{ axis: cardInterface_1.AxisEnum.DAMAGE, amount: 1, player: cardInterface_1.PlayerEnum.BOTH }]);
        });
    });
    describe('blocking', () => {
        it('should redice incoming damage', () => {
            const card = util_1.makeBlankCard();
            const mechanic = { axis: cardInterface_1.AxisEnum.DAMAGE, amount: 3, player: opponent };
            card.effects = [
                mechanic
            ];
            card.player = 0;
            card.opponent = 1;
            state.block = [0, 2];
            state.health = [10, 10];
            effectReducer_1.reduceMechanics(card.effects, card, 0, 1, state);
            expect(state.health[1]).toEqual(9);
            expect(state.block[1]).toEqual(0);
        });
        it('should redice incoming damage to zero and keep remainder', () => {
            const card = util_1.makeBlankCard();
            const mechanic = { axis: cardInterface_1.AxisEnum.DAMAGE, amount: 3, player: opponent };
            card.effects = [
                mechanic
            ];
            card.player = 0;
            card.opponent = 1;
            state.block = [2, 4];
            state.health = [10, 10];
            effectReducer_1.reduceMechanics(card.effects, card, 0, 1, state);
            expect(state.health[1]).toEqual(10);
            expect(state.block[1]).toEqual(1);
        });
    });
    describe("Lock", () => {
        it('should prevent axis from being modified if they are locked', () => {
            state.lockedState.distance = 2;
            state.lockedState.players[0].poise = 3;
            const card = util_1.makeBlankCard();
            card.effects = [
                { axis: cardInterface_1.AxisEnum.CLOSE, player: cardInterface_1.PlayerEnum.BOTH },
                { axis: cardInterface_1.AxisEnum.UNBALANCED, player: cardInterface_1.PlayerEnum.BOTH }
            ];
            effectReducer_1.reduceMechanics(card.effects, card, 0, 1, state);
            expect(state.distance).toEqual(stateInterface_1.DistanceEnum.CLOSE);
            expect(state.playerStates[0].balance).toEqual(stateInterface_1.BalanceEnum.BALANCED);
            expect(state.playerStates[1].balance).toEqual(stateInterface_1.BalanceEnum.UNBALANCED);
        });
    });
    describe('playerPicksOne', () => {
        it('should lay out the picked mechanics in readied effects', () => __awaiter(this, void 0, void 0, function* () {
            state.sockets = [];
            const effect1 = { axis: cardInterface_1.AxisEnum.DAMAGE, amount: 3, player: cardInterface_1.PlayerEnum.BOTH };
            const effect2 = {
                mechanic: cardInterface_1.MechanicEnum.PICK_ONE,
                choices: [
                    [
                        { axis: cardInterface_1.AxisEnum.CLOSE, player: cardInterface_1.PlayerEnum.BOTH },
                        { mechanic: cardInterface_1.MechanicEnum.BLOCK, amount: 3 }
                    ], [
                        { axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT }
                    ]
                ]
            };
            state.readiedEffects = [effect1, effect2];
            const _waitForPlayerToChoose = jest.fn(() => __awaiter(this, void 0, void 0, function* () { return 0; }));
            yield playCard_1.playerPicksOne(state, { _waitForPlayerToChoose });
            expect(state.readiedEffects).toEqual([effect1, { axis: cardInterface_1.AxisEnum.CLOSE, player: cardInterface_1.PlayerEnum.BOTH }, { mechanic: cardInterface_1.MechanicEnum.BLOCK, amount: 3 }]);
        }));
    });
    describe('buff', () => {
        it('should increase the amount on a card if that axis/player combo exists', () => {
            const effect1 = { axis: cardInterface_1.AxisEnum.DAMAGE, amount: 1, player: cardInterface_1.PlayerEnum.BOTH };
            const effect2 = { axis: cardInterface_1.AxisEnum.CLOSE, player: cardInterface_1.PlayerEnum.OPPONENT };
            const buffEff = { mechanic: cardInterface_1.MechanicEnum.BUFF, axis: cardInterface_1.AxisEnum.DAMAGE, amount: 2, player: cardInterface_1.PlayerEnum.BOTH };
            const card = util_1.makeBlankCard();
            card.effects = [effect1, effect2, buffEff];
            effectReducer_1.reduceMechanics([buffEff], card, 0, 1, state);
            expect(effect1.amount).toEqual(3);
        });
        it('should insert the effect on a card if that axis/player combo does not exists', () => {
            const effect2 = { axis: cardInterface_1.AxisEnum.CLOSE, player: cardInterface_1.PlayerEnum.OPPONENT };
            const buffEff = { mechanic: cardInterface_1.MechanicEnum.BUFF, axis: cardInterface_1.AxisEnum.DAMAGE, amount: 2, player: cardInterface_1.PlayerEnum.BOTH };
            const card = util_1.makeBlankCard();
            card.effects = [effect2, buffEff];
            effectReducer_1.reduceMechanics([buffEff], card, 0, 1, state);
            expect(card.effects[2]).toEqual({ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.BOTH, amount: 2 });
        });
    });
});
/*
    Game Start - get decks
    Game Loop
        Player Turn
            Shuffle X
            Draw Cards //Send X
            Pick Card //Await X
            Return Unpicked Cards X
            Card Happens
                Gather Effects card will have (Default Reqs vs Optional Reqs)
                        Store Mechanics On Card (Predict, Telegraph, Focus)
                        Predict? //Await
                Move Cards Up in Queue
                Picked Card is put onto Queue //Send X
                Apply Effects (all apply effects jump back to here)
                    apply effects
                    Remove Stored Effects
                    Victory?
                        End Game //Send
                    Check Predictions //Send
                        Apply Effects
                    Telegraph? //Send
                        Apply Effects
                    Reflex? //Send
                        Shuffle
                        Card Happens
                    Focus? //Send
            Remove Old Cards From Queue?
            Decrement Counters
            Player Turn Over //Send
                Rotate Next Player
*/ 
