import { Socket } from "socket.io";
import { SocketEnum } from "../../shared/socket";
import { getVerifiedUsername } from "../../auth";
import { Deck } from "../../decks/interface";
import { areCardsInStyles } from "../../decks/validation";
import { ErrorEnum } from "../../error";
import { GameMode, PlayerObject } from "./interface";
import { handleDCDuringLobby } from "./disconnect";
import { addToLobbyQueue } from "./queue";
import { createGame } from "./game";
import { makeHumanAgent } from "../../agent/human";
import { makeRandomAgent } from "../../agent/random";

export default (io: SocketIO.Server) => {
  io.on("connection", configureSocket);
};

const configureSocket = async (socket: Socket) => {
  try {
    console.log("configuring socket"); 
    socket.emit(null);
    const player = await makePlayerObject(socket);
    console.log("Asking playe to choose deck"); 
    await playerChoosesDeck(player);
    await playerChoosesMode(player); 
    if(player.mode == GameMode.VS_AI)
      playAgainstAI(player);
    else
      joinLobby(player); //NEED SWITCH STATEMENT HERE,
  } catch (err) {
    if ((err = ErrorEnum.CARDS_ARENT_IN_STYLES)) {
      console.log(`Error in lobby ${err}`);
      socket.emit(SocketEnum.PLAYER_SENT_BAD_INFO, err);
      socket.disconnect();
    }
  }
};

const makePlayerObject = async (socket: Socket) => {
  const token = socket.handshake.query.token;
  const username = await getVerifiedUsername(token);
  const player: PlayerObject = { socket, username };
  return player;
};

//This is unity version, now that decks are stored locally.
const playerChoosesDeck = async (player: PlayerObject) => {
  return new Promise((res, rej) => {
    player.socket.emit(SocketEnum.PLAYER_SHOULD_CHOSE_DECK);
    player.socket.once(SocketEnum.PICKED_DECK, (deck: Deck) => {
      if (!areCardsInStyles(deck.styles, deck.deckList)) {
        rej(ErrorEnum.CARDS_ARENT_IN_STYLES);
      } else {
        player.deck = deck;
        res();
      }
    });
  });
};

const playerChoosesMode = async(player: PlayerObject)=>{
  return new Promise((res, rej) => {
    player.socket.emit(SocketEnum.CHOOSE_GAME_MODE); 
    player.socket.once(SocketEnum.CHOSE_GAME_MODE, (mode: GameMode)=>{
      player.mode = mode
      res()
    }); 
  })
}

const playAgainstAI = async (player: PlayerObject) => {
  console.log("creating AI game")
  createGame([makeHumanAgent(player), makeRandomAgent()]);
};

const joinLobby = async (player: PlayerObject) => {
  handleDCDuringLobby(player);
  player.socket.emit(SocketEnum.JOINED_LOBBY);
  addToLobbyQueue(player);
};
