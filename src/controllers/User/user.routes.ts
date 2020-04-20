import { Router } from "express";
import { UserController } from "./user.controller";
import { protectJWT, protectRole } from "../../middleware/protect";

class UserRoutes {
  public router: Router = Router();
  private controller: UserController = new UserController();
  constructor() {
    this.router.get("/:id", this.controller.getUserBiId);
    this.router.get(
      "/",
      protectJWT,
      protectRole("admin"),
      this.controller.getAllUsers
    );
  }
}

export default new UserRoutes().router;
