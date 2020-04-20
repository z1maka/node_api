import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../../utils/httpErrors";
import { User } from "./user.schema";

export class UserController {
  public getUserBiId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (e) {
      next(new HTTP400Error(e));
    }
  };

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (e) {
      next(new HTTP400Error(e));
    }
  };
}
