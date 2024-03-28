import { FastifyReply, FastifyRequest } from "fastify";
import { decodeToken } from "../modules/auth/jwt";
import * as auth from "../modules/auth/auth.model";

export const isAuthenticated = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const token = req.cookies.token || req.headers["Authorization"];
  console.log(token);
  if (!token) {
    reply.status(401).send({ error: "Not authenticated" });
    return; // Stop execution to prevent calling the next handler
  }
  const decoded = await decodeToken(reply, token);
  if (decoded.user) {
    req.userId = decoded.user.id;
    const userExist = await auth.login(decoded.user.email);
    console.log(decoded.email);
    if (!userExist) {
      reply.status(404).send({ error: "User Not Found" });
      return; // Stop execution to prevent calling the next handler
    }
  } else {
    req.userId = decoded.id;
    const userExist = await auth.login(decoded.email);
    console.log(decoded.email);
    if (!userExist) {
      reply.status(404).send({ error: "User Not Found" });
      return; // Stop execution to prevent calling the next handler
    }
    // If the function reaches this point, the user is authenticated,
    // and you don't need to explicitly call done or return anything.
  }
};
