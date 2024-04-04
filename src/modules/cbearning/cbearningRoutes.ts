import { FastifyInstance } from "fastify";
import * as earningController from "./cbearning.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch",
    schema: {
      tags: ["Earnings"],
      querystring: z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
        date: z.string().optional().describe("MM_YYYY"),
        type: z.enum(["task", "survey"]).optional(),
        network: z.string().optional().describe("network name"),
        status: z.enum(["confirmed", "pending", "declined"]).optional(),
      }),
      // response: {
      //   200: clickInsertResponse,
      // },
    },
    handler: earningController.list,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-date-clicked",
    schema: {
      tags: ["Earnings"],
      // response: {200:apiResponseSchema}
    },
    handler: earningController.dateFormat,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-trends",
    schema: {
      tags: ["Earnings"],
      // response: {200:apiResponseSchema}
    },
    handler: earningController.trends,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-stats",
    schema: {
      tags: ["Earnings"],
      // response: {200:apiResponseSchema}
    },
    handler: earningController.stats,
  });
}
