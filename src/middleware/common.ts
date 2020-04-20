import bodyParser from "body-parser";
import cors from "cors";
import { middleWare } from "../types";
import compression from "compression";
import expressLimit from "express-rate-limit";

export const handleParser: middleWare = (router) => {
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
};
export const handleCors: middleWare = (router) => {
  router.use(cors({ credentials: true, origin: true }));
};

export const rateLimit: middleWare = (router) => {
  const limiter = expressLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, try again later",
  });
  router.use("/api", limiter);
};

export const handleCompression: middleWare = (router) => {
  router.use(compression());
};
