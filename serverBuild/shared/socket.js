"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameOverEnum = exports.SocketEnum = void 0;
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
    SocketEnum["GOT_EVENTS"] = "gotEvents";
    SocketEnum["GOT_FORCEFUL_CHOICE"] = "gotForcefulChoice";
    SocketEnum["PICKED_FORCEFUL"] = "pickedForceful";
    SocketEnum["OPPONENT_GOT_CARDS"] = "opponentGotCards";
    SocketEnum["OPPONENT_PICKED_CARDS"] = "opponentPickedCards";
    SocketEnum["OPPONENT_IS_MAKING_CHOICES"] = "opponentIsMakingChoices";
    SocketEnum["OPPONENT_MADE_CHOICE"] = "opponentMadeChoice";
    SocketEnum["AUTHORIZATION"] = "authorization";
    SocketEnum["GAME_OVER"] = "gameOver";
    SocketEnum["END_GAME_CHOICE"] = "endGameChoice";
    SocketEnum["OPPONENT_LEFT"] = "opponentLeft";
    SocketEnum["PLAYER_SHOULD_CHOSE_DECK"] = "playerShouldChoseDeck";
    SocketEnum["PLAYER_SENT_BAD_INFO"] = "playerSentBadInfo";
    SocketEnum["CHOOSE_GAME_MODE"] = "chooseGameMode";
    SocketEnum["CHOSE_GAME_MODE"] = "choseGameMode";
    SocketEnum["SHOULD_SEND_STORY_INFO"] = "shouldSendStoryInfo";
    SocketEnum["STORY_INFO"] = "storyInfo";
})(SocketEnum = exports.SocketEnum || (exports.SocketEnum = {}));
var GameOverEnum;
(function (GameOverEnum) {
    GameOverEnum["FIND_NEW_OPP_WITH_SAME_DECK"] = "findOppWithSameDeck";
    GameOverEnum["FIND_NEW_OPP_WITH_NEW_DECK"] = "findNewOppWithNewDeck";
})(GameOverEnum = exports.GameOverEnum || (exports.GameOverEnum = {}));
