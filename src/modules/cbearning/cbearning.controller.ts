import * as earnings from "./cbearning.model";
import { FastifyReply, FastifyRequest } from "fastify";

export const list = async (req: FastifyRequest, reply: FastifyReply) => {
  const { month_year, pageNumber, limit, status, network, task_type } =
    req.query as {
      task_type: string | null;
      network: string | null;
      status: "pending" | "confirmed" | "declined" | null;
      month_year: string | null;
      limit: number | null;
      pageNumber: number | undefined;
    };
  const result = await earnings.lists(
    Number(req.userId),
    task_type,
    network,
    status,
    month_year,
    limit,
    pageNumber
  );
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
export const stats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await earnings.stats(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
export const trends = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await earnings.trends(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
export const dateFormat = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await earnings.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
