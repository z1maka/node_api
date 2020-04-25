import { IReqUser, IUser } from "../controllers/User/user.interface";
import { NextFunction, Response, Request } from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../controllers/User/user.schema";
import { HTTP401Error, HTTP403Error } from "../utils/httpErrors";

export const protectJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      // tslint:disable-next-line:no-any
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      const currentUser = (await User.findOne({ _id: decoded.id })) as IUser;
      if (!currentUser) {
        next(new HTTP401Error("User does not exist.Token is not valid!!"));
      }
      if (currentUser.changePasswordAfter(decoded.iat)) {
        next(
          new HTTP401Error(
            "User password was recently changed!Please log again."
          )
        );
      }
      (req as IReqUser).user = currentUser;
      next();
    } catch (e) {
      next(new HTTP401Error(e.message));
    }
  } else {
    return next(
      new HTTP401Error("You are not login!Please login to get access.")
    );
  }
};

export const protectRole = (...roles: string[]) => {
  return (req: IReqUser, res: Response, next: NextFunction) => {
    if (req.user && !roles.includes(req.user.role)) {
      return next(new HTTP403Error());
    }
    return next();
  };
};
