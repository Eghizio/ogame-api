// "/api/universe"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Universe } from "../types/api";


// split into galaxies? filtering by galaxies, systems, positions?
const getUniverse: RequestHandler = async (req, res) => {

    try{
        const URL = OGAME_API_ENDPOINTS.universe(TEMP_SERVER_ID);

        const response = await fetch(URL);
        const xml = await response.text();
        const json = await new XMLParserService().parseToJson(xml);

        const orderedJSON: Universe = {
            serverID: json.universe.$.serverId,
            timestamp: json.universe.$.timestamp,
            planets: [
                ...json.universe.planet.map((p: any) =>
                    ({  
                        name: p.$.name, player: p.$.player, coords: p.$.coords, id: p.$.id,
                        ...(p.moon && {moon: { name: p.moon[0].$.name, size: p.moon[0].$.size, id: p.moon[0].$.id }})
                    })
                )
            ]
        };

        return res.status(200).json(orderedJSON);
    }
    catch(error){
        return res.status(500).send(error);
    }
};


export const UniverseController = {
    getUniverse,
};