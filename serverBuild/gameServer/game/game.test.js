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
const game_1 = require("./game");
const gameSettings_1 = require("../gameSettings");
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
        it('should 3 cards when possible', () => {
            game_1.drawHand(state);
            expect(state.hands[player][0].name).toBe('1');
            expect(state.hands[player][1].name).toBe('2');
            expect(state.hands[player][2].name).toBe('3');
            expect(state.hands[player].length).toBe(3);
        });
        it('should draw only valid cards', () => {
            state.playerStates[0].standing = stateInterface_1.StandingEnum.PRONE;
            state.playerStates[1].balance = stateInterface_1.BalanceEnum.UNBALANCED;
            game_1.drawHand(state);
            expect(state.hands[player][0].name).toBe('1');
            expect(state.hands[player][1].name).toBe('3');
            expect(state.hands[player][2].name).toBe('4');
            expect(state.hands[player].length).toBe(3);
        });
        it('should remove the drawn cards from the deck', () => {
            game_1.drawHand(state);
            expect(state.decks[player].find((card) => card.name === '1')).toBe(undefined);
            expect(state.decks[player].find((card) => card.name === '2')).toBe(undefined);
            expect(state.decks[player].find((card) => card.name === '3')).toBe(undefined);
        });
        it('should draw less than 3 if 3 cards are not valid', () => {
            state.distance = stateInterface_1.DistanceEnum.FAR;
            game_1.drawHand(state);
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
            game_1.pickCard(0, state);
            expect(state.pickedCard).toBe(card1);
        });
        it('should assign player and opponent', () => {
            game_1.pickCard(1, state);
            expect(card2.player).toEqual(player);
            expect(card2.opponent).toEqual(opponent);
        });
        it('    Case 2 - should assign player and opponent', () => {
            state.currentPlayer = 1;
            state.decks[1] = [];
            state.hands[1] = [card1, card2, card3];
            game_1.pickCard(1, state);
            expect(card2.player).toEqual(opponent);
            expect(card2.opponent).toEqual(player);
        });
        it('should empty the hand after a card is picked', () => {
            game_1.pickCard(0, state);
            expect(state.hands[player].length).toEqual(0);
        });
        it('should put non picked cards back in the deck', () => {
            game_1.pickCard(0, state);
            expect(state.decks[player].find((card) => card.name === "b")).not.toBe(undefined);
            expect(state.decks[player].find((card) => card.name === "c")).not.toBe(undefined);
        });
    });
    describe('incrementQueue', () => {
        it('should move a card over a slot the queue', () => {
            const card = util_1.makeBlankCard();
            state.queues[player][0] = [card];
            game_1.incrementQueue(state);
            expect(state.queues[player][0].length).toBe(0);
            expect(state.queues[player][1][0]).toEqual(card);
        });
        it('should move all cards down one', () => {
            const card1 = util_1.makeBlankCard();
            const card2 = util_1.makeBlankCard();
            const card3 = util_1.makeBlankCard();
            const card4 = util_1.makeBlankCard();
            const queue = [[card1], [card2, card3], [card4]];
            state.queues[player] = queue;
            game_1.incrementQueue(state);
            expect(state.queues[player][0].length).toBe(0);
            expect(state.queues[player][1][0]).toEqual(card1);
            expect(state.queues[player][2][0]).toEqual(card2);
            expect(state.queues[player][2][1]).toEqual(card3);
            expect(state.queues[player][3][0]).toEqual(card4);
        });
    });
    describe('addCardToQueue', () => {
        it('should put the card into the queue', () => {
            const card = util_1.makeBlankCard();
            state.pickedCard = card;
            game_1.addCardToQueue(state);
            expect(state.queues[player][0][0]).toBe(card);
        });
        it('should remove card from pickedCard', () => {
            const card = util_1.makeBlankCard();
            state.pickedCard = card;
            game_1.addCardToQueue(state);
            expect(state.pickedCard).toBeUndefined();
        });
        it('should handle putting multiple cards into the same bucket', () => {
            state.queues[player] = [[util_1.makeBlankCard()], [util_1.makeBlankCard()], [util_1.makeBlankCard()]];
            const card1 = util_1.makeBlankCard();
            state.pickedCard = card1;
            game_1.addCardToQueue(state);
            const card2 = util_1.makeBlankCard();
            state.pickedCard = card2;
            game_1.addCardToQueue(state);
            expect(state.queues[player][0][0]).toEqual(card1);
            expect(state.queues[player][0][1]).toEqual(card2);
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
            game_1.getMechanicsReady(state);
            expect(state.pickedCard.stored).toEqual([effect1, effect2]);
            expect(state.pickedCard.stored[0]).not.toBe(effect1);
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
            game_1.getMechanicsReady(state);
            expect(state.pickedCard.stored).toEqual([effect1, effect3]);
        });
    });
    describe('makePredictions', () => {
        it('should store player predictions on the cards', () => __awaiter(this, void 0, void 0, function* () {
            const _getPredictions = jest.fn();
            _getPredictions.mockImplementationOnce(() => __awaiter(this, void 0, void 0, function* () { return cardInterface_1.PredictionEnum.BALANCE; }));
            _getPredictions.mockImplementationOnce(() => __awaiter(this, void 0, void 0, function* () { return cardInterface_1.PredictionEnum.MOTION; }));
            const card = util_1.makeBlankCard();
            card.effects = [
                { mechanic: cardInterface_1.MechanicEnum.PREDICT, mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }] },
                { axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 },
                { mechanic: cardInterface_1.MechanicEnum.PREDICT, mechanicEffects: [{ axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 }] }
            ];
            card.stored = util_1.deepCopy(card.effects);
            state.pickedCard = card;
            yield game_1.makePredictions(state, { _getPredictions });
            expect(state.pickedCard.stored[0].prediction).toEqual(cardInterface_1.PredictionEnum.BALANCE);
            expect(state.pickedCard.stored[1].prediction).toBeUndefined();
            expect(state.pickedCard.stored[2].prediction).toEqual(cardInterface_1.PredictionEnum.MOTION);
        }));
    });
    describe('markAxisChanges', () => {
        it('should mark all axis that change', () => {
            const card = util_1.makeBlankCard();
            card.effects = [
                { axis: cardInterface_1.AxisEnum.GRAPPLED, player: cardInterface_1.PlayerEnum.BOTH },
                { axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.OPPONENT }
            ];
            card.stored = util_1.deepCopy(card.effects);
            card.opponent = 1;
            state.pickedCard = card;
            game_1.markAxisChanges(state);
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
            card.stored = util_1.deepCopy(card.effects);
            card.opponent = 1;
            state.pickedCard = card;
            game_1.markAxisChanges(state);
            expect(state.modifiedAxis.balance).toBe(true);
            expect(state.modifiedAxis.distance).toBe(false);
            expect(state.modifiedAxis.motion).toBe(false);
            expect(state.modifiedAxis.standing).toBe(false);
        });
    });
    describe('applyEffects', () => {
        it('should apply basic effects like damamge, and modifying state', () => {
            const card = util_1.makeBlankCard();
            card.effects = [
                { axis: cardInterface_1.AxisEnum.GRAPPLED, player: cardInterface_1.PlayerEnum.BOTH },
                { axis: cardInterface_1.AxisEnum.DAMAGE, player: cardInterface_1.PlayerEnum.OPPONENT, amount: 3 },
                { axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.PLAYER },
                { axis: cardInterface_1.AxisEnum.BALANCED, player: cardInterface_1.PlayerEnum.PLAYER }
            ];
            state.health = [gameSettings_1.STARTING_HEALTH, gameSettings_1.STARTING_HEALTH];
            card.stored = util_1.deepCopy(card.effects);
            card.player = 0;
            card.opponent = 1;
            state.pickedCard = card;
            game_1.addCardToQueue(state);
            game_1.applyEffects(state);
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
            state.stateDurations[0].motion = 4;
            state.stateDurations[0].balance = 2;
            state.playerStates[0].motion = stateInterface_1.MotionEnum.MOVING;
            state.playerStates[0].balance = stateInterface_1.BalanceEnum.ANTICIPATING;
            card.stored = util_1.deepCopy(card.effects);
            card.player = 0;
            card.opponent = 1;
            state.pickedCard = card;
            game_1.addCardToQueue(state);
            game_1.applyEffects(state);
            expect(state.stateDurations[player].motion).toEqual(4);
            expect(state.stateDurations[player].balance).toEqual(null);
            expect(state.stateDurations[opponent].motion).toEqual(3);
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
            card.stored = util_1.deepCopy(card.effects);
            state.health = [gameSettings_1.STARTING_HEALTH, gameSettings_1.STARTING_HEALTH];
            card.stored = util_1.deepCopy(card.effects);
            state.pickedCard = card;
            game_1.incrementQueue(state);
            game_1.addCardToQueue(state);
            game_1.applyEffects(state);
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
            card.stored = util_1.deepCopy(card.effects);
            state.pickedCard = card;
            game_1.incrementQueue(state);
            game_1.addCardToQueue(state);
            game_1.removeStoredEffects(state);
            expect(card.stored).toBeUndefined();
        });
    });
    describe("checkForVictor", () => {
        it('should mark victory if a player\'s health drops to 0', () => {
            state.health = [5, 0];
            game_1.checkForVictor(state);
            expect(state.winner).toEqual(0);
        });
        it('should not erroneously makr victory', () => {
            state.health = [1, 4];
            game_1.checkForVictor(state);
            expect(state.winner).toBeUndefined();
        });
        it('should mark -1 if both players health is at or below 0', () => {
            state.health = [-1, 0];
            game_1.checkForVictor(state);
            expect(state.winner).toEqual(-1);
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
