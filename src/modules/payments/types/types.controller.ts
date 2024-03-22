import { FastifyReply, FastifyRequest } from "fastify";
import * as payment from "./types.model";
// import { FetchTaskQuery } from "./task.schemas";
export const fetchTypes = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await payment.fetchTypes();
  if (result) {
    reply.sendSuccess(result, 200, "null");
  } else {
    reply.sendError("Internal Server Error", 500);
  }
};
