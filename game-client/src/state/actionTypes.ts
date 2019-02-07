import { GameActions } from "../game/actions";
import { HandActions } from "../hand/actions";
import { DisplayActions } from "../display/actions";
import { DeckActions } from "../deck/actions";
import { ScreenDisplayActions } from "../gameDisplay/actions";
import { EventActions } from "../events/actions";

export type ActionType = GameActions | HandActions | DisplayActions | DeckActions | ScreenDisplayActions | 
    EventActions; 