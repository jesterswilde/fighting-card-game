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
const errors_1 = require("../errors");
const send_1 = require("./send");
const playCard_1 = require("./playCard");
const startTurn_1 = require("./startTurn");
const endTurn_1 = require("./endTurn");
const util_1 = require("../util");
const endGame_1 = require("./endGame");
/*
    Game Start - get decks
    Game Loop
        Turn
            Shuffle
            Make Predicitons //Await
            Draw Cards //Send
                Add Enhancements
                Add Buffs
                Modify hand size based on Fluid / Rigid
            Pick Card //Await  --Reflex Jumps to here
            Make Choices //Await
            Return Unpicked Cards
            Collect Effects and Mechanics
            Card Happens
                Gather Effects
                        Omit Criticals with unmet reqs
                        Store Mechanics On Card (Predict, Telegraph, Focus)
                        Mark Axis for predictions
                Move Cards Up in Queue
                Picked Card is put onto Queue //Send X
                Apply Effects  --Telegaph and Focus jump to here
                    Apply effects
                    Remove Stored Effects
                    Victory?
                        End Game //Send
                    Check Predictions
                        Apply Effects
                    Telegraph?
                        Apply Effects
                    Focus?
                        Apply Effects
                    Reflex?
                        Shuffle
                        Card Happens
            Remove Old Cards From Queue?
            Turn End
                Decrement Counters
*/
exports.playGame = (state) => __awaiter(this, void 0, void 0, function* () {
    try {
        startGame(state);
        console.log("Game has started");
        while (true) {
            console.log("Entering Play Turn");
            yield exports.playTurn(state);
            console.log("Exiting play turn");
        }
    }
    catch (err) {
        if (err === errors_1.ControlEnum.GAME_OVER) {
            endGame_1.endGame(state);
        }
        else {
            console.error(err);
        }
    }
});
const startGame = (state) => {
    console.log("Game starting", state);
    assignPlayerToDecks(state);
    console.log("Assigned players");
    state.agents.forEach((agent, i) => {
        agent.startGame(i);
    });
};
exports.playTurn = (state) => __awaiter(this, void 0, void 0, function* () {
    send_1.sendState(state);
    yield startTurn_1.startTurn(state);
    yield playCard_1.playCards(state);
    console.log("Effects at end of turn", state.currentEvent[0].effects);
    endTurn_1.endTurn(state);
});
const assignPlayerToDecks = (state) => {
    for (let player = 0; player < state.decks.length; player++) {
        const deck = state.decks[player];
        for (let i = 0; i < deck.length; i++) {
            if (typeof deck[i] !== "object") {
                console.log("Missing card", deck[i]);
            }
            else {
                deck[i].player = player;
                deck[i].opponent = util_1.getOpponent(player);
                deck[i].id = state.cardUID++;
            }
        }
    }
};
