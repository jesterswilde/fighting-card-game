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
const socket_1 = require("../../../shared/socket");
const util_1 = require("../../util");
const playCard_1 = require("./playCard");
const events_1 = require("../events");
const predict_1 = require("../mechanics/predict");
const pickOne_1 = require("../mechanics/pickOne");
const forceful_1 = require("../mechanics/forceful");
const enhance_1 = require("../mechanics/enhance");
exports.playersMakeChoices = (state) => {
    const promiseArr = state.sockets.map((_, player) => playerMakesChoices(player, state));
    return Promise.all(promiseArr);
};
const playerMakesChoices = (player, state) => __awaiter(this, void 0, void 0, function* () {
    yield predict_1.playerMakesPredictions(player, state);
    yield playerPicksCard(player, state);
    events_1.storePlayedCardEvent(player, state);
    playCard_1.getPlayerMechanicsReady(player, state);
    yield pickOne_1.playerPicksOne(player, state);
    yield forceful_1.playerChoosesForce(player, state);
});
const playerPicksCard = (player, state) => __awaiter(this, void 0, void 0, function* () {
    if (state.hands[player] === undefined || state.hands[player].length === 0) {
        return;
    }
    const { sockets } = state;
    const opponent = util_1.getOpponent(player);
    return new Promise((res, rej) => {
        sockets[player].once(socket_1.SocketEnum.PICKED_CARD, (index) => {
            exports.pickCard(player, index, state);
            sockets[opponent].emit(socket_1.SocketEnum.OPPONENT_PICKED_CARDS);
            res();
        });
    });
});
exports.pickCard = (player, cardNumber, state) => {
    const { hands, decks } = state;
    const card = hands[player][cardNumber];
    const unusedCards = hands[player].filter((_, i) => i !== cardNumber);
    unusedCards.forEach(enhance_1.removeEnhancements);
    decks[player].push(...unusedCards);
    hands[player] = [];
    card.opponent = util_1.getOpponent(player);
    state.pickedCards[player] = card;
};
