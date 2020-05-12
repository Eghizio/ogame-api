// "/api/alliances"
import { Alliances } from "../types/api";
import express from "express";
import axios from "axios";
import XMLParserService from "../services/XMLParserService";
import CacheService from "../services/CacheService";


const router = express.Router();
const cache = new CacheService();

router.get("/", (req, res) => {

    if(cache.has(req.originalUrl))
        return res.json(cache.get(req.originalUrl));

    axios.get(req.app.get("ogameAPI").alliances)
        .then(response => response.data)
        .then(xml => new XMLParserService().parse(xml))
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
        .then(data => cache.set(req.originalUrl, data))
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;