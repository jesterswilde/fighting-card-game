import { GameActions } from "../game/actions";
import { HandActions } from "../hand/actions";
import { DisplayActions } from "../display/actions";
import { DeckActions } from "../deck/actions";

export type ActionType = GameActions | HandActions | DisplayActions | DeckActions; 