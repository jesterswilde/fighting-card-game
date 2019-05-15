import {h} from 'preact'; 
import { Card } from '../../shared/card';

interface Props {
    card: Card
    shouldFlip?: boolean
}

export default ({card}: Props)=>{
    return <div class="placeholder-card">
        <div class="title">{card.name}</div>
    </div>
}