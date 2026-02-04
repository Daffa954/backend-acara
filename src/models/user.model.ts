import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";

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
}

const userSchema = new Schema<User>(
  {
    fullName: { type: Schema.Types.String, required: true },
    username: { type: Schema.Types.String, required: true, unique: true },
    email: { type: Schema.Types.String, required: true, unique: true },
    password: { type: Schema.Types.String, required: true },
    role: {
      type: Schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
    },
    profilePicture: { type: Schema.Types.String, default: "user.jpg" },
    isActive: { type: Boolean, default: false },
    activationCode: { type: Schema.Types.String },
  },
  { timestamps: true },
);


//middleware for encryption password
userSchema.pre("save", function (next) {
    const user = this as User;
    
    user.password = encrypt(user.password);
    next();
})

userSchema.methods.toJSON = function () {
 const user = this.toObject();
 delete user.password;
 return user;
};


const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;