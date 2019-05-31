import { AxisEnum, PlayerEnum } from "../shared/card";

export interface DeckViewerFilter{
    axis: AxisEnum | number,
    player: PlayerEnum | number,
}

export interface FilterState {
    filters: DeckViewerFilter[]
}