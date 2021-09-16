// "/api/universes"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Universes } from "../types/api";


const getUniverses: RequestHandler = (req, res) => {

    const URL = OGAME_API_ENDPOINTS.universes(TEMP_SERVER_ID);
        
    fetch(URL)
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
            const orderedJSON: Universes = {
                serverID: json.universes.$.serverId,
                timestamp: json.universes.$.timestamp,
                universes: [...json.universes.universe.map((u: any) => u.$)]
            };

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
};


export const UniversesController = {
    getUniverses,
};