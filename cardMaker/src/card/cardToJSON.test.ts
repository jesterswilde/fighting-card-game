import { StoreState } from "../state/store";
import { AxisEnum, PlayerEnum, MechanicEnum } from '../shared/card';
import { cardToJSON } from './cardToJSON';
import { CardJSON } from '../interfaces/cardJSON';

describe("card utils", () => {
    describe("cardToJSON", () => {
        const handMadeJSON: CardJSON = {
            name: "card",
            optional: [{
                id: 0,
                requirements: [{
                    id: 7,
                    axis: AxisEnum.ANTICIPATING,
                    player: PlayerEnum.PLAYER
                }],
                effects: [{
                    id: 8,
                    axis: AxisEnum.DAMAGE,
                    player: PlayerEnum.OPPONENT,
                    amount: 3
                }, {
                    id: 9,
                    axis: AxisEnum.LOSE_POISE,
                    player: PlayerEnum.BOTH
                }]
            }, {
                id: 1,
                requirements: [{
                    id: 10,
                    axis: AxisEnum.UNBALANCED,
                    player: PlayerEnum.PLAYER
                }],
                effects: [{
                    id: 11,
                    mechanic: MechanicEnum.REFLEX
                }, {
                    id: 12,
                    mechanic: MechanicEnum.PICK_ONE,
                    choices: [[{
                        id: 15,
                        mechanic: MechanicEnum.CRIPPLE,
                        amount: "Chest"
                    }],
                    [{
                        id: 16,
                        mechanic: MechanicEnum.CRIPPLE,
                        amount: "Hand"
                    }]]
                }]
            }],
            requirements: [{
                id: 2,
                axis: AxisEnum.MOVING,
                player: PlayerEnum.OPPONENT
            }, {
                id: 3,
                axis: AxisEnum.PRONE,
                player: PlayerEnum.PLAYER
            }],
            effects: [{
                id: 4,
                amount: 3,
                axis: AxisEnum.DAMAGE,
                player: PlayerEnum.BOTH,
            }, {
                id: 5,
                mechanicRequirements: [{
                    id: 13,
                    axis: AxisEnum.BLOODIED,
                    player: PlayerEnum.BOTH
                }],
                mechanicEffects: [{
                    id: 14,
                    mechanic: MechanicEnum.CRIPPLE,
                    amount: "Leg"
                }]
            }],
            tags: [{ id: 6, value: "tag" }]
        }

        const state: StoreState = {
            card: {
                cardNames: [],
                editingCard: {
                    name: "card",
                    optional: [0, 1],
                    requirements: [2, 3],
                    effects: [4, 5],
                    tagObjs: [{ id: 6, value: "tag" }]
                }
            },
            optional: {
                optionalById: {
                    0: {
                        id: 0,
                        requirements: [7],
                        effects: [8, 9]
                    },
                    1: {
                        id: 1,
                        requirements: [10],
                        effects: [11, 12]
                    }
                }
            },
            statePiece: {
                piecesById: {
                    2: {
                        id: 2,
                        axis: AxisEnum.MOVING,
                        player: PlayerEnum.OPPONENT
                    },
                    3: {
                        id: 3,
                        axis: AxisEnum.PRONE,
                        player: PlayerEnum.PLAYER
                    },
                    7: {
                        id: 7,
                        axis: AxisEnum.ANTICIPATING,
                        player: PlayerEnum.PLAYER
                    },
                    10: {
                        id: 10,
                        axis: AxisEnum.UNBALANCED,
                        player: PlayerEnum.PLAYER
                    },
                    13: {
                        id: 13,
                        axis: AxisEnum.BLOODIED,
                        player: PlayerEnum.BOTH
                    },
                }
            },
            mechanic: {
                mechanicsById: {
                    4: {
                        id: 4,
                        amount: 3,
                        axis: AxisEnum.DAMAGE,
                        player: PlayerEnum.BOTH,
                    },
                    5: {
                        id: 5,
                        mechReq: [13],
                        mechEff: [14]
                    },
                    8: {
                        id: 8,
                        axis: AxisEnum.DAMAGE,
                        player: PlayerEnum.OPPONENT,
                        amount: 3
                    },
                    9: {
                        id: 9,
                        axis: AxisEnum.LOSE_POISE,
                        player: PlayerEnum.BOTH
                    },
                    11: {
                        id: 11,
                        mechEnum: MechanicEnum.REFLEX
                    },
                    12: {
                        id: 12,
                        mechEnum: MechanicEnum.PICK_ONE,
                        choices: [[15], [16]]
                    },
                    14: {
                        id: 14,
                        mechEnum: MechanicEnum.CRIPPLE,
                        amount: "Leg"
                    },
                    15: {
                        id: 15,
                        mechEnum: MechanicEnum.CRIPPLE,
                        amount: "Chest"
                    },
                    16: {
                        id: 16,
                        mechEnum: MechanicEnum.CRIPPLE,
                        amount: "Hand"
                    }
                }
            }
        } as unknown as StoreState;
        it('should build a JSON obj from normalized state', () => {
            const cardJSON = cardToJSON(state);
            if (cardJSON === null) {
                throw new  Error('card was null when it should not have been');
            }
            expect(cardJSON).toEqual(handMadeJSON);
        })
    })
});

