// "/api/highscore"
import { RequestHandler } from "express";
import fetch from "node-fetch";
import { XMLParserService } from "../services/XMLParserService";
import { OGAME_API_ENDPOINTS, TEMP_SERVER_ID } from "../constants/endpoints";


const getHighscoreLegend: RequestHandler = (req, res) => {
    const legend = {
        example: "/api/highscore/players?type=0",
        category: ["players", "alliances"],
        type: {
            0: "Total",
            1: "Economy",
            2: "Research",
            3: "Military",
            4: "Military Built",
            5: "Military Destroyed",
            6: "Military Lost",
            7: "Honor"
        }
    };

    res.json(legend);
};

const getHighscorePlayers: RequestHandler = async (req, res) => {

    try{
        const { query: q } = req;
        const type = (q.type && (Number(q.type) >= 0 && Number(q.type) <= 7)) ? q.type : "0";

        const URL = OGAME_API_ENDPOINTS.highscore(TEMP_SERVER_ID) + "?category=1&type=" + type;

        const response = await fetch(URL);
        const xml = await response.text();
        const json = await new XMLParserService().parseToJson(xml);

        const orderedJSON = {
            serverID: json.highscore.$.serverId,
            timestamp: json.highscore.$.timestamp,
            category: json.highscore.$.category,
            type: json.highscore.$.type,
            players: [...json.highscore.player.map((a: any) => a.$)]
        };

        return res.status(200).json(orderedJSON);
    }
    catch(error){
        return res.status(500).send(error);
    }
};

const getHighscoreAlliances: RequestHandler = async (req, res) => {
    
    try{
        const { query: q } = req;
        const type = (q.type && (Number(q.type) >= 0 && Number(q.type) <= 7)) ? q.type : "0";
    
        const URL = OGAME_API_ENDPOINTS.highscore(TEMP_SERVER_ID) + "?category=2&type=" + type;

        const response = await fetch(URL);
        const xml = await response.text();
        const json = await new XMLParserService().parseToJson(xml);

        const orderedJSON = {
            serverID: json.highscore.$.serverId,
            timestamp: json.highscore.$.timestamp,
            category: json.highscore.$.category,
            type: json.highscore.$.type,
            alliances: [...json.highscore.alliance.map((a: any) => a.$)]
        };

        return res.status(200).json(orderedJSON);
    }
    catch(error){
        return res.status(500).send(error);
    }
};


export const HighscoreController = {
    getHighscoreLegend,
    getHighscorePlayers,
    getHighscoreAlliances,
};
