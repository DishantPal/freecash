import * as settings from "./settings.model";
import { FastifyReply, FastifyRequest } from "fastify";
import app from "../../app";
export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const { group } = req.query as { group: string };
  console.log(group);
  const result = await settings.fetch(group);
  console.log("result: ", result);
  if (result) {
    return reply.status(200).send({
      success: true,
      settings: result.map((i: any) => ({
        id: i.id,
        name: i.name,
        value: i.val,
        group: i.group,
      })),
      error: "null",
      msg: "null",
    });
  } else {
    return reply.callNotFound;
  }
};
