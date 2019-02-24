import { PathActions } from '../path/actions';
import { CardActions } from '../card/actions';
import { StatePieceActions } from '../statePiece/actions';
import { MechActions } from '../mechanic/actions';
import { OptionalActions } from '../optional/action';

export type ActionType = PathActions | CardActions | StatePieceActions | MechActions | OptionalActions;