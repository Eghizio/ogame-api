import { RequestHandler } from "express";
import { DEFAULT_SERVER_ID } from "../constants/endpoints";

declare module "express-serve-static-core" {
	interface Request{
		serverID: string;
	}
}

export const getServerID: RequestHandler = (req, res, next) => {
    req.serverID = req.query.serverID ? req.query.serverID.toString() : DEFAULT_SERVER_ID;
	next();
};