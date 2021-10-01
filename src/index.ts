import dotenv from "dotenv";
dotenv.config(); // need to add dev/prod and logger
import { createServer } from "./server";


const init = async () => {
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3008;

    const server = createServer();

    server.listen(PORT, () => 
        console.log("\x1b[35m%s\x1b[0m", `[server] Server running on port: ${PORT}\n[server] ${new Date()}`));
};

init().catch(console.error);