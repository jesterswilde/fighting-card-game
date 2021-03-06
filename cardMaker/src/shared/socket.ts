
export enum SocketEnum{
    PICKED_CARD = 'pickedCard',
    GOT_CARDS = 'gotCards',
    JOINED_LOBBY = 'joinedLobby',
    FOUND_GAME = 'foundGame',
    START_GAME = 'startGame',
    GOT_DECK_OPTIONS = 'gotDeckOptions',
    PICKED_DECK = 'pickedDeck',
    GOT_STATE = 'gotState',
    SHOULD_PREDICT = 'shouldPredict',
    MADE_PREDICTION = 'madePrediction',
    SHOULD_PICK_ONE = 'shouldPickOne',
    PICKED_ONE = 'pickedOne',
    GOT_EVENTS = 'gotEvents',
    GOT_FORCEFUL_CHOICE = 'gotForcefulChoice',
    PICKED_FORCEFUL = 'pickedForceful',
    OPPONENT_GOT_CARDS = 'opponentGotCards',
    OPPONENT_PICKED_CARDS = 'opponentPickedCards',
    OPPONENT_IS_MAKING_CHOICES = 'opponentIsMakingChoices',
    OPPONENT_MADE_CHOICE = 'opponentMadeChoice',
    AUTHORIZATION = 'authorization',
    GAME_OVER = 'gameOver',
    END_GAME_CHOICE = 'endGameChoice',
    OPPONENT_LEFT = 'opponentLeft',
}

export enum GameOverEnum {
    FIND_NEW_OPP_WITH_SAME_DECK = 'findOppWithSameDeck',
    FIND_NEW_OPP_WITH_NEW_DECK = 'findNewOppWithNewDeck',

}