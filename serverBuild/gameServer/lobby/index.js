"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = require("../../shared/socket");
const auth_1 = require("../../auth");
const validation_1 = require("../../decks/validation");
const error_1 = require("../../error");
const interface_1 = require("./interface");
const disconnect_1 = require("./disconnect");
const queue_1 = require("./queue");
const game_1 = require("./game");
const human_1 = require("../../agent/human");
const random_1 = require("../../agent/random");
const story_1 = require("../story");
exports.default = (io) => {
    io.on("connection", configureSocket);
};
const configureSocket = async (socket) => {
    try {
        console.log("configuring socket");
        socket.emit(null);
        const player = await makePlayerObject(socket);
        await playerChoosesMode(player);
        if (player.mode == interface_1.GameMode.STORY)
            handleStory(player);
        else
            handleConstructeddGame(player);
    }
    catch (err) {
        if ((err = error_1.ErrorEnum.CARDS_ARENT_IN_STYLES)) {
            console.log(`Error in lobby ${err}`);
            socket.emit(socket_1.SocketEnum.PLAYER_SENT_BAD_INFO, err);
            socket.disconnect();
        }
    }
};
const handleConstructeddGame = async (player) => {
    await playerChoosesDeck(player);
    if (player.mode == interface_1.GameMode.VS_AI)
        playAgainstAI(player);
    else
        joinLobby(player); //NEED SWITCH STATEMENT HERE,
};
const handleStory = (player) => {
    player.socket.emit(socket_1.SocketEnum.SHOULD_SEND_STORY_INFO);
    player.socket.once(socket_1.SocketEnum.STORY_INFO, (storyInfo) => {
        story_1.startStoryCombat(player, storyInfo);
    });
};
const makePlayerObject = async (socket) => {
    const token = socket.handshake.query.token;
    const username = await auth_1.getVerifiedUsername(token);
    const player = { socket, username };
    return player;
};
//This is unity version, now that decks are stored locally.
const playerChoosesDeck = async (player) => {
    return new Promise((res, rej) => {
        player.socket.emit(socket_1.SocketEnum.PLAYER_SHOULD_CHOSE_DECK);
        player.socket.once(socket_1.SocketEnum.PICKED_DECK, (deck) => {
            if (!validation_1.areCardsInStyles(deck.styles, deck.deckList)) {
                rej(error_1.ErrorEnum.CARDS_ARENT_IN_STYLES);
            }
            else {
                player.deck = deck;
                res();
            }
        });
    });
};
const playerChoosesMode = async (player) => {
    return new Promise((res, rej) => {
        player.socket.emit(socket_1.SocketEnum.CHOOSE_GAME_MODE);
        player.socket.once(socket_1.SocketEnum.CHOSE_GAME_MODE, (mode) => {
            player.mode = mode;
            res();
        });
    });
};
const playAgainstAI = async (player) => {
    console.log("creating AI game");
    game_1.createGame([human_1.makeHumanAgent(player), random_1.makeRandomAgent()]);
};
const joinLobby = async (player) => {
    disconnect_1.handleDCDuringLobby(player);
    player.socket.emit(socket_1.SocketEnum.JOINED_LOBBY);
    queue_1.addToLobbyQueue(player);
};
