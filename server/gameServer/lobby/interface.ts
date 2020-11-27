import { Socket } from "socket.io"; 
import { Deck } from "../../decks/interface";
import { AxisEnum, PlayerEnum } from "../../shared/card";

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


  export interface GameMods{
    startingPositions: StateMod[]
    health: (number|null)[]
  }
  export interface StateMod{
        axis: AxisEnum,
        player: PlayerEnum,
        value: number
  }