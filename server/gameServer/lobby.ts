import { Socket } from "socket.io";
import { GameState, DistanceEnum } from "./interfaces/stateInterface";
import { STARTING_HEALTH } from "./gameSettings";
import { makePlayerState, makeModifiedAxis, makeStateDurations, deepCopy } from "./util";
import { SocketEnum } from "../shared/socket";
import { getDeckOptions, getDeck } from "../decks";
import { Card } from "./interfaces/cardInterface";
import { playGame } from "./game/game";


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

const createGame = async(player1: Socket, player2: Socket) => {
    const players = [player1, player2];
    const deckPromises = players.map(playerPicksDeck);
    let decks = await Promise.all<Card[]>(deckPromises);
    decks = decks.map((deck)=> deepCopy(deck)); 
    console.log('all deck choices in'); 
    const state = makeGameState(players, decks); 
    playGame(state); 
}

const playerPicksDeck = (player: Socket):Promise<Card[]> => {
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

const makeGameState = (sockets: Socket[], decks: Card[][])=>{
    const state: GameState = {
        sockets,
        decks,
        health: [STARTING_HEALTH, STARTING_HEALTH],
        currentPlayer: 0,
        playerStates: [makePlayerState(), makePlayerState()],
        stateDurations: [makeStateDurations(), makeStateDurations()],
        readiedEffects: [],
        modifiedAxis: makeModifiedAxis(),
        block: [0, 0],
        queue: [],
        distance: DistanceEnum.FAR,
        hands: [[], []],
        turnNumber: 0,
        tagModification: [{},{}],
        damaged: [false,false],
        lockedState: {
            distance: null,
            players: [
                {motion: null, poise: null, stance: null},
                {motion: null, poise: null, stance: null}
            ]
        },
        events:[]
    }
    return state; 
}