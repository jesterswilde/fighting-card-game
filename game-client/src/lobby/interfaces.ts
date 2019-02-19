export interface DeckChoice{
    name: string
    description: string
}

export interface LobbyState {
    deckName?: string,
    deckChoices?: DeckChoice[]
}