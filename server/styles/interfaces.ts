import { Card } from "../shared/card";

export interface FightingStyle {
    name: string
    cards: string[]
    description?: string
    identity?: string
    strengths?: string
    mainMechanics?: string
}