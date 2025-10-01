import { AuthError } from "../utils/error";
import { verifyToken } from "../utils/token";

export async function authMiddleware(request, response, next) {
  try {
    const authorization = request.headers?.authorization;
    if (!authorization) {
      throw new AuthError("authorization not found");
    }

    const accessToken = authorization.split(" ")[1];
    if (!accessToken) {
      throw new AuthError("accesstoken not found");
    }

    const userPayload = await verifyToken(accessToken);

    request.user = userPayload;
    next();
  } catch (error) {
    next(error);
  }
}
