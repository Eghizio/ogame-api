// "/api/alliances"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";
import { Alliances } from "../types/api";


const getAlliances: RequestHandler = (req, res) => {

    fetch(OGAME_API_ENDPOINTS.alliances(TEMP_SERVER_ID))
        .then(response => response.text())
        .then(xml => new XMLParserService().parseToJson(xml))
        .then(json => {
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

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
};


export const AlliancesController = {
    getAlliances,
};