import { Request } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  passwordConfirm: string | undefined;
  photo?: string;
  passwordChangedAt?: Date;
  validPassword(a: string, b: string): boolean;
  changePasswordAfter(a: string): boolean;
}

export interface IReqUser extends Request {
  user?: IUser;
}
