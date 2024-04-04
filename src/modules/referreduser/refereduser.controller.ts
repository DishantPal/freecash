import * as referred from "./refereduser.model";
import { FastifyReply, FastifyRequest } from "fastify";

export const stats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await referred.stats(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
export const trends = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await referred.trends(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
export const list = async (req: FastifyRequest, reply: FastifyReply) => {
  const { date, pageNumber, limit } = req.query as {
    date: string | null;
    pageNumber: number;
    limit: number;
  };
  const result = await referred.list(
    Number(req.userId),
    date,
    pageNumber,
    limit
  );
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
export const dateFormat = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await referred.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
