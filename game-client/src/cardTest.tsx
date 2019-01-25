import {h} from 'preact'; 
import CardView from './components/game/card/viewer';
import { Card } from './interfaces/card';

const cards: Card[] = [
    { "effects": [{ "player": 1, "axis": "Damage", "amount": 4 }], "name": "Neck Break", "optional": [{ "effects": [{ "player": 1, "axis": "Damage", "amount": 2 }, { "player": 1, "axis": "Unbalanced", "amount": 3 }], "requirements": [{ "axis": "Anticipating", "player": 0 }] }, { "effects": [{ "player": 1, "axis": "Damage", "amount": 1 }], "requirements": [{ "axis": "Unbalanced", "player": 1 }] }], "requirements": [{ "axis": "Prone", "player": 2 }, { "axis": "Grappled", "player": 2 }, { "axis": "Balanced", "player": 0 }] },
    { "effects": [{ "player": 2, "axis": "Grappled" }, { "mechanic": "Lock", "player": 2, "axis": "Grappled", "amount": 1 }, { "mechanic": "Predict", "mechanicEffects": [{ "player": 0, "axis": "Prone", "amount": 3 }] }], "name": "Leg Grab", "optional": [], "requirements": [{ "axis": "Close", "player": 2 }, { "axis": "Balanced", "player": 0 }] },
    {"effects":[{"player":1,"axis":"Damage","amount":1},{"player":0,"axis":"Anticipating","amount":2},{"player":1,"axis":"Prone","amount":2}],"name":"Opportunist","optional":[{"effects":[{"mechanic":"Reflex"}],"requirements":[{"axis":"Anticipating","player":0}]}],"requirements":[{"axis":"Not Far","player":2},{"axis":"Unbalanced","player":1}]}
] as Card[]

export default ()=>{
    return <div class='card-container'>
        {cards.map((card)=> <div class='inline'><CardView card={card}/></div>)}
    </div>
}