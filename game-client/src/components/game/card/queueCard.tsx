import { h } from 'preact';
import { Card } from '../../../shared/card';
import Effect from './effect'

interface Props extends Card {
    identity: number
}

const QueueCard = ({identity, name, telegraphs = [], focuses = [], player }: Props) => {
    const shouldFlip = identity !== player; 
    return <div>
        <div>{name}</div>
        {telegraphs.map((eff, i) => <div key={i}><Effect shouldFlip={shouldFlip} effect={eff} /></div>)}
        {focuses.map((eff, i) => <div key={i}><Effect shouldFlip={shouldFlip} effect={eff} /></div>)}
    </div>
}

export default QueueCard; 