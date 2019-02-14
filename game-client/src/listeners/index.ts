import { dispatchSetHandCardDisplay } from "../gameDisplay/dispatch";


const tabDown = (ev: KeyboardEvent)=>{
    if(ev.keyCode === 192){
        dispatchSetHandCardDisplay(true); 
    }
}

const tabUp = (ev: KeyboardEvent)=>{
    if(ev.keyCode === 192){
        dispatchSetHandCardDisplay(false); 
    }
}

document.addEventListener("keydown", tabDown)
document.addEventListener("keyup", tabUp)