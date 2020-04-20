import { NextFunction, Request, Response } from "express";
import {
  HTTP400Error,
  HTTP401Error,
} from "../../utils/httpErrors";
import { User } from "../User/user.schema";
import { IUser } from "../User/user.interface";
import * as jwt from "jsonwebtoken";

export class AuthController {
  private signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    if (await User.findOne({ email: userData.email })) {
      next(new HTTP400Error("User with this email already exist"));
    } else {
      try {
        const newUser = await new User(req.body).save();
        const token = this.signToken(newUser._id);
        res.status(201).json({
          status: "success",
          token,
          data: {
            user: newUser,
          },
        });
      } catch (e) {
        next(new HTTP401Error(e.message));
      }
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HTTP400Error("Provide email and password!!!"));
    }
    const user = (await User.findOne({ email }).select("+password")) as IUser;
    if (!user) {
      return next(new HTTP401Error("Not registered!!!"));
    }
    const isMatch = user.validPassword(password, user.password);
    if (!isMatch) {
      return next(new HTTP401Error("Not correct credentials!!!"));
    }
    const token = this.signToken(user._id);
    res.json({ status: "success", token });
  };
}
