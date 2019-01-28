import { h } from 'preact';
import { Card } from '../../../interfaces/card';
import Effect from './effect'

interface Props extends Card { }

const QueueCard = ({name, telegraphs = [], focuses = [] }: Props) => {
    return <div>
        <div>{name}</div>
        {telegraphs.map((eff, i) => <div key={i}><Effect effect={eff} /></div>)}
        {focuses.map((eff, i) => <div key={i}><Effect effect={eff} /></div>)}
    </div>
}

export default QueueCard; 