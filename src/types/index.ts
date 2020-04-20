import { Application } from "express";

export type middleWare = (r: Application) => void;

export interface ICookie {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}
