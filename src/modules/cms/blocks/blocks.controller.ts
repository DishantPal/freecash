import { FastifyReply, FastifyRequest } from "fastify";
import * as blocks from "./blocks.model";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await blocks.fetch();
  return reply.sendSuccess(result, 200, "blocks fetched successfully");
};
