import { Application } from "express";
import userRoute from "./controllers/User/user.routes";
import authRoutes from "./controllers/Auth/auth.routes";

export default class Routes {
  public init(app: Application): void {
    app.use("/api/v1/users", userRoute);
    app.use("/api/v1/auth", authRoutes);
  }
}
