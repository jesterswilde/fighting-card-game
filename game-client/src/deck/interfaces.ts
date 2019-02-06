export interface DeckChoice{
    name: string
    description: string
}

export interface DecksState {
    deckName?: string,
    deckChoices?: DeckChoice[]
}