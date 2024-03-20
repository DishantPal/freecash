import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as taskController from "./task.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { ApiResponseSchema, fetchTaskQuerySchema } from "./task.schemas";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch",
    schema: {
      querystring: fetchTaskQuerySchema,
      tags: ["tasks"],
      response: {
        // 200: ApiResponseSchema,
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: taskController.fetch,
  });
}
