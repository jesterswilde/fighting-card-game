import { Card } from "../shared/card";

export interface FightingStyle {
    cards: Card[]
    name: string
    description?: string
    identity?: string
    strengths?: string
}

export interface FightingStyleDescription{
    name: string
    description?: string
}

export interface FightingStyleState{
    style: FightingStyle | null
    styleDescriptions: FightingStyleDescription[]
    loadingStyle: boolean
    loadingStyleNames: boolean
}