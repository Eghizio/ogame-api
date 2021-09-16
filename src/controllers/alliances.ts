// "/api/alliances"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS } from "../constants/endpoints";
import { Alliances } from "../types/api";


const getAlliances: RequestHandler = async (req, res) => {

    try{
        const URL = OGAME_API_ENDPOINTS.alliances(req.serverID);

        const response = await fetch(URL);
        const xml = await response.text();
        const json = await new XMLParserService().parseToJson(xml);

        const orderedJSON: Alliances = {
            serverID: json.alliances.$.serverId,
            timestamp: json.alliances.$.timestamp,
            alliances: [
                ...json.alliances.alliance.map((a: any) => 
                    ({ 
                        id: a.$.id, 
                        name: a.$.name,
                        tag: a.$.tag,
                        founder: a.$.founder,
                        foundDate: a.$.foundDate,
                        ...(a.$.logo && {logo: a.$.logo}),
                        ...(a.$.open && { open: true }),
                        ...(a.player && {players: a.player.map((p: any) => p.$)})
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


export const AlliancesController = {
    getAlliances,
};