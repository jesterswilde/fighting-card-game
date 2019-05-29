import { Socket } from "socket.io";
import { GameState, DistanceEnum } from "./interfaces/stateInterface";
import { STARTING_HEALTH } from "./gameSettings";
import { makePlayerState, makeModifiedAxis, makeStateDurations, deepCopy } from "./util";
import { SocketEnum } from "../shared/socket";
import { getDeck } from "../decks/premade";
import { playGame } from "./game/game";
import { Card } from "../shared/card";
import { getVerifiedUsername } from "../auth";
import { getDeckOptions } from "../decks";


let queue: PlayerObject[] = [];
export default (io: SocketIO.Server) => {
    io.on('connection', configureSocket)
}

interface PlayerObject {
    socket: Socket
    username: string | null
}

const joinLobby = async (player: PlayerObject) => {
    console.log('joining lobby');
    handleDCDuringLobby(player.socket);
    player.socket.emit(SocketEnum.JOINED_LOBBY);
    if (queue.length > 0) {
        console.log('starting game');
        createGame(queue[0], player);
        queue = [];
    } else {
        queue.push(player);
    }
}

const configureSocket = async (socket: Socket) => {
    const player = await makePlayerObject(socket);
    joinLobby(player);
}

const makePlayerObject = async (socket: Socket) => {
    const token = socket.handshake.query.token;
    const username = await getVerifiedUsername(token);
    const player: PlayerObject = { socket, username };
    return player;
}

const createGame = async (player1: PlayerObject, player2: PlayerObject) => {
    const players = [player1, player2];
    handleDCDuringGame(players);
    const deckPromises = players.map(playerPicksDeck);
    let decks = await Promise.all<Card[]>(deckPromises);
    decks = decks.map((deck) => deepCopy(deck));
    console.log('all deck choices in');
    const state = makeGameState(players, decks);
    playGame(state);
}

const handleDCDuringGame = (players: PlayerObject[]) => {
    players.forEach((playerObj) => {
        playerObj.socket.removeAllListeners('disconnect');
        playerObj.socket.on('disconnect', () => {
            console.log('disconnected during game');
            players.filter((otherPlayer) => otherPlayer !== playerObj).forEach(joinLobby);
        })
    })
}

const handleDCDuringLobby = (dcSocket: Socket) => {
    dcSocket.removeAllListeners('disconnect');
    dcSocket.on('disconnect', () => {
        console.log('disconnected during lobby');
        queue = queue.filter((playerObject) => playerObject.socket !== dcSocket);
    })
}


const playerPicksDeck = async (player: PlayerObject): Promise<Card[]> => {
    return new Promise(async (res, rej) => {
        const deckOptions = await getDeckOptions(player.username);
        player.socket.emit(SocketEnum.GOT_DECK_OPTIONS, deckOptions);
        player.socket.once(SocketEnum.PICKED_DECK, async (index) => {
            console.log('got deck choice')
            const deck = await getDeck(deckOptions[index]);
            res(deck);
        })
    })
}

const makeGameState = (players: PlayerObject[], decks: Card[][]) => {
    const state: GameState = {
        numPlayers: 2,
        usernames: players.map(({ username }) => username),
        sockets: players.map(({ socket }) => socket),
        queue: [],
        decks,
        hands: [[], []],
        pickedCards: [],
        health: [STARTING_HEALTH, STARTING_HEALTH],
        parry: [0, 0],
        block: [0, 0],
        playerStates: [makePlayerState(), makePlayerState()],
        distance: DistanceEnum.FAR,
        stateDurations: [makeStateDurations(), makeStateDurations()],
        readiedEffects: [[], []],
        damageEffects: [[], []],
        modifiedAxis: [makeModifiedAxis(), makeModifiedAxis()],
        predictions: [],
        pendingPredictions: [],
        damaged: [false, false],
        setup: [0, 0],
        pendingSetup: [0, 0],
        tagModification: [{}, {}],
        tagsPlayed: [{}, {}],
        lockedState: {
            distance: null,
            players: [
                { motion: null, poise: null, stance: null },
                { motion: null, poise: null, stance: null }
            ]
        },
        turnNumber: 0,
        cardUID: 0,
        events: []
    }
    return state;
}