import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";

function createToken(id: string) {
  return jwt.sign({ id: id }, config.JWT_SECRET_KEY!);
}

// Get user-sent token payload.
function jwtPayload(reqToken: string) {
  return jwt.verify(
    reqToken?.split(" ")[1] as string,
    config.JWT_SECRET_KEY as string
  ) as JwtPayload;
}

export { createToken, jwtPayload };
