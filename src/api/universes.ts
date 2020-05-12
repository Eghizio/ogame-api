// "/api/universes"
import { Universes } from "../types/api";
import express from "express";
import axios from "axios";
import XMLParserService from "../services/XMLParserService";


const router = express.Router();

router.get("/", (req, res) => {
    
    axios.get(req.app.get("ogameAPI").universes)
        .then(response => response.data)
        .then(xml => new XMLParserService().parse(xml))
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