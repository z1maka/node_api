import bodyParser from "body-parser";
import cors from "cors";
import { middleWare } from "../types";
import compression from "compression";

export const handleParser: middleWare = (router) => {
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
};
export const handleCors: middleWare = (router) => {
  router.use(cors({ credentials: true, origin: true }));
};

export const handleCompression: middleWare = (router) => {
  router.use(compression());
};
