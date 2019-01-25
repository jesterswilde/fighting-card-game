import { SwitchScreenAction, DisplayActionEnum } from "./actions";
import { store } from "../state/store";
import { ScreenEnum } from "./interface";

export const dispatchSwitchScreen = (screen: ScreenEnum)=>{
    const action: SwitchScreenAction = {
        type: DisplayActionEnum.SWITCH_SCREEN,
        screen
    }
    store.dispatch(action); 
}