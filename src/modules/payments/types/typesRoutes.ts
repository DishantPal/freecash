import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as paymentController from "./types.controller";
import { fetchTypesResponseSchema } from "./types.schema";
import { isAuthenticated } from "../../../middleware/authMiddleware";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "GET",
    url: "/fetch",
    schema: {
      tags: ["payments"],
      response: {
        200: fetchTypesResponseSchema,
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: paymentController.fetchTypes,
  });
}
