import { Request, Response } from "express";
import * as yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = yup.object().shape({
  fullName: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup
    .string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test(
      "at-least-one-uppercase-letter",
      "contains-at-least-one-uppercase-letter",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      },
    )
    .test("at-least-one-number", "contains-at-least-one-number", (value) => {
      if (!value) return false;
      const regex = /^(?=.*\d)/;
      return regex.test(value);
    }),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), ""], "Password doesn't match"),
});

export default {
  async register(req: Request, res: Response) {
    /* #swagger.tags = ['Auth']
        #swagger.summary = 'Register a new user'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/registerRequest" }
                }
            }
        }
    */
    const { fullName, username, email, password, confirmPassword }: TRegister =
      req.body as unknown as TRegister;

    // validate request using YUP
    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });
      // #swagger.responses[200] = { description: 'User successfully registered', schema: { $ref: "#/components/schemas/registerResponse" } }
      // #swagger.responses[400] = { description: 'Validation failed or email already exists' }
      response.success(res, 200, "success registration!");
    } catch (error) {
      const err = error as unknown as Error;
     response.error(res, 400, err.message);
    }
  },

  async login(req: Request, res: Response) {
    /**
     #swagger.requestBody = {
     required: true,
     schema: {$ref:"#/components/schemas/loginRequest"}
     }
     */
    const { identifier, password }: TLogin = req.body as unknown as TLogin;
    try {
      //get user data based on identifier email or username
      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { username: identifier }],
        isActive: true,
      });

      if (!userByIdentifier) {
        return response.unauthorized(res, "user not found");
      }
      //password validation

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return response.unauthorized(res, "invalid password or username/email");
      }
      //jwt token

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

     response.success(res, token, "success login");
    } catch (error) {
      response.error(res, error, "Login Failed");
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      response.success(res, result, "success get user profile");
    } catch (error) {
      response.error(res, error, "Failed to get user profile");
    }
  },

  async activation(req: Request, res: Response) {
    try {
      const { code } = req.body as { code: string };
      const user = await UserModel.findOneAndUpdate(
        { activationCode: code },
        {
          isActive: true,
            activationCode: "",
        },
        { new: true },
      );

      response.success(res, user, "success activation");
    } catch (error) {
      response.error(res, error, "Failed to activation");
    }
  },
};
