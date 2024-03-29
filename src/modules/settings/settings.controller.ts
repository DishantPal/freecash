import * as settings from "./settings.model";
import { FastifyReply, FastifyRequest } from "fastify";
import app from "../../app";
import { getSetCachedData } from "../../utils/getCached";
import { db } from "../../database/database";
export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const { group } = req.query as { group: string };
  console.log(group);
  const result = await settings.fetch(group);
  getSetCachedData(
    "web_settings",
    async () => {
      return await settings.fetch("web");
    },
    3600
  );
  getSetCachedData(
    "seo_settings",
    async () => {
      return await settings.fetch("seo");
    },
    3600
  );
  getSetCachedData(
    "email_settings",
    async () => {
      return await settings.fetch("email");
    },
    3600
  );
  getSetCachedData(
    "default_currency",
    async () => {
      return await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_currency")
        .execute();
    },
    3600
  );
  console.log("result: ", result);
  if (result) {
    return reply.sendSuccess(
      result.map((i: any) => ({
        id: i.id,
        name: i.name,
        value: i.val,
        group: i.group,
      })),
      200,
      "null"
    );
  } else {
    return reply.callNotFound;
  }
};
