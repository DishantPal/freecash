import { FastifyReply, FastifyRequest } from "fastify";
import * as task from "./clicks.model";
import { ClickTaskQuery } from "./clicks.schema";
import { decodeToken } from "../auth/jwt";

export const insert = async (req: FastifyRequest, reply: FastifyReply) => {
  const { platform, network, task_type, campaign_id } =
    req.query as ClickTaskQuery;
  const userId = Number(req.userId);
  const locale = req.headers["accept-language"] || ("en" as string);
  const userAgent = req.headers["user-agent"] as string;
  const referer = req.headers.referer as string;
  const countries = req.headers.countries as string;
  const result = await task.clickInsert(
    userId,
    platform,
    network,
    task_type,
    network + campaign_id,
    campaign_id,
    locale,
    countries,
    userAgent,
    referer
  );
  if (result) {
    reply.sendSuccess("", 200, "Inserted SuccessFull");
  } else {
    return reply.sendError("Inserted Failed", 500);
  }
};
export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const { pageNumber, limit, network, task_type, platform, date } =
    req.query as {
      pageNumber: number;
      limit: number;
      network: string;
      task_type: string;
      platform: string;
      date: string;
    };
  const result = await task.fetch(
    pageNumber,
    limit,
    network,
    task_type,
    platform,
    date,
    Number(req.userId)
  );
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
export const fetchDateClicked = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await task.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
export const fetchTrends = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await task.fetchTrends(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
export const clickStats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await task.clickStats(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else {
    return reply.sendError("Fetched Failed", 500);
  }
};
