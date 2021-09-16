// "/api/players"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Players } from "../types/api";


const getPlayers: RequestHandler = async (req, res) => {

    try{
        // console.log(`Calling "${req.originalUrl}"...`); // need to npm morgan for logs

        const URL = OGAME_API_ENDPOINTS.players(TEMP_SERVER_ID);

        const response = await fetch(URL);
        const xml = await response.text();
        const json = await new XMLParserService().parseToJson(xml);

        const orderedJSON: Players = {
            serverID: json.players.$.serverId,
            timestamp: json.players.$.timestamp,
            players: [...json.players.player.map((p: any) => p.$)]
        };

        return res.status(200).json(orderedJSON);
    }
    catch(error){
        return res.status(500).send(error);
    }
};


export const PlayersController = {
    getPlayers,
};