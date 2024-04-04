import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as paymentController from "./payments.controller";
import rateLimit from "@fastify/rate-limit";
import { isAuthenticated } from "../../middleware/authMiddleware";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    config: {
      rateLimit: {
        max: 1,
        timeWindow: "1 minute",
      },
    },
    preHandler: isAuthenticated,
    method: "POST",
    url: "/payout",
    schema: {
      tags: ["payments"],
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: paymentController.insert,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/stats",
    schema: {
      tags: ["payments"],
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: paymentController.stats,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/payout-history",
    schema: {
      tags: ["payments"],
      querystring: z.object({
        type: z.string().optional(),
        date: z.string().optional().describe("MM_YYYY"),
        page: z.number().optional(),
        limit: z.number().optional(),
        status: z
          .enum(["created", "processing", "completed", "declined"])
          .optional(),
      }),
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: paymentController.fetch,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch-date-clicked",
    schema: {
      tags: ["payments"],
      // response: {200:apiResponseSchema}
    },
    handler: paymentController.fetchDate,
  });
}
