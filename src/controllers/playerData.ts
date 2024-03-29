// "/api/playerData"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS } from "../constants/endpoints";
import { PlayerData } from "../types/api";


// TODO highscore and alliance (test for id=[1, 100013, 101421])
const getPlayerData: RequestHandler = async (req, res) => {

    try{
        const { query: q } = req;
        const id = q.id ? q.id : "1";
        // Instead of serving id=1, serve tree example with ?id=1
    
        const URL = OGAME_API_ENDPOINTS.playerData(req.serverID) + "?id=" + id;

        const response = await fetch(URL);
        const xml = await response.text();
        const json = await new XMLParserService().parseToJson(xml);

        const orderedJSON: PlayerData = {
            serverID: json.playerData.$.serverId,
            timestamp: json.playerData.$.timestamp,
            player: {
                id: json.playerData.$.id,
                name: json.playerData.$.name,
                ...(json.playerData.positions[0] && {
                    highscore: [
                        ...json.playerData.positions[0].position.map((h: any) =>
                            ({ type: h.$.type, rank: h._, points: h.$.score, ships: h.$.ships })
                        )
                    ]
                }),
                planets: [
                    ...json.playerData.planets[0].planet.map((p: any) =>
                        ({  
                            name: p.$.name, coords: p.$.coords, id: p.$.id,
                            ...(p.moon && {
                                 moon: { name: p.moon[0].$.name, size: p.moon[0].$.size, id: p.moon[0].$.id }
                            })
                        })
                    )
                ],
                ...(json.playerData.alliance && {
                    alliance: {
                        name: json.playerData.alliance[0].name[0],
                        tag: json.playerData.alliance[0].tag[0],
                        id: json.playerData.alliance[0].$.id
                    }
                })
            }
        };

        return res.status(200).json(orderedJSON);
    }
    catch(error){
        return res.status(500).send(error);
    }
};


export const PlayerDataController = {
    getPlayerData,
};