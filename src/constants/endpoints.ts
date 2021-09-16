export const OGAME_API_ENDPOINTS = {
    alliances:      (serverID: string) => `https://s${serverID}-pl.ogame.gameforge.com/api/alliances.xml`,    //Updateinterval 1 day
    highscore:      (serverID: string) => `https://s${serverID}-pl.ogame.gameforge.com/api/highscore.xml`,    //Updateinterval 1 hour
    localization:   (serverID: string) => `https://s${serverID}-pl.ogame.gameforge.com/api/localization.xml`, //Updateinterval 1 day
    playerData:     (serverID: string) => `https://s${serverID}-pl.ogame.gameforge.com/api/playerData.xml`,   //Updateinterval 1 week
    players:        (serverID: string) => `https://s${serverID}-pl.ogame.gameforge.com/api/players.xml`,      //Updateinterval 1 day
    serverData:     (serverID: string) => `https://s${serverID}-pl.ogame.gameforge.com/api/serverData.xml`,   //Updateinterval 1 day
    universe:       (serverID: string) => `https://s${serverID}-pl.ogame.gameforge.com/api/universe.xml`,     //Updateinterval 1 week
    universes:      (serverID: string) => `https://s${serverID}-pl.ogame.gameforge.com/api/universes.xml`
} as const;

export const DEFAULT_SERVER_ID = "179";