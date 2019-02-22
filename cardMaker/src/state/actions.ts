import { PathActions } from '../path/actions';
import { CardActions } from '../card/actions';
import { StatePieceActions } from '../statePiece/actions';
import { MechanicActions } from '../mechanic/actions';
import { OptionalActions } from '../optional/action';

export type ActionType = PathActions | CardActions | StatePieceActions | MechanicActions | OptionalActions;