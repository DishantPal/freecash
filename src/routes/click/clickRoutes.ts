import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as taskController from "./clicks.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { clickTaskQuerySchema } from "./clicks.schema";
import { z } from "zod";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/insert",
    schema: {
      tags: ["Clicks"],
      querystring: clickTaskQuerySchema,
      response: {
        200: z.object({
          success: z.boolean(),
          message: z.string(),
          error: z.string(),
          msg: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: taskController.insert,
  });
}
