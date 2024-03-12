import * as user from "./user.model";
import { FastifyReply, FastifyRequest } from "fastify";

export const findUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.query as { id: number };
  const userData = await user.findUser(id);
  if (!userData) {
    return reply.status(404).send({ error: "User Not Found" });
  } else {
    return reply.status(200).send({
      success: true,
      data: userData,
    });
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
    return reply.status(200).send({
      success: true,
      message: "Updated successfully!",
    });
  } else {
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
