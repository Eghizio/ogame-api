// "/api/alliances"
import { Alliances } from "../types/api";
import express from "express";
import axios from "axios";
import XMLParserService from "../services/XMLParserService";


const router = express.Router();

router.get("/", (req, res) => {

    
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
        .then(formatedJSON => res.json(formatedJSON))
        .catch(err => res.send(err));
});


module.exports = router;