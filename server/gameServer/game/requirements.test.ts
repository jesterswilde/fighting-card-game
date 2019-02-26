import { makeGameState, makeBlankCard } from "../util";
import { StatePiece, AxisEnum, PlayerEnum, Card } from "../../shared/card";
import { meetsRequirements, canPlayCard } from "./requirements";
import { GameState, DistanceEnum } from "../interfaces/stateInterface";

describe('Requirements', () => {
    let state: GameState;
    beforeEach(() => {
        state = makeGameState();
        state.distance = DistanceEnum.CLOSE; 
    })

    describe    ('meetsRequirements', () => {
        it('should return true if state is met', () => {
            const req1: StatePiece = { axis: AxisEnum.STANDING, player: PlayerEnum.PLAYER }
            const req2: StatePiece = { axis: AxisEnum.BALANCED, player: PlayerEnum.BOTH }

            const result1 = meetsRequirements(req1, state, 0, 1);
            const result2 = meetsRequirements(req2, state, 0, 1);

            expect(result1).toBe(true);
            expect(result2).toBe(true);
        })
        it('should reject if the reqs are not met', () => {
            const req1: StatePiece = { axis: AxisEnum.FAR, player: PlayerEnum.BOTH }
            const req2: StatePiece = { axis: AxisEnum.PRONE, player: PlayerEnum.OPPONENT }

            const result1 = meetsRequirements(req1, state, 0, 1);
            const result2 = meetsRequirements(req2, state, 0, 1);

            expect(result1).toBe(false);
            expect(result2).toBe(false);
        })
    })

    describe('canPlayCard', () => {
        let card: Card; 
        beforeEach(()=>{
            card = makeBlankCard(); 
        })
        it('should pass if all requirements are met', () => {
            const req1: StatePiece = { axis: AxisEnum.STANDING, player: PlayerEnum.PLAYER }
            const req2: StatePiece = { axis: AxisEnum.CLOSE, player: PlayerEnum.BOTH }
            card.requirements = [req1, req2]

            const result = canPlayCard(card, state);

            expect(result).toEqual(true);
        })
        it('should reject if any of the requirements are not met', () => {
            const req1: StatePiece = { axis: AxisEnum.MOVING, player: PlayerEnum.PLAYER }
            const req2: StatePiece = { axis: AxisEnum.BALANCED, player: PlayerEnum.BOTH }
            card.requirements = [req1, req2]

            const result = canPlayCard(card, state);

            expect(result).toEqual(false);
        })
    })
})