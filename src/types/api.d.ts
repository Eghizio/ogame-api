// Incomplete, need to get the full types from my other device :D

//GENERAL
export interface Metadata{
    serverID: string
    timestamp: string
}

//Alliances
type Alliance = { id: string, name: string, tag: string, founder: string, foundDate: string, logo: string, open?: boolean, players?: {id: string}[] };
export interface Alliances extends Metadata{
    alliances: Alliance[]
}

//Highscore
export interface Highscore extends Metadata{

}

//Localization
type LocalizationItem = { name: string, id: string };
export interface Localization extends Metadata{
    buildings: LocalizationItem[]
    research: LocalizationItem[]
    ships: LocalizationItem[]
    defense: LocalizationItem[]
    officers: LocalizationItem[]
    missions: LocalizationItem[]
}

//PlayerData
type HighscoreItem = { type: string, rank: string, points: string, ships?: string };
type Planet = { name: string, coords: string, id: string, moon?: Moon };
type Moon = { name: string, size: string, id: string };
type AllianceMetadata = { name: string, tag: string, id: string };
export interface PlayerData extends Metadata{
    player: {
        id: string
        name: string
        highscore: HighscoreItem[]
        planets: Planet[]
        alliance: AllianceMetadata
    }
}

//Players
type Player = { id: string, name: string, status?: string, alliance?: string};
export interface Players extends Metadata{
    players: Player[]
}

//Universe
export interface Universe extends Metadata{
    planets: (Planet & { player: string})[]
}

//Universes
type Universum = { id: string, href: string };
export interface Universes extends Metadata{
    universes: Universum[]
}

//ServerData
export interface ServerData extends Metadata{
    name: string
    number: string
    language: string
    timezone: string
    timezoneOffset: string
    domain: string
    version: string
    speed: string
    speedFleet: string
    galaxies: string
    systems: string
    acs: string
    rapidFire: string
    defToTF: string
    debrisFactor: string
    debrisFactorDef: string
    repairFactor: string
    newbieProtectionLimit: string
    newbieProtectionHigh: string
    topScore: string
    bonusFields: string
    donutGalaxy: string
    donutSystem: string
    wfEnabled: string
    wfMinimumRessLost: string
    wfMinimumLossPercentage: string
    wfBasicPercentageRepairable: string
    globalDeuteriumSaveFactor: string
    bashlimit: string
    probeCargo: string
    researchDurationDivisor: string
    darkMatterNewAcount: string
    cargoHyperspaceTechMultiplier: string
}


export type OGameAPI = Alliances | Highscore | Localization | PlayerData | Players | ServerData | Universe | Universes;