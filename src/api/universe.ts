// "/api/universe"
import { Universe } from "../types/api";
import express from "express";
import axios from "axios";
import XMLParserService from "../services/XMLParserService";
import CacheService from "../services/CacheService";


const router = express.Router();
const cache = new CacheService();

router.get("/", (req, res) => {
    
    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));
        
    axios.get(req.app.get("ogameAPI").universe)
        .then(response => response.data)
        .then(xml => new XMLParserService().parse(xml))
        .then(json => {
            const orderedJSON: Universe = {
                serverID: json.universe.$.serverId,
                timestamp: json.universe.$.timestamp,
                planets: [
                    ...json.universe.planet.map((p: any) =>
                        ({  
                            name: p.$.name, player: p.$.player, coords: p.$.coords, id: p.$.id,
                            ...(p.moon && {moon: { name: p.moon[0].$.name, size: p.moon[0].$.size, id: p.moon[0].$.id }})
                        })
                    )
                ]
            };

            return orderedJSON;
        })
        .then(data => cache.set(req.originalUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;