import express, { Application } from "express";
import middleWares from "./middleware";
import { middleWare } from "./types";
import errorHandlers from "./middleware/errorHandler";
import mongoose from "mongoose";
import Routes from "./routes";
import dotenv from "dotenv";

dotenv.config();

class App {
  public app: Application;
  protected routes: Routes = new Routes();
  public mongoUrl: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}`;

  constructor() {
    this.app = express();
    this.mongoConnect();
    this.initMiddleWare(middleWares);
    this.routes.init(this.app);
    this.initMiddleWare(errorHandlers);
  }

  private initMiddleWare = (handlers: middleWare[]): void => {
    for (const m of handlers) {
      m(this.app);
    }
  };

  private mongoConnect = (): void => {
    mongoose.Promise = global.Promise;
    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  };
}

export default new App().app;
