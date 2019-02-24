import { RequirementEffectJSON } from '../interfaces/cardJSON';
import { Optional, makeDefaultOptional } from './interface';
import { getID } from '../utils';
import { statePieceFromJSON } from '../statePiece/json';
import { mechFromJSON } from '../mechanic/json';
import { dispatchUpdateOptional } from './dispatch';

export const optionalFromJSON = (optJSON?: RequirementEffectJSON): number => {
    let optional: Optional; 
    if(optJSON === undefined){
        optional = makeDefaultOptional(); 
    }else{
        optional = {} as Optional;
        if (optJSON.id !== undefined) {
            optional.id = optJSON.id;
        } else {
            optional.id = getID();
        }
        optional.requirements = optJSON.requirements.map(statePieceFromJSON);
        optional.effects = optJSON.effects.map(mechFromJSON);
    }
    dispatchUpdateOptional(optional.id, optional);
    return optional.id;
}