import { Card } from "../shared/card";

export interface FightingStyle {
    name: string
    cards: string[]
    description?: string
    identity?: string
    strengths?: string
    mainMechanics?: string
    isGeneric?: boolean
}

export interface FullFightingStyle{
    name: string
    cards: Card[]
    description?: string
    identity?: string
    strengths?: string
    mainMechanics?: string
}