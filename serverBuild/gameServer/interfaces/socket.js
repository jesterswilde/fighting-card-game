"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SocketEnum;
(function (SocketEnum) {
    SocketEnum["PICKED_CARD"] = "pickedCard";
    SocketEnum["GOT_CARDS"] = "gotCards";
    SocketEnum["JOINED_LOBBY"] = "joinedLobby";
    SocketEnum["FOUND_GAME"] = "foundGame";
    SocketEnum["START_GAME"] = "startGame";
    SocketEnum["GOT_DECK_OPTIONS"] = "gotDeckOptions";
    SocketEnum["PICKED_DECK"] = "pickedDeck";
    SocketEnum["GOT_STATE"] = "gotState";
    SocketEnum["SHOULD_PREDICT"] = "shouldPredict";
    SocketEnum["MADE_PREDICTION"] = "madePrediction";
    SocketEnum["SHOULD_PICK_ONE"] = "shouldPickOne";
    SocketEnum["PICKED_ONE"] = "pickedOne";
})(SocketEnum = exports.SocketEnum || (exports.SocketEnum = {}));
