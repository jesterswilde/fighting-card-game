import { Card, AxisEnum, PlayerEnum } from "../shared/card";
import {PoiseEnum, StandingEnum, MotionEnum, DistanceEnum} from '../game/interface'

export interface Deck{
    cards: Card[],
    name: string,
    description?: string
}

export interface DeckDescription{
    name: string,
    id?: number,
    description?: string
}

export interface DeckViewerFilter{
    axis: AxisEnum | number,
    player: PlayerEnum | number,
}

export interface DeckViewerState{
    deck: Deck,
    isLoadingDeckList: boolean,
    isLoadingDeck: boolean,
    deckList: DeckDescription[]
    filters: DeckViewerFilter[]
}