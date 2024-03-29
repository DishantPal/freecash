import { FastifyReply, FastifyRequest } from "fastify";
import * as translation from "./translations.model";
import { getSetCachedData } from "../../utils/getCached";
import app from "../../app";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await translation.fetch();
  getSetCachedData("translations", async () => await translation.fetch(), 3600);
  if (result) {
    return reply.sendSuccess(
      result.map((i: any) => ({
        id: i.id,
        page: i.page,
        module: i.module,
        trans_key: i.trans_key,
        trans_value: i.trans_value,
      })),
      200,
      "null"
    );
  } else {
    return reply.callNotFound;
  }
};
