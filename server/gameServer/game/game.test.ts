import { makeBlankCard, makeGameState, deepCopy } from "../util";
import { Card, AxisEnum, PlayerEnum, Mechanic, MechanicEnum } from "../interfaces/cardInterface";
import { GameState, StandingEnum, BalanceEnum, DistanceEnum, MotionEnum, PredictionEnum, ModifiedAxis, PredictionState } from "../interfaces/stateInterface";
import { drawHand, pickCard, addCardToQueue, incrementQueue, getMechanicsReady, makePredictions, applyEffects, markAxisChanges, checkForVictor, removeStoredEffects, checkPredictions, checkTelegraph, checkReflex, checkFocus, makeEffectsReduceable } from "./game";
import { STARTING_HEALTH, HAND_SIZE } from "../gameSettings";
import { ControlEnum } from "../errors";

const makeDeck = (): Card[] => {
    const card1 = makeBlankCard();
    card1.name = "1";
    card1.requirements.push({
        axis: AxisEnum.CLOSE,
        player: PlayerEnum.BOTH
    })
    card1.effects.push({
        axis: AxisEnum.CLOSE,
        player: PlayerEnum.BOTH
    })
    const card2 = makeBlankCard();
    card2.name = "2";
    card2.requirements.push({
        axis: AxisEnum.STANDING,
        player: PlayerEnum.PLAYER
    })
    card2.effects.push({
        axis: AxisEnum.PRONE,
        player: PlayerEnum.PLAYER
    })
    const card3 = makeBlankCard();
    card3.name = "3";
    card3.requirements.push({
        axis: AxisEnum.NOT_FAR,
        player: PlayerEnum.BOTH
    })
    card3.effects.push({
        axis: AxisEnum.BALANCED,
        player: PlayerEnum.PLAYER
    })
    const card4 = makeBlankCard();
    card4.name = "4";
    card4.requirements.push({
        axis: AxisEnum.CLOSE,
        player: PlayerEnum.BOTH
    }, {
            axis: AxisEnum.UNBALANCED,
            player: PlayerEnum.OPPONENT
        })
    card4.effects.push({
        axis: AxisEnum.DAMAGE,
        player: PlayerEnum.OPPONENT,
        amount: 3
    })
    const card5 = makeBlankCard();
    card5.name = "5";
    card5.requirements.push({
        axis: AxisEnum.MOVING,
        player: PlayerEnum.OPPONENT
    })
    card5.effects.push({
        axis: AxisEnum.STANDING,
        player: PlayerEnum.BOTH
    })
    const card6 = makeBlankCard();
    card6.name = "6";
    card6.requirements.push({
        axis: AxisEnum.CLOSE,
        player: PlayerEnum.BOTH
    })
    return [card1, card2, card3, card4, card5, card6];
}

