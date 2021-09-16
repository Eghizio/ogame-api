// "/api/localization"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS } from "../constants/endpoints";
import { Localization } from "../types/api";


const getLocalization: RequestHandler = async (req, res) => {

    try{
        const URL = OGAME_API_ENDPOINTS.localization(req.serverID);

        const response = await fetch(URL);
        const xml = await response.text();
        const json = await new XMLParserService().parseToJson(xml);

        const orderedJSON: Localization = {
            serverID: json.localization.$.serverId,
            timestamp: json.localization.$.timestamp,
            buildings: [],
            research: [],
            ships: [],
            defense: [],
            officers: [],
            missions: [
                ...json.localization.missions[0].name.map((m: any) => 
                    ({ name: m._, id: m.$.id })
                )
            ]
        };

        json.localization.techs[0].name
            .map((t: any) => ({ name: t._, id: t.$.id }))
            .forEach((t: any) => {
                //a lot of ifs, cause why the fuck not 
                if(t.id <100)
                    orderedJSON.buildings.push(t);
                if(t.id>100 && t.id <200)
                    orderedJSON.research.push(t);
                if(t.id>200 && t.id <300)
                    orderedJSON.ships.push(t);
                if(t.id>400 && t.id <600)
                    orderedJSON.defense.push(t);
                if(t.id>1000)
                    orderedJSON.officers.push(t);
            });

        return res.status(200).json(orderedJSON);
    }
    catch(error){
        return res.status(500).send(error);
    }
};


export const LocalizationController = {
    getLocalization,
};