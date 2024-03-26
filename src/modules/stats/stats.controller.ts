import * as stats from "./stats.model";
import { FastifyReply, FastifyRequest } from "fastify";

export const fetchStats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await stats.fetchStats();
  if (result) {
    reply.sendSuccess(result, 200, "null");
  } else {
    reply.sendError("Internal Server Error", 500);
  }
};
