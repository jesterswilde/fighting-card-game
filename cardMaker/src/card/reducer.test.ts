import { CardState } from "./interface";
import { deletedStatePiece, deletedMechanic, deletedOptional } from './reducer';
import { StatePieceEnum } from '../statePiece/actions';
import { MechanicActionEnum } from '../mechanic/actions';
import { OptionalEnum } from '../optional/action';

describe("cardReducer", () => {
    const state: CardState = {
        editingCard: {
            requirements: [0, 1, 2],
            effects: [3, 4, 5],
            optional: [6, 7],
            name: 'card',
            tagObjs: []
        },
        cardNames: []
    }
    describe("deletedStatePiece", () => {
        it('should delete the state piece without affecting the other parts', () => {
            const newState = deletedStatePiece(state, { type: StatePieceEnum.DELETED, id: 1 })

            expect(newState).not.toBe(state);
            expect(newState.editingCard).not.toBe(state);
            if (newState.editingCard !== null && state.editingCard !== null) {
                expect(newState.editingCard.effects).toBe(state.editingCard.effects);
                expect(newState.editingCard.optional).toBe(state.editingCard.optional);
                expect(newState.editingCard.requirements).not.toBe(state.editingCard.requirements);
                expect(newState.editingCard.requirements).toEqual([0, 2]);
            } else {
                throw new Error('editing card was null'); 
            }

        })
    })
    describe("deletedMechanic", () => {
        const newState = deletedMechanic(state, { type: MechanicActionEnum.DELETED, id: 4 })

        expect(newState).not.toBe(state);
        expect(newState.editingCard).not.toBe(state);
        if (newState.editingCard !== null && state.editingCard !== null) {
            expect(newState.editingCard.requirements).toBe(state.editingCard.requirements);
            expect(newState.editingCard.optional).toBe(state.editingCard.optional);
            expect(newState.editingCard.effects).not.toBe(state.editingCard.effects);
            expect(newState.editingCard.effects).toEqual([3, 5]);
        } else {
            throw new Error('editing card was null'); 
        }
    })
    describe("deletedOptiona",()=>{
        const newState = deletedOptional(state, { type: OptionalEnum.DELETED, id: 6 })

        expect(newState).not.toBe(state);
        expect(newState.editingCard).not.toBe(state);
        if (newState.editingCard !== null && state.editingCard !== null) {
            expect(newState.editingCard.requirements).toBe(state.editingCard.requirements);
            expect(newState.editingCard.effects).toBe(state.editingCard.effects);
            expect(newState.editingCard.optional).not.toBe(state.editingCard.optional);
            expect(newState.editingCard.optional).toEqual([7]);
        } else {
            throw new Error('editing card was null'); 
        }
    })
})