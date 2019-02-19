import {h} from 'preact'; 
import { dispatchToPathArray as to } from '../path/dispatch';

export default ()=>{
    return <nav class='navbar'>
        <a onClick={()=> to([''])}>
            Home
        </a>
    </nav>
}