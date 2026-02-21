import { Types } from "mongoose";
import { Request } from "express";
import { User } from "../models/user.model";

export interface IReqUser extends Request {
  user?: IUserToken;
}

export interface IUserToken extends Omit<
  User,
  | "password"
  | "activationCode"
  | "isActive"
  | "email"
  | "fullName"
  | "profilePicture"
  | "username"
> {
  id?: Types.ObjectId;
  iat?: number;
  exp?: number;
}


export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}