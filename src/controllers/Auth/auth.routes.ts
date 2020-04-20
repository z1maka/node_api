import { Router } from "express";
import { AuthController } from "./auth.controller";

class AuthRoutes {
  public router: Router = Router();
  private controller = new AuthController();
  constructor() {
    this.router.post("/login", this.controller.login);
    this.router.post("/signup", this.controller.signUp);
  }
}

export default new AuthRoutes().router;
