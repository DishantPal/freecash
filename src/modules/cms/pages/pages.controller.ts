import { FastifyReply, FastifyRequest } from "fastify";
import * as pages from "./pages.model";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await pages.fetch();
  return reply.sendSuccess(result, 200, "pages fetched successfully");
};
