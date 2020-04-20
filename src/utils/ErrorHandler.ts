import { Response, NextFunction } from "express";
import { HttpClientError, HTTP404Error } from "./httpErrors";

export const notFoundError = () => {
  throw new HTTP404Error("Method not found");
};

export const clientError = (err: Error, res: Response, next: NextFunction) => {
  if (err instanceof HttpClientError) {
    res.status(err.statusCode).send({
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
    });
  } else {
    next(err);
  }
};

export const serverError = (err: Error, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "production") {
    res.status(500).send("Internal Server Error");
  } else {
    res.status(500).send(err.stack);
  }
};
