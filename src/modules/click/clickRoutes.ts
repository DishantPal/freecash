import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as taskController from "./clicks.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { apiResponseSchema, clickInsertResponse, clickTaskQuerySchema, fetchClickTaskQuerySchema } from "./clicks.schema";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/insert",
    schema: {
      tags: ["Clicks"],
      querystring: clickTaskQuerySchema,
      response: {
        200: clickInsertResponse,
      },
    },
    handler: taskController.insert,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch",
    schema: {
      tags: ["Clicks"],
      querystring: fetchClickTaskQuerySchema,
      // response: {200:apiResponseSchema}
    },
    handler: taskController.fetch,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-date-clicked",
    schema: {
      tags: ["Clicks"],
      // response: {200:apiResponseSchema}
    },
    handler: taskController.fetchDateClicked,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-trends",
    schema: {
      tags: ["Clicks"],
      // response: {200:apiResponseSchema}
    },
    handler: taskController.fetchTrends,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-click-stats",
    schema: {
      tags: ["Clicks"],
      // response: {200:apiResponseSchema}
    },
    handler: taskController.clickStats,
  });
}
