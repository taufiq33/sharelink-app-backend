import { hash } from "bcrypt";
import { UsersModel } from "../models/UsersModel.js";

export async function register(request, response, next) {
  try {
    const { confirmationPassword, ...user } = request.body;
    const newUser = await UsersModel.create({
      ...user,
      password: await hash(user.password, 12),
    });
    return response.json({
      message: "register user done",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    next(error);
  }
}
