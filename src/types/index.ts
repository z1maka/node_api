import { Application } from "express";

export type middleWare = (r: Application) => void;
