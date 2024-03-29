import { FastifyReply, FastifyRequest } from "fastify";
import * as menus from "./menus.model";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await menus.fetch();
  return reply.sendSuccess(result, 200, "menus fetched successfully");
};
