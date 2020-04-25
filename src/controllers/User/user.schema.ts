import mongoose, { Schema } from "mongoose";
import validator from "validator";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { IUser, isDateGuard } from "./user.interface";

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: "Enter a first name",
  },
  email: {
    type: String,
    required: "Enter an email",
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Provide valid email!"],
  },
  photo: {
    type: String,
    default: "https://nananana_defaultFoto.png",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: "Enter a password",
    minlength: [7, "A password must have more or equal then 7 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: "Confirm your password",
    validate: {
      // Работает только при методе create и  Save!!!
      validator(this: IUser, el: string): boolean {
        return el === this.password;
      },
      message: "Password are not the same!!!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.pre("save", async function (this: IUser, next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now();
  next();
});

UserSchema.methods.validPassword = async (
  comparedPassword: string,
  userPassword: string
) => {
  return await bcrypt.compare(comparedPassword, userPassword);
};

UserSchema.methods.changePasswordAfter = function (
  this: IUser,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt && isDateGuard(this.passwordChangedAt)) {
    const changedTimeStamp: number = parseInt(
      String(this.passwordChangedAt.getTime() / 1000),
      10
    );
    return JWTTimestamp > changedTimeStamp;
  }
  return false;
};

UserSchema.methods.createResetToken = function (this: IUser): string {
  const resetToken: string = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model("User", UserSchema);
