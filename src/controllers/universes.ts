// "/api/universes"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Universes } from "../types/api";


const getUniverses: RequestHandler = async (req, res) => {

    try{
        const URL = OGAME_API_ENDPOINTS.universes(TEMP_SERVER_ID);

        const response = await fetch(URL);
        const xml = await response.text();
        const json = await new XMLParserService().parseToJson(xml);

        const orderedJSON: Universes = {
            serverID: json.universes.$.serverId,
            timestamp: json.universes.$.timestamp,
            universes: [...json.universes.universe.map((u: any) => u.$)]
        };

        return res.status(200).json(orderedJSON);
    }
    catch(error){
        return res.status(500).send(error);
    }
};


export const UniversesController = {
    getUniverses,
};