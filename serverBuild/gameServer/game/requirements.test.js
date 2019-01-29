"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const cardInterface_1 = require("../interfaces/cardInterface");
const requirements_1 = require("./requirements");
const stateInterface_1 = require("../interfaces/stateInterface");
describe('Requirements', () => {
    let state;
    beforeEach(() => {
        state = util_1.makeGameState();
        state.distance = stateInterface_1.DistanceEnum.CLOSE;
    });
    describe('meetsRequirements', () => {
        it('should return true if state is met', () => {
            const req1 = { axis: cardInterface_1.AxisEnum.STANDING, player: cardInterface_1.PlayerEnum.PLAYER };
            const req2 = { axis: cardInterface_1.AxisEnum.BALANCED, player: cardInterface_1.PlayerEnum.BOTH };
            const result1 = requirements_1.meetsRequirements(req1, state, 0, 1);
            const result2 = requirements_1.meetsRequirements(req2, state, 0, 1);
            expect(result1).toBe(true);
            expect(result2).toBe(true);
        });
        it('should reject if the reqs are not met', () => {
            const req1 = { axis: cardInterface_1.AxisEnum.FAR, player: cardInterface_1.PlayerEnum.BOTH };
            const req2 = { axis: cardInterface_1.AxisEnum.PRONE, player: cardInterface_1.PlayerEnum.OPPONENT };
            const result1 = requirements_1.meetsRequirements(req1, state, 0, 1);
            const result2 = requirements_1.meetsRequirements(req2, state, 0, 1);
            expect(result1).toBe(false);
            expect(result2).toBe(false);
        });
    });
    describe('canPlayCard', () => {
        let card;
        beforeEach(() => {
            card = util_1.makeBlankCard();
        });
        it('should pass if all requirements are met', () => {
            const req1 = { axis: cardInterface_1.AxisEnum.STANDING, player: cardInterface_1.PlayerEnum.PLAYER };
            const req2 = { axis: cardInterface_1.AxisEnum.CLOSE, player: cardInterface_1.PlayerEnum.BOTH };
            card.requirements = [req1, req2];
            const result = requirements_1.canPlayCard(card, state);
            expect(result).toEqual(true);
        });
        it('should reject if any of the requirements are not met', () => {
            const req1 = { axis: cardInterface_1.AxisEnum.MOVING, player: cardInterface_1.PlayerEnum.PLAYER };
            const req2 = { axis: cardInterface_1.AxisEnum.BALANCED, player: cardInterface_1.PlayerEnum.BOTH };
            card.requirements = [req1, req2];
            const result = requirements_1.canPlayCard(card, state);
            expect(result).toEqual(false);
        });
    });
});