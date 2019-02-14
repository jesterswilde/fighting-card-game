import { applyEffects } from "./applyEffects";
import { ControlEnum } from "../errors";
import { GameState, PredictionState, PredictionEnum, ReadiedEffect } from "../interfaces/stateInterface";
import { deepCopy } from "../util";
import { canUseOptional } from "./requirements";
import { Mechanic, MechanicEnum, Card } from "../interfaces/cardInterface";
import { markAxisChange } from "./modifiedAxis";
import { addCardEvent } from "./events";
import { playerPicksOne, makePredictions, CheckForForecful as checkForForceful } from "./playCards/playerInput";

export const playCard = async (state: GameState) => {
    try {
        addCardEvent(state.pickedCard, state); 
        getMechanicsReady(state);
        await playerPicksOne(state);
        await makePredictions(state);
        await checkForForceful(state); 
        markAxisChanges(state);
        incrementQueue(state);
        addCardToQueue(state);
        applyEffects(state);
    } catch (err) {
        console.log("err", err)
        if (err === ControlEnum.PLAY_CARD) {
            console.log('caught and playing card');
            await playCard(state);
        } else {
            throw err;
        }
    }
}

export const getMechanicsReady = (state: GameState) => {
    const { optional = [], effects = [] } = state.pickedCard;
    const validOptEff = optional.filter((reqEff) => canUseOptional(reqEff, state.pickedCard.player, state.pickedCard.opponent, state))
        .reduce((effsArr, reqEffs) => {
            effsArr.push(...reqEffs.effects);
            return effsArr;
        }, [])

    const allEffects = [...effects, ...validOptEff];
    state.readiedEffects = mechanicsToReadiedEffects(allEffects, state.pickedCard);
}

export const mechanicsToReadiedEffects = (mechanics: Mechanic[] = [], card: Card): ReadiedEffect[] => {
    return mechanics.map((mech) => mechanicToReadiedEffect(mech, card));
}

export const mechanicToReadiedEffect = (mechanic: Mechanic, card: Card): ReadiedEffect => {
    return { mechanic: deepCopy(mechanic), card }
}

export const incrementQueue = (state: GameState) => {
    const { queue } = state;
    if (!state.incrementedQueue) {
        for (let i = queue.length - 1; i >= 0; i--) {
            queue[i + 1] = queue[i];
        }
        queue[0] = [];
        state.incrementedQueue = true;
    }
}

export const addCardToQueue = (state: GameState) => {
    const { currentPlayer: player, queue } = state;
    const pickedCard = state.pickedCard;
    state.pickedCard = undefined;
    queue[0] = queue[0] || [];
    queue[0].push(pickedCard);
}

export const markAxisChanges = (state: GameState) => {
    if (state.readiedEffects) {
        state.readiedEffects.forEach(({mechanic, card}) => {
            markAxisChange(mechanic, card, state);
        })
    }
}