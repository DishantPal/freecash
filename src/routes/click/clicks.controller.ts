import { FastifyReply, FastifyRequest } from "fastify";
import * as task from "./clicks.model";
import { ClickTaskQuery } from "./clicks.schema";
import { decodeToken } from "../auth/jwt";

export const insert = async (req: FastifyRequest, reply: FastifyReply) => {
  const { platform, network, task_type, campaign_id } =
    req.query as ClickTaskQuery;
  const { accessToken } = req.cookies;
  const locale = req.headers["accept-language"] || ("en" as string);
  const userAgent = req.headers["user-agent"] as string;
  const referer = req.headers.referer as string;
  const countries = req.headers.countries as string;
  const decoded = await decodeToken(reply, accessToken);
  console.log(userAgent, referer, countries);
  const result = await task.clickInsert(
    decoded.id,
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
    return reply.status(200).send({
      success: true,
      message: "Inserted SuccessFull",
      error: null,
      msg: null,
    });
  } else {
    return reply.status(500).send({
      error: "Error",
    });
  }
};
