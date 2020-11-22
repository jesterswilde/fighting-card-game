import { Socket } from "socket.io"; 
import { Deck } from "../../decks/interface";

export interface PlayerObject {
    socket: Socket;
    username: string;
    deck?: Deck;
    didDC?: boolean;
    mode?: GameMode
  }

  export enum GameMode { 
    VS_PLAYER = "vs Player",
    VS_AI = "vs AI",
    STORY = "Story",
  }