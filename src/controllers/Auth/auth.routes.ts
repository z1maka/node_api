import { Router } from "express";
import { AuthController } from "./auth.controller";
import { protectJWT } from "../../middleware/protect";

class AuthRoutes {
  public router: Router = Router();
  private controller = new AuthController();
  constructor() {
    this.router.post("/login", this.controller.login);
    this.router.post("/signup", this.controller.signUp);
    this.router.post("/forgot", this.controller.forgotPassword);
    this.router.post("/update", protectJWT, this.controller.updatePassword);
    this.router.post("/reset/:token", this.controller.resetPassword);
  }
}

export default new AuthRoutes().router;