describe('game', () => {
    let deck: Card[];
    let state: GameState;
    let player = 0;
    let opponent = 1;
    beforeEach(() => {
        deck = makeDeck();
        state = makeGameState();
        state.decks[0] = deck;
        state.distance = DistanceEnum.CLOSE;
    })
    describe('drawHand', () => {
        it('should ' + HAND_SIZE + ' cards when possible', () => {
            drawHand(state, { _sendHand: jest.fn() });

            expect(state.hands[player][0].name).toBe('1');
            expect(state.hands[player][1].name).toBe('2');
            expect(state.hands[player][2].name).toBe('3');
            expect(state.hands[player].length).toBe(HAND_SIZE);
        })
        it('should draw only valid cards', () => {
            state.playerStates[0].standing = StandingEnum.PRONE;
            state.playerStates[1].balance = BalanceEnum.UNBALANCED;

            drawHand(state, { _sendHand: jest.fn() });

            expect(state.hands[player][0].name).toBe('1');
            expect(state.hands[player][1].name).toBe('3');
            expect(state.hands[player][2].name).toBe('4');
            expect(state.hands[player].length).toBe(3);
        })
        it('should remove the drawn cards from the deck', () => {
            drawHand(state, { _sendHand: jest.fn() });

            expect(state.decks[player].find((card) => card.name === '1')).toBe(undefined);
            expect(state.decks[player].find((card) => card.name === '2')).toBe(undefined);
            expect(state.decks[player].find((card) => card.name === '3')).toBe(undefined);
        })
        it('should draw less than 3 if 3 cards are not valid', () => {
            state.distance = DistanceEnum.FAR

            drawHand(state, { _sendHand: jest.fn() });

            expect(state.hands[player][0].name).toBe('2');
            expect(state.hands[player].length).toBe(1);
        })
    })
    describe('pickCard', () => {
        let card1: Card;
        let card2: Card;
        let card3: Card;
        beforeEach(() => {
            card1 = makeBlankCard();
            card1.name = "a";
            card2 = makeBlankCard();
            card2.name = "b";
            card3 = makeBlankCard();
            card3.name = "c";
            state.hands[player] = [card1, card2, card3];
        })
        it('should tell state about which card is picked', () => {
            pickCard(0, state);

            expect(state.pickedCard).toBe(card1)
        })
        it('should assign player and opponent', () => {
            pickCard(1, state);

            expect(card2.opponent).toEqual(opponent);
        })
        it('    Case 2 - should assign player and opponent', () => {
            state.currentPlayer = 1;
            state.decks[1] = [];
            state.hands[1] = [card1, card2, card3];
            pickCard(1, state);

            expect(card2.opponent).toEqual(player);
        })
        it('should empty the hand after a card is picked', () => {
            pickCard(0, state);

            expect(state.hands[player].length).toEqual(0);
        })
        it('should put non picked cards back in the deck', () => {
            pickCard(0, state);

            expect(state.decks[player].find((card) => card.name === "b")).not.toBe(undefined);
            expect(state.decks[player].find((card) => card.name === "c")).not.toBe(undefined);
        })
    })
    describe('incrementQueue', () => {
        it('should move a card over a slot the queue', () => {
            const card = makeBlankCard();
            state.queue[0] = [card];

            incrementQueue(state);

            expect(state.queue[0].length).toBe(0);
            expect(state.queue[1][0]).toEqual(card);
        })
        it('should move all cards down one', () => {
            const card1 = makeBlankCard();
            const card2 = makeBlankCard();
            const card3 = makeBlankCard();
            const card4 = makeBlankCard();
            const queue = [[card1], [card2, card3], [card4]];
            state.queue = queue;

            incrementQueue(state);

            expect(state.queue[0].length).toBe(0);
            expect(state.queue[1][0]).toEqual(card1);
            expect(state.queue[2][0]).toEqual(card2);
            expect(state.queue[2][1]).toEqual(card3);
            expect(state.queue[3][0]).toEqual(card4);
        })
    })
    describe('addCardToQueue', () => {
        it('should put the card into the queue', () => {
            const card = makeBlankCard();
            state.pickedCard = card;

            addCardToQueue(state);

            expect(state.queue[0][0]).toBe(card);
        })
        it('should remove card from pickedCard', () => {
            const card = makeBlankCard();
            state.pickedCard = card;

            addCardToQueue(state);

            expect(state.pickedCard).toBeUndefined();
        })
        it('should handle putting multiple cards into the same bucket', () => {
            state.queue = [[makeBlankCard()], [makeBlankCard()], [makeBlankCard()]]
            const card1 = makeBlankCard();
            state.pickedCard = card1;
            addCardToQueue(state);

            const card2 = makeBlankCard();
            state.pickedCard = card2;
            addCardToQueue(state);

            expect(state.queue[0][0]).toEqual(card1);
            expect(state.queue[0][1]).toEqual(card2);
        })
    })
    describe('getMechanicsReady', () => {
        let effect1: Mechanic, effect2: Mechanic, effect3: Mechanic, effect4: Mechanic;
        beforeEach(() => {
            effect1 = { axis: AxisEnum.FAR, player: PlayerEnum.BOTH }
            effect2 = { axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 2 }
            effect3 = {
                mechanic: MechanicEnum.TELEGRAPH, mechanicRequirements: [
                    { axis: AxisEnum.GRAPPLED, player: PlayerEnum.BOTH }
                ],
                mechanicEffects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 }]
            }
            effect4 = { axis: AxisEnum.DAMAGE, player: PlayerEnum.PLAYER, amount: 5 }
        })
        it('should store effects', () => {
            const card = makeBlankCard();
            card.effects = [effect1, effect2]
            state.pickedCard = card;
            card.opponent = 1;

            getMechanicsReady(state);

            expect(state.readiedEffects).toEqual([effect1, effect2])
            expect(state.readiedEffects[0]).not.toBe(effect1);
        })
        it('should store only met optional effects', () => {
            const card = makeBlankCard();
            card.opponent = 1;
            card.effects = [effect1]
            card.optional = [
                { effects: [effect3], requirements: [{ axis: AxisEnum.STANDING, player: PlayerEnum.OPPONENT }] },
                { effects: [effect2], requirements: [{ axis: AxisEnum.ANTICIPATING, player: PlayerEnum.PLAYER }] },
                {
                    effects: [effect4], requirements: [
                        { axis: AxisEnum.STANDING, player: PlayerEnum.PLAYER },
                        { axis: AxisEnum.UNBALANCED, player: PlayerEnum.PLAYER }
                    ]
                },
            ]
            state.pickedCard = card;

            getMechanicsReady(state);

            expect(state.readiedEffects).toEqual([effect1, effect3])
        })
    })
    describe('makePredictions', () => {
        it('should store player predictions on the cards', async () => {
            const _getPredictions = jest.fn()
            _getPredictions.mockImplementationOnce(async () => PredictionEnum.BALANCE);
            _getPredictions.mockImplementationOnce(async () => PredictionEnum.MOTION);
            const card = makeBlankCard();
            card.effects = [
                { mechanic: MechanicEnum.PREDICT, mechanicEffects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 }] },
                { axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 },
                { mechanic: MechanicEnum.PREDICT, mechanicEffects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 }] }
            ];
            state.readiedEffects = deepCopy(card.effects);
            state.pickedCard = card;

            await makePredictions(state, { _getPredictions });

            expect(state.predictions[0].prediction).toEqual(PredictionEnum.BALANCE);
            expect(state.predictions[0].mechanics).toEqual(card.effects[0].mechanicEffects);
            expect(state.predictions[0].mechanics).not.toBe(card.effects[0].mechanicEffects);
            expect(state.predictions[1].prediction).toEqual(PredictionEnum.MOTION);
            expect(state.predictions[1].mechanics).toEqual(card.effects[2].mechanicEffects);
            expect(state.predictions[1].mechanics).not.toBe(card.effects[2].mechanicEffects);
        })
    })
    describe('markAxisChanges', () => {
        it('should mark all axis that change', () => {
            const card = makeBlankCard();
            card.effects = [
                { axis: AxisEnum.GRAPPLED, player: PlayerEnum.BOTH },
                { axis: AxisEnum.MOVING, player: PlayerEnum.OPPONENT }
            ]
            state.readiedEffects = deepCopy(card.effects);
            card.opponent = 1;
            state.pickedCard = card;

            markAxisChanges(state);

            expect(state.modifiedAxis.balance).toBe(false);
            expect(state.modifiedAxis.distance).toBe(true);
            expect(state.modifiedAxis.motion).toBe(true);
            expect(state.modifiedAxis.standing).toBe(false);
        })
        it('should not mark axis that are on cards, but do not change', () => {
            const card = makeBlankCard();
            card.effects = [
                { axis: AxisEnum.ANTICIPATING, player: PlayerEnum.BOTH },
                { axis: AxisEnum.STANDING, player: PlayerEnum.OPPONENT },
                { axis: AxisEnum.CLOSE, player: PlayerEnum.BOTH }
            ]
            state.readiedEffects = deepCopy(card.effects);
            card.opponent = 1;
            state.pickedCard = card;

            markAxisChanges(state);

            expect(state.modifiedAxis.balance).toBe(true);
            expect(state.modifiedAxis.distance).toBe(false);
            expect(state.modifiedAxis.motion).toBe(false);
            expect(state.modifiedAxis.standing).toBe(false);
        })
    })
    describe('makeEffectsReduceable', () => {
        it('should apply basic effects like damamge, and modifying state', () => {
            const card = makeBlankCard();
            card.effects = [
                { axis: AxisEnum.GRAPPLED, player: PlayerEnum.BOTH },
                { axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 },
                { axis: AxisEnum.MOVING, player: PlayerEnum.PLAYER },
                { axis: AxisEnum.BALANCED, player: PlayerEnum.PLAYER }
            ]
            state.health = [STARTING_HEALTH, STARTING_HEALTH];
            state.readiedEffects = deepCopy(card.effects);
            card.player = 0;
            card.opponent = 1;
            state.pickedCard = card;
            addCardToQueue(state);

            makeEffectsReduceable(state);

            expect(state.distance).toEqual(DistanceEnum.GRAPPLED);
            expect(state.health[opponent]).toEqual(STARTING_HEALTH - 3);
            expect(state.playerStates[player].motion).toEqual(MotionEnum.MOVING);
            expect(state.playerStates[player].balance).toEqual(BalanceEnum.BALANCED);
            expect(state.playerStates[opponent].balance).toEqual(BalanceEnum.BALANCED);
            expect(card.shouldReflex).toBeFalsy();
            expect(card.focuses).toBeFalsy();
            expect(card.telegraphs).toBeFalsy();
            expect(card.predictions).toBeFalsy();
        })
        it('should mark time appropriately', () => {
            const card = makeBlankCard();
            card.effects = [
                { axis: AxisEnum.MOVING, player: PlayerEnum.PLAYER, amount: 3 },
                { axis: AxisEnum.ANTICIPATING, player: PlayerEnum.PLAYER },
                { axis: AxisEnum.MOVING, player: PlayerEnum.OPPONENT, amount: 3 },
            ]
            state.stateDurations[0].motion = 8;
            state.stateDurations[0].balance = 4;
            state.playerStates[0].motion = MotionEnum.MOVING;
            state.playerStates[0].balance = BalanceEnum.ANTICIPATING;
            state.readiedEffects = deepCopy(card.effects);
            card.player = 0;
            card.opponent = 1;
            state.pickedCard = card;
            addCardToQueue(state);

            makeEffectsReduceable(state);

            expect(state.stateDurations[player].motion).toEqual(8);
            expect(state.stateDurations[player].balance).toEqual(null);
            expect(state.stateDurations[opponent].motion).toEqual(6);
        })
        it('should store mechanics in the proper places', () => {
            const card = makeBlankCard();
            card.player = 0;
            card.opponent = 1;
            const predictEff = { mechanic: MechanicEnum.PREDICT, mechanicEffects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 }] };
            const focusEff = { mechanic: MechanicEnum.FOCUS, mechanicRequirements: [{ axis: AxisEnum.MOVING, player: PlayerEnum.OPPONENT }], mechanicEffects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 }] };
            const teleEff = { mechanic: MechanicEnum.TELEGRAPH, mechanicRequirements: [{ axis: AxisEnum.MOVING, player: PlayerEnum.OPPONENT }], mechanicEffects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 }] };
            const reflexEff = { mechanic: MechanicEnum.REFLEX };
            const blockEff = { mechanic: MechanicEnum.BLOCK, amount: 2 };
            card.effects = [predictEff, focusEff, teleEff, reflexEff, blockEff]
            state.pickedCard = card;
            state.readiedEffects = deepCopy(card.effects);


            state.health = [STARTING_HEALTH, STARTING_HEALTH];
            state.readiedEffects = deepCopy(card.effects);
            state.pickedCard = card;
            incrementQueue(state);
            addCardToQueue(state);

            makeEffectsReduceable(state);

            expect(card.focuses).toEqual([focusEff]);
            expect(card.telegraphs).toEqual([teleEff]);
            expect(card.predictions).toEqual([predictEff]);
            expect(card.shouldReflex).toEqual(true);
            expect(state.block[player]).toEqual(2);
        })
    })
    describe("removeStoredEffects", () => {
        it('should remove stored effects on the most recently played card', () => {
            const card = makeBlankCard();
            card.effects = [
                { axis: AxisEnum.MOVING, player: PlayerEnum.PLAYER, amount: 3 },
                { axis: AxisEnum.ANTICIPATING, player: PlayerEnum.PLAYER },
                { axis: AxisEnum.MOVING, player: PlayerEnum.OPPONENT, amount: 3 },
            ]
            state.readiedEffects = deepCopy(card.effects);
            state.pickedCard = card;
            incrementQueue(state);
            addCardToQueue(state);

            removeStoredEffects(state);

            expect(state.readiedEffects).toBeUndefined();
        })
    })
    describe("checkForVictor", () => {
        it('should mark victory if a player\'s health drops to 0', () => {
            state.health = [5, 0]

            expect(()=>checkForVictor(state)).toThrowError(ControlEnum.GAME_OVER);

            expect(state.winner).toEqual(0);
        })
        it('should not erroneously makr victory', () => {
            state.health = [1, 4];

            checkForVictor(state);

            expect(state.winner).toBeUndefined();
        })
        it('should mark -1 if both players health is at or below 0', () => {
            state.health = [-1, 0];

            expect(()=>checkForVictor(state)).toThrow();

            expect(state.winner).toEqual(-1);
        })
    })
    describe("checkPredictions", () => {
        let predictCard: Card;
        beforeEach(() => {
            predictCard = makeBlankCard();
        })
        it('should do nothing if there is no prediction', () => {
            expect(() => checkPredictions(state)).not.toThrow();
        })
        it('should remove the prediction if the prediction was wrong', () => {
            state.predictions = [
                {
                    prediction: PredictionEnum.MOTION, mechanics: [
                        { axis: AxisEnum.DAMAGE, amount: 2, player: PlayerEnum.OPPONENT }
                    ]
                } as PredictionState
            ]

            expect(() => checkPredictions(state)).not.toThrow();

            expect(state.predictions).toBeUndefined();
        })
        it('should apply the effects if the prediction was correct & remove the prediction', () => {
            const mech = { axis: AxisEnum.DAMAGE, amount: 2, player: PlayerEnum.OPPONENT }
            state.predictions = [
                { prediction: PredictionEnum.BALANCE, mechanics: [mech] } as PredictionState
            ]
            state.modifiedAxis.balance = true;

            expect(() => checkPredictions(state)).toThrowError(ControlEnum.NEW_EFFECTS);

            expect(state.predictions).toBeUndefined();
            expect(state.readiedEffects).toEqual([mech]);
            expect(state.readiedEffects[0]).not.toBe(mech);
        })
    })
    describe('checkTelegraph', () => {
        const card1 = makeBlankCard();
        const card2 = makeBlankCard();
        const card3 = makeBlankCard();
        card1.telegraphs = [
            {
                mechanic: MechanicEnum.TELEGRAPH,
                mechanicRequirements: [{ axis: AxisEnum.CLOSE, player: PlayerEnum.BOTH }],
                mechanicEffects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 }]
            }
        ]
        card2.telegraphs = [
            {
                mechanic: MechanicEnum.TELEGRAPH,
                mechanicRequirements: [{ axis: AxisEnum.ANTICIPATING, player: PlayerEnum.BOTH }],
                mechanicEffects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 2 }]
            }
        ]
        card3.telegraphs = [
            {
                mechanic: MechanicEnum.TELEGRAPH,
                mechanicRequirements: [{ axis: AxisEnum.STANDING, player: PlayerEnum.BOTH }],
                mechanicEffects: [{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 6 }]
            }
        ]
        it('should apply telegraphs whose requirements have been met', () => {
            state.queue = [
                [], [card2], [card3], [card1], [], []
            ];
            card2.player = card3.player = card1.opponent = 0;
            card2.opponent = card3.opponent = card2.player = 1;

            expect(() => checkTelegraph(state)).toThrowError(ControlEnum.NEW_EFFECTS);

            expect(card1.telegraphs).toBeUndefined();
            expect(card2.telegraphs).not.toBeUndefined();
            expect(card3.telegraphs).toBeUndefined();
            expect(state.readiedEffects).toEqual([{ axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 6 }, { axis: AxisEnum.DAMAGE, player: PlayerEnum.OPPONENT, amount: 3 }])
        })
    })
    describe('checkReflex', () => {
        it('should add a reflex', () => {
            const refCard = makeBlankCard();
            refCard.shouldReflex = true;
            refCard.player = 1;
            refCard.opponent = 0;
            state.currentPlayer = 1;
            const drawnCard = makeBlankCard();
            drawnCard.name = 'drawn';
            drawnCard.player = 1; 
            state.decks[1] = [drawnCard]
            state.queue = [
                [], [refCard], [], [], [], [], []
            ]

            expect(() => checkReflex(state)).toThrowError(ControlEnum.PLAY_CARD);

            expect(refCard.shouldReflex).toBeFalsy();
            expect(state.pickedCard.name).toEqual('drawn');
            expect(drawnCard.opponent).toEqual(0);
        })
    })
    describe('checkFocus', () => {
        const card1 = makeBlankCard();
        const card2 = makeBlankCard();
        const card3 = makeBlankCard();
        card1.player = 0; 
        card2.player = 1;
        card3.player = 1; 
        const card1Focus: Mechanic = { mechanic: MechanicEnum.FOCUS, mechanicRequirements: [], mechanicEffects: [{ axis: AxisEnum.DAMAGE, amount: 1, player: PlayerEnum.BOTH }] }
        const card2Focus: Mechanic = { mechanic: MechanicEnum.FOCUS, mechanicRequirements: [{ axis: AxisEnum.ANTICIPATING, player: PlayerEnum.BOTH }], mechanicEffects: [{ axis: AxisEnum.DAMAGE, amount: 1, player: PlayerEnum.BOTH }] }
        const card3Focus: Mechanic = { mechanic: MechanicEnum.FOCUS, mechanicRequirements: [{ axis: AxisEnum.STANDING, player: PlayerEnum.BOTH }], mechanicEffects: [{ axis: AxisEnum.PRONE, player: PlayerEnum.BOTH }] }
        card1.focuses = [card1Focus];
        card2.focuses = [card2Focus];
        card3.focuses = [card3Focus];
        it('should check focus', () => {
            state.queue = [
                [card1], [], [], [], [], [card2], [card3]
            ]

            expect(() => checkFocus(state)).toThrowError(ControlEnum.NEW_EFFECTS);

            expect(state.checkedFocus).toEqual(true);
            expect(state.readiedEffects).toEqual([{ axis: AxisEnum.DAMAGE, amount: 1, player: PlayerEnum.BOTH }]);
        })
    })
})

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