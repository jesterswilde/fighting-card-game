import { PathActions } from 'src/path/actions';
import { CardActions } from 'src/card/actions';
import { StatePieceActions } from 'src/statePiece/actions';
import { MechanicActions } from 'src/mechanic/actions';
import { OptionalActions } from 'src/optional/action';

export type ActionType = PathActions | CardActions | StatePieceActions | MechanicActions | OptionalActions;