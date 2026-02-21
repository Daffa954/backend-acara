import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { renderMailHtml, sendMail } from "../utils/mails/mail";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";
import { ROLES } from "../utils/constant";

const Schema = mongoose.Schema;

export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  activationCode: string;
  createdAt?: Date;
}

const userSchema = new Schema<User>(
  {
    fullName: { type: Schema.Types.String, required: true },
    username: { type: Schema.Types.String, required: true, unique: true },
    email: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
    role: {
      type: Schema.Types.String,
      enum: [ROLES.ADMIN, ROLES.MEMBER],
      default: ROLES.MEMBER,
    },
    profilePicture: { type: Schema.Types.String, default: "user.jpg" },
    isActive: { type: Boolean, default: false },
    activationCode: { type: Schema.Types.String },
  },
  { timestamps: true },
);

//middleware for encryption password
userSchema.pre("save", function (next) {
  const user = this;

  user.password = encrypt(user.password);
  user.activationCode = encrypt(user.id);
  next();
});

//middleware for send email
userSchema.post("save", async function name(doc, next) {
  try {
    const user = doc;
    console.log("send email to: " + user.email);
    const contentMail = await renderMailHtml("registration-success.ejs", {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });
    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: "Aktivasi Akun Anda",
      html: contentMail,
    });
    next();
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
