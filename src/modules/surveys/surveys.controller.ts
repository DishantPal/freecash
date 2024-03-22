// import * as surveys from "./surveys.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { decodeToken } from "../auth/jwt";
import {
  getBitlabsData,
  getBitlabsNetworkData,
} from "./surveys_strategies/getBitlabsData";
import { getCachedData } from "./surveys.cache";
import collect from "collect.js";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const { provider, country, sort, page } = req.query as {
    provider: string;
    country: string;
    sort: string;
    page: any;
  };
  const token = req.cookies.accessToken || req.headers["Authorization"];
  const decoded = await decodeToken(reply, token);
  const cacheKey: string = `surveys_${provider}_${decoded.id}`;
  const data = await getCachedData(
    cacheKey,
    () => getBitlabsData(req, decoded.id, null),
    "60"
  );

  // Assuming data is an array of surveys
  let surveyCollection = collect(data);

  switch (sort) {
    case "length":
      surveyCollection = surveyCollection.sortBy("length_loi");
      break;
    case "highest":
      surveyCollection = surveyCollection.sortByDesc("payout");
      break;
    case "lowest":
      surveyCollection = surveyCollection.sortBy("payout");
    default:
      surveyCollection = surveyCollection;
    // No default case needed, if sort is undefined or doesn't match, don't sort
  }
  const perPage = 20;
  const offset = (page - 1) * perPage;
  surveyCollection = surveyCollection.slice(offset, offset + perPage);
  return reply.sendSuccess(surveyCollection.all(), 200, "null");

  // return reply.status(200).send({
  //   success: true,
  //   data: surveyCollection.all(), // Convert back to array
  //   error: null,
  //   msg: null,
  //   pagination: {
  //     page,
  //     perPage,
  //     total: surveyCollection.count(),
  //   },
  // });
};
