import { Request } from "express";
import { Document } from "mongoose";

export const isDateGuard = (value: Date | number): value is Date => {
  return value instanceof Date;
};

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  passwordConfirm: string | undefined;
  photo?: string;
  passwordChangedAt?: Date | number;
  passwordResetToken?: string;
  passwordResetExpires?: number;
  validPassword(a: string, b: string): boolean;
  changePasswordAfter(a: string): boolean;
  createResetToken(): string;
}

export interface IReqUser extends Request {
  user: IUser;
}
