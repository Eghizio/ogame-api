import { RequestHandler } from "express";
import { CacheService } from "../services/CacheService";

export const cache = (ttl: number = 0): RequestHandler => {
    const cache = new CacheService();

    return (req, res, next) => {
        const key = req.originalUrl || req.url;
        const cachedData = cache.get(key);

        res.type("application/json"); // fixes type coz hack

        if(cachedData) return res.send(cachedData);

        const sendResponse = res.send.bind(res); // ts hack to not add sendResponse (res.sendResponse)
        res.send = (data) => {
            cache.set(key, data, ttl);
            return sendResponse(data);
        };

        next();
    };
};
// need to disable caching when error, or should i?