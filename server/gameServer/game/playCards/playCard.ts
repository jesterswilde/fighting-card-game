import { cardHappens } from "./cardHappens";
import { ControlEnum } from "../../errors";
import { GameState, ReadiedEffect } from "../../interfaces/stateInterface";
import { canUseOptional } from "./requirements";
import { markAxisChange } from "./modifiedAxis";
import { Mechanic, Card } from "../../../shared/card";
import { mechanicsToReadiedEffects } from "../readiedEffects";
import { playersMakeChoices } from "./playerInput";
import { processPlayedCardEvents } from "../events";

export const playCards = async (state: GameState) => {
    try {
        await playersMakeChoices(state);
        processPlayedCardEvents(state); 
        markAxisChanges(state);
        incrementQueue(state);
        addCardsToQueue(state);
        cardHappens(state);
    } catch (err) {
        console.log("err", err)
        if (err === ControlEnum.PLAY_CARD) {
            console.log('caught and playing card');
            await playCards(state);
        } else {
            throw err;
        }
    }
}

export const getPlayerMechanicsReady = (playedBy: number, state: GameState)=>{
    const card = state.pickedCards[playedBy]; 
    if(card === undefined || card === null){
        return; 
    }
    const { optional = [], effects = [], enhancements = [], player, opponent } = card;
        const validOptEff: Mechanic[] = optional.filter((reqEff) => canUseOptional(reqEff, player, opponent, state))
            .reduce((effsArr, reqEffs) => {
                effsArr.push(...reqEffs.effects);
                return effsArr;
            }, [])
        const enhanceEffs = enhancements.reduce((effs: Mechanic[], { mechanics = [] }) => {
            effs.push(...mechanics);
            return effs;
        }, [])
        const allEffects: Mechanic[] = [...effects, ...validOptEff, ...enhanceEffs];
        state.readiedEffects[playedBy] = mechanicsToReadiedEffects(allEffects, card, state);
}

export const getMechanicsReady = (state: GameState) => {
    state.pickedCards.forEach((card, playedBy) => {
        const { optional = [], effects = [], enhancements = [], player, opponent } = card;
        const validOptEff: Mechanic[] = optional.filter((reqEff) => canUseOptional(reqEff, player, opponent, state))
            .reduce((effsArr, reqEffs) => {
                effsArr.push(...reqEffs.effects);
                return effsArr;
            }, [])
        const enhanceEffs = enhancements.reduce((effs: Mechanic[], { mechanics = [] }) => {
            effs.push(...mechanics);
            return effs;
        }, [])
        const allEffects: Mechanic[] = [...effects, ...validOptEff, ...enhanceEffs];
        state.readiedEffects[playedBy] = mechanicsToReadiedEffects(allEffects, card, state);
    })
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

export const addCardsToQueue = (state: GameState) => {
    state.pickedCards.forEach((card, player) => {
        if(card !== undefined && card !== null){
            addCardToQueue(card, player, state);
        }
    })
}

const addCardToQueue = (card: Card, player: number, state: GameState) => {
    const { queue } = state;
    const slot = 0;
    state.pickedCards[player] = null;
    queue[slot] = queue[slot] || []; 
    queue[slot][player] = queue[slot][player] || [];
    queue[slot][player].push(card);
}

export const markAxisChanges = (state: GameState) => {
    if (state.readiedEffects) {
        state.readiedEffects.forEach((playerEffect = []) => {
            playerEffect.forEach(({ mechanic, card }) => {
                markAxisChange(mechanic, card, state);
            })
        })
    }
}