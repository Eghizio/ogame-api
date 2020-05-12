// "/api/universes"
import { Universes } from "../types/api";
import express from "express";
import axios from "axios";
import XMLParserService from "../services/XMLParserService";
import CacheService from "../services/CacheService";


const router = express.Router();
const cache = new CacheService();

router.get("/", (req, res) => {
    
    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));
        
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
        .then(data => cache.set(req.originalUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;