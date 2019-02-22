import { MechanicState } from "./interface";
import { deleted, statePieceDeleted } from './reducer';
import { MechanicActionEnum } from './actions';
import { StatePieceEnum } from '../statePiece/actions';

describe('mechanicReducer', () => {
    describe('delete', () => {
        let state: MechanicState;
        beforeEach(() => {
            state = {
                mechanicsById: {
                    0: {
                        id: 0,
                    },
                    1: {
                        id: 1,
                        choices: [[5, 6], [3]]
                    },
                    2: {
                        id: 2,
                        mechEff: [4, 7, 8]
                    },
                    3: {
                        id: 3
                    },
                    4: {
                        id: 4
                    }
                }
            }
        })
        it('should delete the desired mechanic', () => {
            const newState = deleted(state, { type: MechanicActionEnum.DELETED, id: 0 });

            expect(newState).not.toBe(state);
            expect(newState.mechanicsById[0]).toBeUndefined();
        })
        it('should delete mechanic from mechEffs array', () => {
            const newState = deleted(state, { type: MechanicActionEnum.DELETED, id: 4 })

            expect(newState).not.toBe(state);
            expect(newState.mechanicsById[4]).toBeUndefined();
            if (newState.mechanicsById[2].mechEff !== undefined) {
                expect(newState.mechanicsById[2].mechEff.length === 2);
                expect(newState.mechanicsById[2].mechEff.indexOf(4)).toBe(-1);
            } else {
                throw new Error("Failed, mechanicsById[2] is undefined");
            }
        })
        it('should delete from choices', () => {
            const newState = deleted(state, { type: MechanicActionEnum.DELETED, id: 3 })

            if (newState.mechanicsById[1].choices !== undefined && state.mechanicsById[1].choices !== undefined) {
                expect(newState.mechanicsById[1].choices[0]).toBe(state.mechanicsById[1].choices[0]);
                expect(newState.mechanicsById[1].choices[1].length).toBe(0);
            } else {
                throw new Error("Choices was undefined"); 
            }
        })
    })
    describe('statePieceDeleted', () => {
        let state: MechanicState;
        beforeEach(() => {
            state = {
                mechanicsById: {
                    0: {
                        id: 0
                    },
                    1: {
                        id: 1,
                        mechReq: [3, 4, 5]
                    },
                    2: {
                        id: 2,
                        mechReq: [6]
                    }
                }
            }
        })
        it('should remove deleted reqs and leave the rest untouched', () => {
            const newState = statePieceDeleted(state, { type: StatePieceEnum.DELETED, id: 4 })

            expect(newState).not.toBe(state);
            expect(newState.mechanicsById[0]).toBe(state.mechanicsById[0]);
            expect(newState.mechanicsById[2]).toBe(state.mechanicsById[2]);
            if (newState.mechanicsById[1].mechReq !== undefined && state.mechanicsById[1].mechReq !== undefined) {
                expect(newState.mechanicsById[1].mechReq).not.toBe(state.mechanicsById[1].mechReq);
                expect(newState.mechanicsById[1].mechReq).toEqual([3, 5])
            } else {
                throw new Error("Deleted requirement array"); 
            }
        })
    })
})