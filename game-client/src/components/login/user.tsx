import {h} from 'preact'; 
import Login from './login'; 
import Create from './create'; 

interface Props {
    path: string[]
}

export default ({path}: Props)=>{
    if(path.length === 0){
        return<h2>
            Unimplemented Dashboard
        </h2>
    }
    if(path[0] === 'login'){
        //@ts-ignore
        return <Login />
    }
    if(path[0] === 'create'){
        //@ts-ignore
        return <Create />
    }
}