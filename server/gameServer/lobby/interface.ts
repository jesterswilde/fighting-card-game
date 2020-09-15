import { Socket } from "socket.io";
import { Deck } from "../../decks/interface";

export interface PlayerObject {
    socket: Socket;
    username: string;
    deck?: Deck;
    didDC?: boolean;
  }