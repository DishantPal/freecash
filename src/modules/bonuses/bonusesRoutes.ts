import { FastifyInstance } from "fastify";
import * as bonusesController from "./bonuses.controller";
// Removed unnecessary import comment
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { apiResponseSchema, fetchQueryResponse } from "./bonuses.schema";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch",
    schema: {
      querystring: fetchQueryResponse,
      response: {
        200: apiResponseSchema,
      },
      tags: ["Bonuses"],
    },
    handler: bonusesController.fetch,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-date-clicked",
    schema: {
      tags: ["Bonuses"],
      // response: {200:apiResponseSchema}
    },
    handler: bonusesController.fetchDateClicked,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-trends",
    schema: {
      tags: ["Bonuses"],
      // response: {200:apiResponseSchema}
    },
    handler: bonusesController.fetchTrends,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-stats",
    schema: {
      tags: ["Bonuses"],
      // response: {200:apiResponseSchema}
    },
    handler: bonusesController.bonusStats,
  });
}
