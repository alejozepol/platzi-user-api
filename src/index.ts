// import apicache from "apicache";
import consola from "consola";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import RateLimit from "express-rate-limit";
import routes from "./routes";

dotenv.config();

const app = express();
app.enable("trust proxy");
app.use(express.static(__dirname + "../public"));
app.use(cors());
const rateLimitOptions: RateLimit.Options = {
    handler: (req: any, res: any) => {
        const status = {
            code: 429,
            error: true,
        };
        const userData = {};
        res.send(JSON.stringify({ status, userData }, null, 4));
    },
    max: 300,
    windowMs: 1 * 60 * 1000,
};
const apiLimiter = new RateLimit(rateLimitOptions);
// const cache = apicache.middleware;
const onlyStatus200 = (req: any, res: any) => res.statusCode === 200;
// const cacheSuccesses = cache("10 minutes", onlyStatus200);
app.use("/api/", apiLimiter);
// app.use(cacheSuccesses);
routes(app),
    app.listen(process.env.PORT || 80, () => {
        consola.info("Initializing server...");
    });
