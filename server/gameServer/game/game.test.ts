import { makeBlankCard, makeGameState } from "../util";
import { Card, AxisEnum, PlayerEnum } from "../interfaces/cardInterface";
import { GameState, StandingEnum, BalanceEnum, DistanceEnum } from "../interfaces/stateInterface";
import { drawHand, pickCard, addCardToQueue, playCard } from "./game";

const makeDeck = (): Card[]=>{
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
    },{
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

describe('game', ()=>{
    let deck: Card[];
    let state: GameState;
    let player; 
    beforeEach(()=>{
        deck = makeDeck();
        state = makeGameState(); 
        state.decks[0] = deck;
        state.distance = DistanceEnum.CLOSE;
        player = 0;  
    })
    describe('drawHand', ()=>{
        it('should 3 cards when possible', ()=>{
            drawHand(state);

            expect(state.hands[player][0].name).toBe('1');
            expect(state.hands[player][1].name).toBe('2'); 
            expect(state.hands[player][2].name).toBe('3'); 
            expect(state.hands[player].length).toBe(3); 
        })
        it('should draw only valid cards', ()=>{
            state.playerStates[0].standing = StandingEnum.PRONE; 
            state.playerStates[1].balance = BalanceEnum.UNBALANCED; 

            drawHand(state);

            expect(state.hands[player][0].name).toBe('1');
            expect(state.hands[player][1].name).toBe('3'); 
            expect(state.hands[player][2].name).toBe('4'); 
            expect(state.hands[player].length).toBe(3); 
        })
        it('should remove the drawn cards from the deck', ()=>{
            drawHand(state); 

            expect(state.decks[player].find((card)=>card.name === '1')).toBe(undefined);
            expect(state.decks[player].find((card)=>card.name === '2')).toBe(undefined);
            expect(state.decks[player].find((card)=>card.name === '3')).toBe(undefined);
        })
        it('should draw less than 3 if 3 cards are not valid', ()=>{
            state.distance = DistanceEnum.FAR
            
            drawHand(state); 

            expect(state.hands[player][0].name).toBe('2');
            expect(state.hands[player].length).toBe(1); 
        })
    })
    describe.only('pickCard',()=>{
        let card1;
        let card2; 
        let card3; 
        beforeEach(()=>{
            card1 = makeBlankCard();
            card1.name = "a"; 
            card2 = makeBlankCard();
            card2.name = "b"; 
            card3 = makeBlankCard();
            card3.name = "c"; 
            state.hands[player] = [card1, card2, card3]; 
        })
        it('should tell state about which card is picked',()=>{
            pickCard(0, state); 

            expect(state.pickedCard).toBe(card1)
        })
        it('should empty the hand after a card is picked', ()=>{
            pickCard(0, state); 

            expect(state.hands[player].length).toEqual(0); 
        })
        it('should put non picked cards back in the deck', ()=>{
            pickCard(0, state); 

            expect(state.decks[player].find((card)=> card.name === "b")).not.toBe(undefined);
            expect(state.decks[player].find((card)=> card.name === "c")).not.toBe(undefined);
        })
    })
    describe('addCardToQueue', ()=>{
        it('should put the card into the queue',()=>{
            const card = makeBlankCard();
            state.pickedCard = card; 

            addCardToQueue(state); 

            expect(state.queues[player][0][0]).toBe(card); 
        })
        it('should remove card from pickedCard',()=>{
            const card = makeBlankCard();
            state.pickedCard = card; 

            addCardToQueue(state); 

            expect(state.pickedCard).toBeUndefined(); 
        })
        it('should function like a queue', ()=>{
            const card1 = makeBlankCard(); 
            const card2 = makeBlankCard(); 
            const card3 = makeBlankCard(); 
            state.queues[player] = [[card1], [card2], [card3]]
            const card0 = makeBlankCard();
            state.pickedCard = card0;  

            addCardToQueue(state); 

            expect(state.queues[player][0][0]).toBe(card0);
            expect(state.queues[player][1][0]).toBe(card1); 
            expect(state.queues[player][2][0]).toBe(card2); 
            expect(state.queues[player][3][0]).toBe(card3); 
        })
        it('should handle putting multiple cards into the same bucket', ()=>{
            state.queues[player] = [[makeBlankCard()], [makeBlankCard()], [makeBlankCard()]]
            const card1 = makeBlankCard();
            state.pickedCard = card1;
            addCardToQueue(state);
            
            const card2 = makeBlankCard();
            state.pickedCard = card2;  
            addCardToQueue(state); 

            expect(state.queues[player][0][0]).toBe(card1); 
            expect(state.queues[player][0][1]).toBe(card2); 
        })
    })
    describe("playCard", ()=>{
        let pickedCard = makeBlankCard(); 
        state.pickedCard = pickedCard;  
        it('should gather the readied mechanics', async()=>{
            const _getMechanicsReady = jest.fn(); 

            await playCard(state, {_getMechanicsReady}); 

            expect(_getMechanicsReady).toHaveBeenCalledWith(state); 
        })
        it('should call check predictions', async()=>{
            const _makePredictions = jest.fn(); 

            await playCard(state, {_makePredictions});

            expect(_makePredictions).toHaveBeenCalledWith(state); 
        })
        it('should call store mechanics', async()=>{
            const _storeMechanics = jest.fn(); 

            await playCard(state, {_storeMechanics})

            expect(_storeMechanics).toHaveBeenCalledWith(state); 
        })
        it('should call addCardToQueue', async()=>{
            const _addCardToQueue = jest.fn(); 

            await playCard(state, {_addCardToQueue}); 

            expect(_addCardToQueue).toHaveBeenCalledWith(state);
        })
        it('should apply effects', async()=>{
            const _applyEffects = jest.fn(); 

            await playCard(state, {_applyEffects}); 

            expect(_applyEffects).toHaveBeenCalledWith(state); 
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
                        Predict? //Await
                        Store Mechanics On Card (Predict, Telegraph, Focus)
                Picked Card is put onto Queue //Send X
                Apply Effects (all apply effects jump back to here)
                    Remove Stored Effects
                    Victory?
                        End Game //Send
                    Check Predictions //Send
                        Apply Effects
                    Telegraph? / Focus? //Send
                        Apply Effects
                    Reflex? //Send
                        Shuffle
                        Card Happens
            Remove Old Cards From Queue? 
            Decrement Counters
            Player Turn Over //Send
                Rotate Next Player
*/