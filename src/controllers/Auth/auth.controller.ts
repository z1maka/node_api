import { NextFunction, Request, Response } from "express";
import {
  HTTP400Error,
  HTTP401Error,
  HTTP404Error,
} from "../../utils/httpErrors";
import crypto from "crypto";
import { User } from "../User/user.schema";
import { IReqUser, IUser } from "../User/user.interface";
import { ICookie } from "../../types";
import * as jwt from "jsonwebtoken";
import sendEmail from "../../utils/email";

export class AuthController {
  private signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  };

  private setCookie = (token: string, res: Response) => {
    const expires: number = +(process.env.JWT_COOKIE_EXPIRES as string) || 2;
    const cookieOptions: ICookie = {
      expires: new Date(Date.now() + expires * 60 * 60 * 1000),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
  };

  public updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = (await User.findById((req as IReqUser).user.id).select(
      "+password"
    )) as IUser;
    if (!(await user.validPassword(req.body.oldPassword, user.password))) {
      return next(new HTTP401Error("Your current password is wrong"));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    const token = this.signToken(user._id);
    this.setCookie(token, res);
    res.json({ status: "success", token });
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = (await User.findOne({ email: req.body.email })) as IUser;
    if (!user) {
      next(new HTTP404Error("There is no user with email address."));
    }
    const token = user.createResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl: string = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset/${token}`;
    const message = `Follow this link for creating new password: ${resetUrl}.
    If you didn't forgot your password ,ignore this message!`;
    await sendEmail({
      email: user.email,
      subject: "Your password reset token.(valid 10 min)",
      message,
    }).catch(async (err) => {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res.send(err);
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = (await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })) as IUser;

    if (!user) {
      return next(new HTTP400Error("Token is invalid or has expired."));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const token = this.signToken(user._id);
    this.setCookie(token, res);
    res.json({ status: "success", token });
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    if (await User.findOne({ email: userData.email })) {
      next(new HTTP400Error("User with this email already exist"));
    } else {
      try {
        const newUser = (await new User(req.body).save()) as IUser;
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
    this.setCookie(token, res);
    res.json({ status: "success", token });
  };
}
