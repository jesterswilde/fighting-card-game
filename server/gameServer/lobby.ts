import { Socket } from "socket.io";
import { GameState, DistanceEnum } from "./interfaces/stateInterface";
import { STARTING_HEALTH } from "./gameSettings";
import { makePlayerState, makeModifiedAxis, makeStateDurations, deepCopy } from "./util";
import { SocketEnum } from "../shared/socket";
import { getDeckOptions, getDeck } from "../decks";
import { playGame } from "./game/game";
import { Card } from "../shared/card";


let queue: Socket[] = [];
export default (io: SocketIO.Server) => {
    io.on('connection', joinLobby)
}


const joinLobby = (player: Socket) => {
    console.log('joining lobby');
    player.emit(SocketEnum.JOINED_LOBBY);
    if (queue.length > 0) {
        console.log('starting game');
        createGame(queue[0], player);
        queue = [];
    } else {
        queue.push(player);
    }
}

const createGame = async (player1: Socket, player2: Socket) => {
    const players = [player1, player2];
    const deckPromises = players.map(playerPicksDeck);
    let decks = await Promise.all<Card[]>(deckPromises);
    decks = decks.map((deck) => deepCopy(deck));
    console.log('all deck choices in');
    const state = makeGameState(players, decks);
    playGame(state);
}

const playerPicksDeck = (player: Socket): Promise<Card[]> => {
    return new Promise((res, rej) => {
        const deckOptions = getDeckOptions();
        player.emit(SocketEnum.GOT_DECK_OPTIONS, deckOptions);
        player.once(SocketEnum.PICKED_DECK, (index) => {
            console.log('got deck choice')
            const deck = getDeck(deckOptions[index].name);
            res(deck);
        })
    })
}

const makeGameState = (sockets: Socket[], decks: Card[][]) => {
    const state: GameState = {
        numPlayers: 2,
        sockets,
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
        modifiedAxis: makeModifiedAxis(),
        damaged: [false, false],
        tagModification: [{}, {}],
        lockedState: {
            distance: null,
            players: [
                { motion: null, poise: null, stance: null },
                { motion: null, poise: null, stance: null }
            ]
        },
        turnNumber: 0,
        events: []
    }
    return state;
}