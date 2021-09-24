import express from "express";
import cors from "cors";
import { api } from "./routes/api";

export const createServer = () => {
    const app = express();

    app.use(cors({ origin: "*" }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // app.set("SERVER_ID", process.env.SERVER_ID || 176); // need to parametrize that as query or param
    app.set("json spaces", 2);
    
    app.use("/api", api);

    return app;
};
