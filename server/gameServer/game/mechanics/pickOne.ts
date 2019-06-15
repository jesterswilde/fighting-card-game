import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { MechanicEnum, Mechanic } from "../../../shared/card";
import { mechanicsToReadiedEffects } from "../readiedEffects";
import { Socket } from "socket.io";
import { SocketEnum } from "../../../shared/socket";

/*
    A player is given a few choices by a card, and get to pick only one. 
*/

export const playerPicksOne = async (player: number, state: GameState, { _waitForPlayerToChoose = waitForPlayerToChoose } = {}) => {
    const { sockets } = state;
    const playerEffects = state.readiedEffects[player] || [];
    const pickedEffects: ReadiedEffect[] = [];
    const unusedEffs: boolean[] = [];
    for (let i = 0; i < playerEffects.length; i++) {
        const { mechanic: effect, card, isEventOnly } = playerEffects[i]
        if (effect.mechanic === MechanicEnum.PICK_ONE && !isEventOnly) {
            const socket = sockets[player];
            const choice = await _waitForPlayerToChoose(effect.choices, socket);
            const picked = effect.choices[choice];
            pickedEffects.push({ mechanic: effect, card, isEventOnly: true })
            pickedEffects.push(...mechanicsToReadiedEffects(picked, card, state));
            unusedEffs.push(false);
        } else {
            unusedEffs.push(true);
        }
    }
    state.readiedEffects[player] = playerEffects.filter((_, i) => unusedEffs[i]);
    state.readiedEffects[player].push(...pickedEffects);
}

const waitForPlayerToChoose = (choices: Mechanic[][], player: Socket): Promise<number> => {
    return new Promise((res, rej) => {
        player.emit(SocketEnum.SHOULD_PICK_ONE, choices);
        player.once(SocketEnum.PICKED_ONE, (choice: number) => {
            res(choice);
        })
    })
}
