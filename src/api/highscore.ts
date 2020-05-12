// "/api/highscore"
import express from "express";
import axios from "axios";
import { Parser } from "xml2js";
import { Highscore } from "../types/api";


const router = express.Router();

router.get("/", (req, res) => {
    const guide = {
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

    res.json(guide);
});


router.get("/players", (req, res) => {
    const XML_Parser = new Parser();

    const { query: q } = req;
    const type = (q.type && (Number(q.type) >= 0 && Number(q.type) <= 7)) ? q.type : "0";

    axios.get(req.app.get("ogameAPI").highscore +"?category=1&type="+ type)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
        .then(json => {
            const orderedJSON = {
                serverID: json.highscore.$.serverId,
                timestamp: json.highscore.$.timestamp,
                category: json.highscore.$.category,
                type: json.highscore.$.type,
                players: [...json.highscore.player.map((a: any) => a.$)]
            };

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});

router.get("/alliances", (req, res) => {
    const XML_Parser = new Parser();

    const { query: q } = req;
    const type = (q.type && (Number(q.type) >= 0 && Number(q.type) <= 7)) ? q.type : "0";

    axios.get(req.app.get("ogameAPI").highscore +"?category=2&type="+ type)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
        .then(json => {
            const orderedJSON = {
                serverID: json.highscore.$.serverId,
                timestamp: json.highscore.$.timestamp,
                category: json.highscore.$.category,
                type: json.highscore.$.type,
                alliances: [...json.highscore.alliance.map((a: any) => a.$)]
            };

            return orderedJSON;
        })
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;