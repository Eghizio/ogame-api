// "/api/universes"
import { Universes } from "../types/api";
import express from "express";
import axios from "axios";
import { Parser } from "xml2js";


const router = express.Router();

router.get("/", (req, res) => {
    const XML_Parser = new Parser();
    
    axios.get(req.app.get("ogameAPI").universes)
        .then(response => response.data)
        .then(xml => 
            XML_Parser.parseStringPromise(xml)
                .catch(err => console.log("Error parsing XML ", err))
                .then(parsedXML => parsedXML))
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
});


module.exports = router;