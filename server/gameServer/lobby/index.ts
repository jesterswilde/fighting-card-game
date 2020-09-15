import { Socket } from "socket.io";
import { GameState, DistanceEnum } from "../interfaces/stateInterface";
import { STARTING_HEALTH } from "../gameSettings";
import {
  makePlayerState,
  makeModifiedAxis,
  makeStateDurations,
  deepCopy,
} from "../util";
import { SocketEnum } from "../../shared/socket";
import { playGame } from "../game/game";
import { getVerifiedUsername } from "../../auth";
import { Deck } from "../../decks/interface";
import { deckListToCards } from "../../cards/Cards";
import { areCardsInStyles } from "../../decks/validation";
import { ErrorEnum } from "../../error";
import { Agent } from "../../agent";
import { AgentType } from "../../agent/interface";
import { makeHumanAgent } from "../../agent/human";
import { Card } from "../../shared/card";
import { PlayerObject } from "./interface";
import { handleDCDuringLobby } from "./disconnect";
import { addToLobbyQueue } from "./queue";

export default (io: SocketIO.Server) => {
  io.on("connection", configureSocket);
};


const configureSocket = async (socket: Socket) => {
  try {
    socket.emit(null);
    const player = await makePlayerObject(socket);
    await playerChoosesDeck(player);
    joinLobby(player);
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

const joinLobby = async (player: PlayerObject) => {
  handleDCDuringLobby(player);
  player.socket.emit(SocketEnum.JOINED_LOBBY);
  addToLobbyQueue(player); 
};