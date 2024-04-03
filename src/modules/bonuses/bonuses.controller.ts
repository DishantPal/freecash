import { decodeToken } from "../auth/jwt";
import * as bonuses from "./bonuses.model";
import { FastifyReply, FastifyRequest } from "fastify";


export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const {  status, date } = req.query as {
    status: "confirmed" | "declined" | "pending"|null;
    date: string|null;
  };
  const result = await bonuses.fetch(req.userId,status,date);
  if (result) {
    return reply.sendSuccess(
      {
        bonuses: result.map((i: any) => ({
          id: i.id,
          user_id: i.user_id,
          bonus_code: i.bonus_code,
          amount: i.amount,
          awarded_on: i.awarded_on,
          expires_on: i.expires_on,
          referred_bonus_id: i.referred_bonus_id,
          status: i.status,
        })),
      },
      200,
      "null"
    );
  } else {
    return reply.callNotFound;
  }
};
export const bonusStats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await bonuses.stats(req.userId);
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else{
    return reply.sendError("Fetched Failed", 500);
  }
}

export const fetchTrends = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await bonuses.fetchTrends(req.userId);
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else{
    return reply.sendError("Fetched Failed", 500);
  }
}

export const fetchDateClicked = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await bonuses.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull");
  } else{
    return reply.sendError("Fetched Failed", 500);
  }
}