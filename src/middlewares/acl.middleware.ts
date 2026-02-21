//acl = access control list

import { Request, Response, NextFunction } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

export default (roles: string[]) => {
  //['admin', 'member']
  return (req: IReqUser, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return response.unauthorized(res, "Forbidden");
    }
    next();
  };
};
