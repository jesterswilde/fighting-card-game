export interface StoryInfo{
    battleID: string,
    playerVitals: Vitals,
}

export interface Vitals{
    health: number,
    deckList?: string[],
}

export interface StoryBattle{
    enmey: Vitals
}