import { GameActions } from "../game/actions";
import { HandActions } from "../hand/actions";
import { DisplayActions } from "../display/actions";
import { LobbyActions } from "../lobby/actions";
import { ScreenDisplayActions } from "../gameDisplay/actions";
import { EventActions } from "../events/actions";
import { DeckViewerActions } from "../deckViewer/actions";
import { PathActions } from "../path/actions";
import { SocketActions } from "../socket/actions";
import { FightingStyleActions } from "../fightingStyles/actions";
import { UserActions } from "../user/actions";
import { DeckEditorActions } from "../deckBuilder/actions";
import { FilterActions } from "../filters/actions";

export type ActionType = GameActions | HandActions | DisplayActions | LobbyActions | ScreenDisplayActions | 
    EventActions | DeckViewerActions | PathActions | SocketActions | FightingStyleActions | UserActions | 
    DeckEditorActions | FilterActions; 