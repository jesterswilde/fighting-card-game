import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { splitArray } from "../../util";
import { MechanicEnum, Mechanic } from "../../../shared/card";
import { mechanicsToReadiedEffects } from "../readiedEffects";
import { Socket } from "socket.io";
import { SocketEnum } from "../../../shared/socket";

/*
    Give up N poise, to gain an effect. 
    Forceful is it's own choice, but only shows up if you can pay it. 
*/

export const playerChoosesForce = async (player: number, state: GameState) => {
    const { readiedEffects = [] } = state;
    let playerEffects = readiedEffects[player] || [];
    let [allForcefulArr, unused] = splitArray(playerEffects, ({ mechanic }) => mechanic.mechanic === MechanicEnum.FORCEFUL);
    const validForcefulArr = allForcefulArr.filter(({ mechanic }) => state.playerStates[player].poise >= mechanic.amount);
    const readiedArr: ReadiedEffect[] = []
    for (let i = 0; i < validForcefulArr.length; i++) {
        const { card: { name: cardName }, mechanic, card } = validForcefulArr[i];
        const socket = state.sockets[player];
        const choseToPlay = await getForcefulChoice(socket, mechanic, cardName);
        if (choseToPlay) {
            state.playerStates[player].poise -= typeof mechanic.amount === 'number' ? mechanic.amount : 0;
            readiedArr.push({ mechanic, card, isEventOnly: true })
            const readied = mechanicsToReadiedEffects(mechanic.mechanicEffects, card, state);
            readiedArr.push(...readied);
        }
    }
    state.readiedEffects[player] = [...unused, ...readiedArr];
}

const getForcefulChoice = (socket: Socket, mechanic: Mechanic, cardName: string): Promise<boolean> => {
    return new Promise((res, rej) => {
        socket.emit(SocketEnum.GOT_FORCEFUL_CHOICE, { mechanic, cardName });
        socket.once(SocketEnum.PICKED_FORCEFUL, (useForecful: boolean) => {
            res(useForecful);
        })
    })
}

