import { hash, compare } from "bcrypt";
import { UsersModel } from "../models/UsersModel.js";
import { RefreshTokenModel } from "../models/RefreshTokenModel.js";
import { LoginError } from "../utils/error.js";
import { generateToken } from "../utils/token.js";
import { REFRESH_TOKEN_EXPIRED_MS } from "../config/app_config.js";

export async function register(request, response, next) {
  try {
    const { confirmationPassword, ...user } = request.body;
    const newUser = await UsersModel.create({
      ...user,
      password: await hash(user.password, 12),
    });
    return response.json({
      success: true,
      data: {
        message: "register user done",
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  // todo handler user not active
  try {
    const userByEmail = await UsersModel.findOne({
      where: {
        email: request.body.email,
        active: true,
      },
    });

    if (!userByEmail) {
      throw new LoginError("invalid email/password");
    }

    const passwordIsValid = await compare(
      request.body.password,
      userByEmail.password
    );

    console.log("passwordValid", passwordIsValid);

    if (!passwordIsValid) {
      throw new LoginError("invalid email/password");
    }

    const userWithoutPassword = {
      id: userByEmail.id,
      username: userByEmail.username,
      email: userByEmail.email,
      role: userByEmail.role,
    };

    const refresh_token = generateToken(userWithoutPassword, true);

    const useragent = JSON.stringify(request.useragent);

    await RefreshTokenModel.create({
      token: refresh_token,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRED_MS),
      userId: userByEmail.id,
      sessionLabel: useragent,
    });

    response.cookie("refresh_token", refresh_token, {
      maxAge: REFRESH_TOKEN_EXPIRED_MS,
      httpOnly: true,
    });

    response.json({
      success: true,
      data: {
        message: "Login done",
        user: userWithoutPassword,
        accessToken: generateToken(userWithoutPassword),
      },
    });
  } catch (error) {
    next(error);
  }
}
