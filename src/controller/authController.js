import { hash, compare } from "bcrypt";
import { UsersModel } from "../models/UsersModel.js";
import { RefreshTokenModel } from "../models/RefreshTokenModel.js";
import { AuthError, FormInputError, LoginError } from "../utils/error.js";
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
  try {
    const userByEmail = await UsersModel.findOne({
      where: {
        email: request.body.email,
      },
    });

    if (!userByEmail) {
      throw new LoginError("invalid email/password");
    }

    if (!userByEmail.active) {
      throw new LoginError("account suspended.");
    }

    const passwordIsValid = await compare(
      request.body.password,
      userByEmail.password,
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

export async function logout(request, response, next) {
  try {
    const [revokeSession] = await RefreshTokenModel.update(
      { isRevoked: true },
      {
        where: {
          id: request.refreshtokenId,
        },
      },
    );

    if (revokeSession === 0) {
      throw Error("internalDB error");
    }

    response.clearCookie("refresh_token");
    response.json({
      success: true,
      data: {
        message: "logout done",
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function token(request, response, next) {
  //todo handler blocked user
  try {
    const user = await UsersModel.findByPk(request.userId, {
      attributes: ["id", "email", "username", "role", "active"],
    });

    console.log(user);

    if (!user || !user.active) {
      throw new AuthError("invalid credentials");
    }

    const newAccessToken = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    response.json({
      success: true,
      data: {
        message: "accessToken regenerated",
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(request, response, next) {
  try {
    const allowed_fields = ["shortBio", "username", "email"];
    const updates = {};

    for (const field of allowed_fields) {
      updates[field] = request.body[field];
    }

    if (request?.file) {
      updates["avatarUrl"] = request.file.filename;
    }

    console.log(updates);

    if (Object.keys(updates).length === 0) {
      throw new FormInputError("shortBio/username/email/avatar not supplied");
    }

    const [updateUser] = await UsersModel.update(updates, {
      where: {
        id: request.user.id,
      },
    });
    if (updateUser === 0) {
      throw Error("internal DB error");
    }

    response.json({
      success: true,
      data: {
        message: "User updated.",
        updated_fields: {
          ...updates,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
