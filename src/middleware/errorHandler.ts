import { Request, Response, NextFunction } from "express";
import * as ErrorHandler from "../utils/ErrorHandler";
import { middleWare } from "../types";

const handle404Error: middleWare = (router) => {
  router.use((req: Request, res: Response) => {
    ErrorHandler.notFoundError();
  });
};

const logError: middleWare = (router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.warn(err);
    next(err);
  });
};

const handleClientError: middleWare = (router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.clientError(err, res, next);
  });
};

const handleServerError: middleWare = (router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.serverError(err, res, next);
  });
};

export default [handle404Error, logError, handleClientError, handleServerError];
