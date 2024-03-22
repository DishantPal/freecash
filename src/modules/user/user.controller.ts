import * as user from "./user.model";
import { FastifyReply, FastifyRequest } from "fastify";

export const findUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.query as { id: number };
  const userData = await user.findUser(id);
  if (!userData) {
    return reply.sendSuccess(null, 404, "User Not Found");
  } else {
    return reply.sendSuccess(userData, 200, "User Found");
  }
};

export const updateUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.query as { id: number };
  const { email, password, name } = req.body as {
    email?: string;
    password?: string;
    name?: string;
  };
  let result = await user.updateUser(id, email, password, name);
  if (result) {
    return reply.sendSuccess("", 200, "User Updated Successfully");
  } else {
    return reply.sendError("Internal Server Error", 500);
  }
};
