import { Card } from "../shared/card";

export interface FightingStyle {
    cards: Card[]
    name: string
    description?: string
    identity?: string
    strengths?: string
}
export interface FightingStyleDescription {
    name: string
    cards?: string[]
    description?: string
    identity?: string
    strengths?: string
    floatingPower?: string[]
    mainMechanics?: string[]
    isGeneric?: boolean
}

export interface FightingStyleState{
    style: FightingStyle | null
    styleDescriptions: FightingStyleDescription[]
    loadingStyle: boolean
    loadingStyleNames: boolean
    isEditingDeck?: boolean
}